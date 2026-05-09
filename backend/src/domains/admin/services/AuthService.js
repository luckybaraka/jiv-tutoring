const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Admin = require('../../../infrastructure/database/admin.model');
const PasswordReset = require('../../../infrastructure/database/passwordReset.model');
const { UnauthorizedError, ValidationError } = require('../../../shared/errors');
const logger = require('../../../shared/logger');
const notificationService = require('../../notification/services/NotificationService');

const RESET_TOKEN_TTL_MINUTES = 30;

const hashToken = (raw) =>
  crypto.createHash('sha256').update(raw).digest('hex');

class AuthService {
  async login(email, password) {
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) throw new UnauthorizedError('Invalid credentials');

    const ok = await admin.verifyPassword(password);
    if (!ok) throw new UnauthorizedError('Invalid credentials');

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return {
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  /**
   * Initiates a password reset. Always succeeds at the API level (does not
   * leak whether the email exists). If the email matches an admin, generates
   * a token, persists its hash, and sends an email with the reset link.
   */
  async requestPasswordReset(email) {
    const admin = await Admin.findOne({ email: String(email).toLowerCase() });
    if (!admin) {
      logger.info(`Password reset requested for unknown email: ${email}`);
      return;
    }

    await PasswordReset.deleteMany({ adminId: admin._id, usedAt: null });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);

    await PasswordReset.create({
      adminId: admin._id,
      tokenHash: hashToken(rawToken),
      expiresAt,
    });

    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontend}/admin/reset-password?token=${rawToken}`;

    logger.info(`Password reset link for ${admin.email}: ${resetUrl}`);

    try {
      await notificationService.sendPasswordReset(admin, resetUrl, RESET_TOKEN_TTL_MINUTES);
    } catch (err) {
      logger.error('Password reset email failed to send:', err.message);
    }
  }

  /**
   * Consumes a reset token and sets a new password.
   * Throws if the token is invalid, expired, or already used.
   */
  async resetPassword(rawToken, newPassword) {
    if (!rawToken || typeof rawToken !== 'string') {
      throw new ValidationError('Reset token is required');
    }
    if (!newPassword || newPassword.length < 8) {
      throw new ValidationError('Password must be at least 8 characters');
    }

    const reset = await PasswordReset.findOne({
      tokenHash: hashToken(rawToken),
      usedAt: null,
      expiresAt: { $gt: new Date() },
    });
    if (!reset) {
      throw new ValidationError('Reset link is invalid or has expired');
    }

    const admin = await Admin.findById(reset.adminId);
    if (!admin) throw new ValidationError('Admin account no longer exists');

    admin.passwordHash = await Admin.hashPassword(newPassword);
    await admin.save();

    reset.usedAt = new Date();
    await reset.save();

    logger.info(`Password reset for admin ${admin.email}`);
    return { email: admin.email };
  }

  /** Bootstraps a default admin if none exists (uses env defaults). */
  async ensureDefaultAdmin() {
    const count = await Admin.countDocuments({});
    if (count > 0) return;

    const email = process.env.ADMIN_DEFAULT_EMAIL || 'info@jivtutoring.com';
    const password = process.env.ADMIN_DEFAULT_PASSWORD || 'ChangeThisInProduction!2026';
    const passwordHash = await Admin.hashPassword(password);

    await Admin.create({
      email,
      passwordHash,
      name: 'JIV Admin',
      role: 'SUPER_ADMIN',
    });
    logger.info(`✅ Default admin created: ${email}`);
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }
}

module.exports = new AuthService();
