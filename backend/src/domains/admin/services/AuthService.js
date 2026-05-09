const jwt = require('jsonwebtoken');
const Admin = require('../../../infrastructure/database/admin.model');
const { UnauthorizedError } = require('../../../shared/errors');
const logger = require('../../../shared/logger');

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

  /** Bootstraps a default admin if none exists (uses env defaults). */
  async ensureDefaultAdmin() {
    const count = await Admin.countDocuments({});
    if (count > 0) return;

    const email = process.env.ADMIN_DEFAULT_EMAIL || 'joantheresa26@gmail.com';
    const password = process.env.ADMIN_DEFAULT_PASSWORD || 'ChangeThisInProduction!2026';
    const passwordHash = await Admin.hashPassword(password);

    await Admin.create({
      email,
      passwordHash,
      name: 'Joan Theresa',
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
