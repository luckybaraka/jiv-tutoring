const authService = require('../../../domains/admin/services/AuthService');
const { UnauthorizedError } = require('../../../shared/errors');

const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid Authorization header');
    }
    const token = header.split(' ')[1];
    const payload = authService.verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
