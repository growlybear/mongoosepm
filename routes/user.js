var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );

exports.create = function (req, res) {
    res.render('user-form', {
        title: 'Create user'
    });
};
