var mongoose = require( 'mongoose' );
var Project = mongoose.model( 'Project' );


exports.index = function (req, res) {
    if (req.session.loggedIn === true) {        // strict checking necessary?
        res.render('project-page', {
            title: req.session.project.name,
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
    res.render('project-form', {
        title: 'Create project'
    });
};

exports.doCreate = function (req, res) {
    var now = Date.now();

    Project.create({
        name: req.body.projectName,
        description: req.body.description,
        modifiedOn: now,
        lastLogin: now

    }, function (err, project) {
        if (err) {
            console.error(err);

            if (err.code === 11000) {
                res.redirect('/project/new?exists=true');   // hmmm ?
            }
            else {
                res.redirect('/?error=true');
            }
        }
        else {
            console.log("Project created and saved: ", project);

            res.redirect('/project');
        }

    });
};

exports.displayInfo = function (req, res) {
    res.redirect('/?TODO=implement');
};

exports.byUser = function (req, res) {
    console.log('Fetching projects by user ...');

    var userid = req.params.userid;

    if (userid) {
        Project.findByUserId(userid, function (err, projects) {
            if (err) {
                console.error(err);
                res.json({ status: 'error', error: 'Error finding projects'});
            }

            console.log('Projects: ', projects);
            res.json(projects);

        });
    }
    else {
        console.log('No user id supplied');
        res.json({ status: 'error', error: 'No user id supplied'})
    }
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
