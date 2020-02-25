module.exports = function(app) {

    var idea = require('../controllers/idea.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('idea');

    // Create a new Idea
    app.post('/api/ideas', verify.verifyToken, idea.create);

    // Retrieve all Idea
    app.get('/api/ideas', verify.verifyToken, idea.findAll);

    // Retrieve a single Idea by Id
    app.get('/api/ideas/:ideaId', verify.verifyToken, idea.findOne);

    // Update a Idea with Id
    app.put('/api/ideas/:ideaId', verify.verifyToken, idea.update);

    // Delete a Idea with Id
    app.delete('/api/ideas/:ideaId', verify.verifyToken, idea.delete);
}