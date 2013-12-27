
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

app.get( '/project/edit/:id', project.edit );
app.post('/project/edit/:id', project.doEdit );

app.get( '/project/delete/:id', project.confirmDelete );
app.post('/project/delete/:id', project.doDelete );


// go!
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
