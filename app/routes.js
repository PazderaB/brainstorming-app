var Idea = require('./models/idea');
var sha1 = require('sha1');
var salt="64gsdgf655g565h45g6h4a64w89egwev1v23cx1v4xzejioqp2387fsv4fx6bx822907";
var admin = 'admin';
var pass = 'pass';
var hash = sha1(pass+salt);

function getIdeas(res) {
    Idea.find(function (err, ideas) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(ideas); // return all ideas in JSON format
    });
};

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all ideas
    app.get('/api/ideas', function (req, res) {
            // use mongoose to get all ideas in the database
            getIdeas(res);
        
    });

    // create idea and send back all ideas after creation
    app.post('/api/ideas', function (req, res) {

        // create a idea, information comes from AJAX request from Angular
        Idea.create({
            text: req.body.text,
            done: false
        }, function (err, idea) {
            if (err)
                res.send(err);

            // get and return all the ideas after you create another
            getIdeas(res);
        });

    });

    // delete a idea
    app.delete('/api/ideas/:idea_id', function (req, res) {
        Idea.remove({
            _id: req.params.idea_id
        }, function (err, idea) {
            if (err)
                res.send(err);

            getIdeas(res);
        });
    });

    app.post('/api/authenticate', function (req, res) {
        var isAuthenticated = false;

        if (req.body.username === admin && req.body.password === pass)
            isAuthenticated = hash;
        res.json({callback:isAuthenticated})
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
