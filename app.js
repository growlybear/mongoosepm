
/**
 * Module dependencies.
 */

var express = require('express');

var db      = require('./models/db');

var routes  = require('./routes');
var user    = require('./routes/user');
var project = require('./routes/project');

var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


// routes
app.get('/', routes.index);

// user routes
app.get( '/user', user.index );

app.get( '/user/new', user.create );
app.post('/user/new', user.doCreate );

app.get( '/user/edit', user.edit );
app.post('/user/edit', user.doEdit );

app.get( '/user/delete', user.confirmDelete );
app.post('/user/delete', user.doDelete );

app.get( '/login', user.login );
app.post('/login', user.doLogin );

app.get( '/logout', user.logout );


// project routes
app.get( '/project', project.index );

app.get( '/project/new', project.create );
app.post('/project/new', project.doCreate );

app.get( '/project/:id', project.displayInfo );
app.get( '/project/createdby/:userid', project.byUser );

app.get( '/project/edit/:id', project.edit );
app.post('/project/edit/:id', project.doEdit );

app.get( '/project/delete/:id', project.confirmDelete );
app.post('/project/delete/:id', project.doDelete );


// assume 404 at this point as nothing else responded
app.use(function(req, res, next){
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
    }

    // respond with json
    if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});

// error-handling middleware require an
// arity of 4, ie. the signature (err, req, res, next).
// when connect has an error, it will invoke ONLY error-handling
// middleware.

// If we were to next() here any remaining non-error-handling
// middleware would then be executed, or if we next(err) to
// continue passing the error, only error-handling middleware
// would remain being executed, however here
// we simply respond with an error page.

app.use(function(err, req, res, next){
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
    res.status(err.status || 500);
    // TODO implement this
    res.render('500', { error: err });
});


// go!
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
