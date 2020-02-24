const Idea = require('../models/idea.model.js');


// POST a Idea
exports.create = (req, res) => {
    // Create a Idea
    const idea = new Idea(req.body);

    // Save a Idea in the MongoDB
    idea.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Ideas
exports.findAll = (req, res) => {
    console.log('fine All');
    let query = [{
        $lookup: {
            from: 'users',
            localField: 'userid',
            foreignField: '_id',
            as: 'user'
        },
    }, {
        $lookup: {
            from: 'departments',
            localField: 'departmentid',
            foreignField: '_id',
            as: 'department'
        },
    }, { $sort: { created: 1 } }];
    Idea.aggregate(query)
        .then(ideas => {
            // console.log(ideas)
            res.send(ideas);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Idea
exports.findOne = (req, res) => {
    Idea.findById(req.params.ideaId)
        .then(idea => {
            if (!idea) {
                return res.status(404).send({
                    message: "Idea not found with id " + req.params.ideaId
                });
            }
            res.send(slider);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Idea not found with id " + req.params.ideaId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Idea with id " + req.params.ideaId
            });
        });
};

// UPDATE a Idea
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find idea and update it
    Idea.findByIdAndUpdate(req.params.ideaId, body, { new: true })
        .then(idea => {
            if (!idea) {
                return res.status(404).send({
                    message: "Idea not found with id " + req.params.ideaId
                });
            }
            res.send(idea);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Idea not found with id " + req.params.ideaId
                });
            }
            return res.status(500).send({
                message: "Error updating idea with id " + req.params.ideaId
            });
        });
};

// DELETE a Idea
exports.delete = (req, res) => {
    Idea.findByIdAndRemove(req.params.ideaId)
        .then(idea => {
            if (!idea) {
                return res.status(404).send({
                    message: "Idea not found with id " + req.params.ideaId
                });
            }
            res.send({ message: "Idea deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Idea not found with id " + req.params.ideaId
                });
            }
            return res.status(500).send({
                message: "Could not delete idea with id " + req.params.ideaId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}