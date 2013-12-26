var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );

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

            req.session.loggedIn = true;

            res.redirect('/user');
        }

    });
};
