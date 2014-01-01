
var mongoose = require('mongoose');


/**
 * Schema plugins
 */
module.exports = function (schema, options) {

    schema.add({ createdOn: {
        type: Date,
        default: Date.now
    }});

    schema.add({ createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }});
};
