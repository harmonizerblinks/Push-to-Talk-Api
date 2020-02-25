const Department = require('../models/department.model.js');


// POST a Department
exports.create = (req, res) => {
    // Create a Department
    const department = new Department(req.body);

    // Save a Department in the MongoDB
    department.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Regions
exports.findAll = (req, res) => {
    console.log('fine All');
    Department.find()
        .then(departments => {
            // console.log(departments)
            res.send(departments);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Department
exports.findOne = (req, res) => {
    Department.findById(req.params.departmentId)
        .then(department => {
            if (!department) {
                return res.status(404).send({
                    message: "Department not found with id " + req.params.departmentId
                });
            }
            res.send(department);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Department not found with id " + req.params.departmentId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Department with id " + req.params.departmentId
            });
        });
};

// UPDATE a Department
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find department and update it
    Department.findByIdAndUpdate(req.params.departmentId, body, { new: true })
        .then(department => {
            if (!department) {
                return res.status(404).send({
                    message: "Department not found with id " + req.params.departmentId
                });
            }
            res.send(department);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Department not found with id " + req.params.departmentId
                });
            }
            return res.status(500).send({
                message: "Error updating department with id " + req.params.departmentId
            });
        });
};

// DELETE a Department
exports.delete = (req, res) => {
    Department.findByIdAndRemove(req.params.departmentId)
        .then(department => {
            if (!department) {
                return res.status(404).send({
                    message: "Department not found with id " + req.params.departmentId
                });
            }
            res.send({ message: "Department deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Department not found with id " + req.params.departmentId
                });
            }
            return res.status(500).send({
                message: "Could not delete department with id " + req.params.departmentId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}