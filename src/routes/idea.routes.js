module.exports = function(app) {

    var idea = require('../controllers/idea.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('idea');

    // Create a new Region
    app.post('/api/ideas', verify.verifyToken, idea.create);

    // Retrieve all Region
    app.get('/api/ideas', verify.verifyToken, idea.findAll);

    // Retrieve a single Region by Id
    app.get('/api/ideas/:ideaId', verify.verifyToken, idea.findOne);

    // Update a Region with Id
    app.put('/api/ideas/:ideaId', verify.verifyToken, idea.update);

    // Delete a Region with Id
    app.delete('/api/ideas/:ideaId', verify.verifyToken, idea.delete);
}