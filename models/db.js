var mongoose = require('mongoose');

// build the connection string
var dbURI = 'mongodb://localhost/MongoosePM';

// create the database connection
mongoose.connect(dbURI);

// handle various database events
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to: ', dbURI);
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ', err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

// handle unexpected process termination
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected due to application termination');
        process.exit(0);
    });
});


/**
 * USER schema
 */
var userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: Date,
    lastLogin: Date
});

/**
 * USER model
 */
mongoose.model( 'User', userSchema );


/**
 * PROJECT schema
 */
var projectSchema = new mongoose.Schema({
    projectName: String,
    createdOn: { type: Date, default: Date.now },
    modifiedOn: Date,
    createdBy: String,
    contributors: String,
    tasks: String
});

/**
 * PROJECT static methods
 * NB. must be defined after the project schema is declared,
 *     but before the model is instantiated
 */
projectSchema.statics.findByUserId = function (userid, callback) {
    this.find(
        { createdBy: userid },
        '_id projectName',
        { sort: 'modifiedOn' },
        callback
    );
};

/**
 * PROJECT model
 */
mongoose.model( 'Project', projectSchema );

