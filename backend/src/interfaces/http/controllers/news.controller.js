const newsService = require('../../../domains/notification/services/NewsService');

class NewsController {
  async list(req, res, next) {
    try {
      const result = await newsService.getEducationNews();
      res.json({
        success: true,
        source: result.source,
        count: result.articles.length,
        data: result.articles,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NewsController();
