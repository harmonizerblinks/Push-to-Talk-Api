module.exports = function(app) {

    var department = require('../controllers/department.controller.js');
    var ideas = require('../controllers/idea.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('booking');

    // Create a new Region
    app.post('/api/bookings', department.create);

    // Retrieve all Region
    app.get('/api/bookings', department.findAll);

    // Retrieve a single Region by Id
    app.get('/api/bookings/:bookingId', department.findOne);

    // Update a Region with Id
    app.put('/api/bookings/:bookingId', department.update);

    // Delete a Region with Id
    app.delete('/api/bookings/:bookingId', department.delete);
}