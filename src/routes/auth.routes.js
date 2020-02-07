module.exports = function(app) {

    var users = require('../controllers/user.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');

    // User Login or Authentication
    app.post('/api/auth', users.login);

    // User Login or Authentication
    app.post('/api/reset', users.login);

    // User Login or Authentication
    app.post('/api/change_password', users.login);

    // Retrieve Current Login User Prodile
    app.get('/api/profile', verify.verifyToken, users.profile);

}