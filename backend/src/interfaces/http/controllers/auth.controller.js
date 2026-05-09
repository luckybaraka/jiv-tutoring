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
}

module.exports = new AuthController();
