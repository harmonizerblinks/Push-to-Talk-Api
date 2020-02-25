const Faq = require('../models/faq.model.js');


// POST a Faq
exports.create = (req, res) => {
    // Create a Faq
    const faq = new Faq(req.body);

    // Save a Faq in the MongoDB
    faq.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Faqs
exports.findAll = (req, res) => {
    console.log('fine All');
    Faq.find()
        .then(faqs => {
            // console.log(faqs)
            res.send(faqs);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Faq
exports.findOne = (req, res) => {
    Faq.findById(req.params.faqId)
        .then(faq => {
            if (!faq) {
                return res.status(404).send({
                    message: "Faq not found with id " + req.params.faqId
                });
            }
            res.send(slider);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Faq not found with id " + req.params.faqId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Faq with id " + req.params.faqId
            });
        });
};

// UPDATE a Faq
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find faq and update it
    Faq.findByIdAndUpdate(req.params.faqId, body, { new: true })
        .then(faq => {
            if (!faq) {
                return res.status(404).send({
                    message: "Faq not found with id " + req.params.faqId
                });
            }
            res.send(faq);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Faq not found with id " + req.params.faqId
                });
            }
            return res.status(500).send({
                message: "Error updating faq with id " + req.params.faqId
            });
        });
};

// DELETE a Faq
exports.delete = (req, res) => {
    Faq.findByIdAndRemove(req.params.faqId)
        .then(faq => {
            if (!faq) {
                return res.status(404).send({
                    message: "Faq not found with id " + req.params.faqId
                });
            }
            res.send({ message: "Faq deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Faq not found with id " + req.params.faqId
                });
            }
            return res.status(500).send({
                message: "Could not delete faq with id " + req.params.faqId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}