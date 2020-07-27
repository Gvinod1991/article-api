const { 
    validateCreateArticle
} = require('../../utils/inputValidation');
const {fileUpload}=require('../../utils/upload')
function articleRoutes() {
  const articleController= require('./article.controller');
  return (open, closed, appOpen, appClosed) => {
      closed.route('/articles').get(articleController.allArticles);
      appOpen.route('/articles').get(articleController.allOpenFeaturedArticles);
      appClosed.route('/articles').get(articleController.allFeaturedArticles);
      closed.route('/article/:_id').get(articleController.getOneArticle);
      appClosed.route('/article/:id').get(articleController.getOneArticle);
      appOpen.route('/article/:id').get(articleController.getOpenArticle);
      appClosed.route('/article/:topic_id').get(articleController.articleByTopic);
      appClosed.route('/articles-by-tag-name').get(articleController.articlesByTagName);
      appOpen.route('/articles-by-tag-name').get(articleController.articlesByTagName);
      closed.route('/article').post(fileUpload.single('articleImage'),validateCreateArticle,articleController.createArticle);
      closed.route('/article/:id').put(fileUpload.single('articleImage'),validateCreateArticle,articleController.updateArticle);
  }
}

module.exports = articleRoutes();
