module.exports = function(app) {

    var setup = require('../controllers/setup.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('setup');

    // Create a new Idea
    app.post('/api/setups', verify.verifyToken, setup.create);

    // Retrieve all Idea
    app.get('/api/setups', verify.verifyToken, setup.findAll);

    // Retrieve a single Idea by Id
    app.get('/api/setups/:setupId', verify.verifyToken, setup.findOne);

    // Update a Idea with Id
    app.put('/api/setups/:setupId', verify.verifyToken, setup.update);

    // Delete a Idea with Id
    app.delete('/api/setups/:setupId', verify.verifyToken, setup.delete);
}