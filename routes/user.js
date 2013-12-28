var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );


exports.index = function (req, res) {
    if (req.session.loggedIn === 'true') {  // NOTE need strict check against String
        res.render('user-page', {
            title: req.session.user.name,
            name: req.session.user.name,
            email: req.session.user.email,
            userId: req.session.user._id
        });
    }
    else {
        res.redirect('/login');
    }
};

exports.create = function (req, res) {
    res.render('user-form', {
        title: 'Create user'
    });
};

exports.doCreate = function (req, res) {
    var now = Date.now();

    User.create({
        name: req.body.fullName,
        email: req.body.email,
        modifiedOn: now,
        lastLogin: now

    }, function (err, user) {
        if (err) {
            console.error(err);

            if (err.code === 11000) {
                res.redirect('/user/new?exists=true');
            }
            else {
                res.redirect('/?error=true');
            }
        }
        else {
            console.log("User created and saved: ", user);

            req.session.user = {
                name: user.name,
                email: user.email,
                id: user._id
            };

            req.session.loggedIn = 'true';

            res.redirect('/user');
        }

    });
};

exports.edit = function (req, res) {
    res.redirect('/?TODO=implement');
};

exports.doEdit = function (req, res) {
    res.redirect('/?TODO=implement');
};

exports.confirmDelete = function (req, res) {
    res.redirect('/?TODO=implement');
};

exports.doDelete = function (req, res) {
    res.redirect('/?TODO=implement');
};

exports.login = function (req, res) {
    res.render('login-form', {
        title: 'Login'
    });
};

exports.doLogin = function (req, res) {
    var email = req.body.email;

    if (!email) res.redirect('/login?404=error');

    User.findOne({

        email: req.body.email

    }, '_id name email',

    function (err, user) {

        if (err || !user) {
            res.redirect('/login?404=error');
        }

        req.session.user = {
            name: user.name,
            email: user.email,
            _id: user._id
        };

        console.log('Logged in user: ', user);

        req.session.loggedIn = 'true';

        res.redirect('/user');
    });
};

exports.logout = function (req, res) {
    res.redirect('/?TODO=implement');
};
