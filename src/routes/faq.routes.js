module.exports = function(app) {

    var faq = require('../controllers/faq.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('faq');

    // Create a new Idea
    app.post('/api/faqs', verify.verifyToken, faq.create);

    // Retrieve all Idea
    app.get('/api/faqs', verify.verifyToken, faq.findAll);

    // Retrieve a single Idea by Id
    app.get('/api/faqs/:faqId', verify.verifyToken, faq.findOne);

    // Update a Idea with Id
    app.put('/api/faqs/:faqId', verify.verifyToken, faq.update);

    // Delete a Idea with Id
    app.delete('/api/faqs/:faqId', verify.verifyToken, faq.delete);
}