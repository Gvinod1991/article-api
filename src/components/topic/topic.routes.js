const { 
} = require('../../utils/inputValidation');

function topicRoutes() {
  const topicController= require('./topic.controller');
  return (open, closed, appOpen, appClosed) => {
        closed.route('/topics').get(topicController.allTopics);
        appClosed.route('/topics').get(topicController.allTopics);
        closed.route('/topic/:_id').get(topicController.getOneTopic);
        appClosed.route('/topic/:id').get(topicController.getOneTopic);
        closed.route('/topic').post(topicController.createTopic);
        closed.route('/topic:_id').put(topicController.updateTopic);
  }
}

module.exports = topicRoutes();
