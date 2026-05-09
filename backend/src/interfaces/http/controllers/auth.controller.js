const authService = require('../../../domains/admin/services/AuthService');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async me(req, res) {
    res.json({ success: true, user: req.user });
  }

  async forgotPassword(req, res, next) {
    try {
      await authService.requestPasswordReset(req.body.email);
      // Always 200 — do not reveal whether the email exists.
      res.json({
        success: true,
        message:
          'If that email belongs to an admin account, a reset link has been sent.',
      });
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      const result = await authService.resetPassword(token, password);
      res.json({
        success: true,
        message: 'Password reset successfully. You can now sign in.',
        email: result.email,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
