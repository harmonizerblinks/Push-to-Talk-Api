// FETCH all Regions
exports.findAll = (req, res) => {
    console.log('fine All', req.query.url);
    var unirest = require('unirest');
    var reqs = unirest('GET', req.query.url)
        .end((response) => {
            if (response.error) throw new Error(response.error);
            console.log(response.raw_body);
            res.send(response.raw_body)
        });
};