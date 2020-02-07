module.exports = function(app) {

    var department = require('../controllers/department.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('department');

    // Create a new department
    app.post('/api/departments', department.create);

    // Retrieve all department
    app.get('/api/departments', department.findAll);

    // Retrieve a single department by Id
    app.get('/api/departments/:departmentId', department.findOne);

    // Update a department with Id
    app.put('/api/departments/:departmentId', department.update);

    // Delete a department with Id
    app.delete('/api/departments/:departmentId', department.delete);
}