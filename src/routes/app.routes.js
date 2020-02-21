module.exports = function(app) {

    var department = require('../controllers/department.controller.js');
    // var user = require('../controllers/user.controller.js');
    var apps = require('../controllers/app.controller.js');
    var telefonika = require('../controllers/telefonika.controller.js');
    var ideas = require('../controllers/idea.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('booking');

    // App user Login
    app.post('/app/login', apps.login);

    // Register App User
    app.post('/app/register', apps.createuser);

    // Register App User
    app.post('/api/register', apps.createuser);

    // Retrieve user Detail
    app.get('/app/profile', verify.verifyToken, apps.profile);

    // Retrieve user Ideas
    app.get('/app/ideas/:userId', verify.verifyToken, apps.findAllIdeas);

    // Add user Ideas
    app.post('/app/ideas', verify.verifyToken, apps.createIdea);

    // Retrieve all Department
    app.get('/app/departments', department.findAll);

    // Retrieve a single Department by Id
    app.get('/app/department/:departmentId', apps.findOne);

    // Update a Region with Id
    app.get('/app/user/:userId', apps.findOneUser);

    // Update a Region with Id
    app.put('/app/user/:userId', apps.updateUser);

    // Retrieve all Department
    app.get('/orders', telefonika.findAll);

}