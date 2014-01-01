var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );


// utility functions
function clearSession(session, callback) {
    session.destroy();
    callback();
}


// routes
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
        title: 'Create user',
        name: '',
        email: '',
        buttonText: 'Join!'
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
                _id: user._id
            };

            req.session.loggedIn = 'true';

            res.redirect('/user');
        }

    });
};

exports.edit = function (req, res) {
    if (req.session.loggedIn !== 'true') {
        res.redirect('/login');
    }

    res.render('user-form', {
        title: 'Edit profile',
        _id: req.session.user._id,
        name: req.session.user.name,
        email: req.session.user.email,
        buttonText: 'Save'
    });
};

exports.doEdit = function (req, res) {
    var id = req.session.user._id;

    if (id) {
        User.findById(id, function (err, user) {
            if (err) {
                console.log('user.doEdit error: ', err);
                res.redirect('/user?error=finding');
            }

            user.name = req.body.fullName;
            user.email = req.body.email;
            user.modifiedOn = Date.now();

            user.save(function (err) {
                if (err) {
                    console.log('user.doEdit::user.save error: ', err);
                }

                console.log('User updated: ', req.body.fullName);
                req.session.user.name = req.body.fullName;
                req.session.user.email = req.body.email;

                res.redirect('/user');
            })
        });
    }
};

exports.confirmDelete = function (req, res) {
    res.render('user-delete-form', {
        title: 'Delete account',
        _id: req.session.user._id,
        name: req.session.user.name,
        email: req.session.user.email
    });
};

exports.doDelete = function (req, res) {
    var id = req.body._id;

    if (id) {

        User.findByIdAndRemove(id, function (err, user) {
            if (err) {
                console.log('user.doDelete - Error deleting user ', id);
                return res.redirect('/user?error=deleting');
            }

            console.log('User deleted: ', user);
            clearSession(req.session, function () {
                res.redirect('/');
            });
        });

        // TODO delete all projects created by this user
    }
};

exports.login = function (req, res) {
    res.render('login-form', {
        title: 'Login'
    });
};

exports.doLogin = function (req, res) {
    var email = req.body.email;

    // no validation other than checking to see user exists
    if (!email) res.redirect('/login?404=error');

    User.findOne({

        email: req.body.email

    },

    // return only these fields from the database
    '_id name email',

    function (err, user) {

        if (err) {
            return res.redirect('/login?404=error');
        }
        if (!user) {
            return res.redirect('/login?404=usernotfound');
        }

        req.session.user = {
            name: user.name,
            email: user.email,
            _id: user._id
        };

        console.log('Logged in user: ', user);

        req.session.loggedIn = 'true';

        User.update(
            { _id: user.id },
            { $set: { lastLogin: Date.now() } },
            function () {
                res.redirect('/user');
            }
        );

    });
};

exports.logout = function (req, res) {
    res.redirect('/?TODO=implement');
};
