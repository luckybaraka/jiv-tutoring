const router = require('express').Router();
const newsController = require('../controllers/news.controller');

router.get('/', newsController.list.bind(newsController));

module.exports = router;
