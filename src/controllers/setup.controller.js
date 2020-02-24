const Setup = require('../models/setup.model.js');


// POST a Setup
exports.create = (req, res) => {
    // Create a Setup
    const setup = new Setup(req.body);

    // Save a Setup in the MongoDB
    setup.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Setups
exports.findAll = (req, res) => {
    console.log('fine All');
    Setup.find()
        .then(setups => {
            // console.log(setups)
            res.send(setups);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Setup
exports.findOne = (req, res) => {
    Setup.findById(req.params.setupId)
        .then(setup => {
            if (!setup) {
                return res.status(404).send({
                    message: "Setup not found with id " + req.params.setupId
                });
            }
            res.send(slider);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Setup not found with id " + req.params.setupId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Setup with id " + req.params.setupId
            });
        });
};

// UPDATE a Setup
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find setup and update it
    Setup.findByIdAndUpdate(req.params.setupId, body, { new: true })
        .then(setup => {
            if (!setup) {
                return res.status(404).send({
                    message: "Setup not found with id " + req.params.setupId
                });
            }
            res.send(setup);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Setup not found with id " + req.params.setupId
                });
            }
            return res.status(500).send({
                message: "Error updating setup with id " + req.params.setupId
            });
        });
};

// DELETE a Setup
exports.delete = (req, res) => {
    Setup.findByIdAndRemove(req.params.setupId)
        .then(setup => {
            if (!setup) {
                return res.status(404).send({
                    message: "Setup not found with id " + req.params.setupId
                });
            }
            res.send({ message: "Setup deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Setup not found with id " + req.params.setupId
                });
            }
            return res.status(500).send({
                message: "Could not delete setup with id " + req.params.setupId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}