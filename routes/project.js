var mongoose = require( 'mongoose' );
var Project = mongoose.model( 'Project' );


exports.index = function (req, res) {
    console.log('Don\'t think we should be in here');
};

exports.create = function (req, res) {
    if (req.session.loggedIn === 'true') {
        res.render('project-form', {
            title: 'Create project',
            userid: req.session.user._id,
            userName: req.session.user.name,
            buttonText: 'Make it so!'
        });
    }
    else {
        res.redirect('/login');
    }
};

exports.doCreate = function (req, res) {
    var now = Date.now();

    Project.create({
        projectName: req.body.projectName,
        createdBy: req.body.userid,
        createdOn : Date.now(),
        tasks : req.body.tasks

    }, function (err, project) {
        if (err) {
            console.error(err);
            res.redirect('/?error=project');
        }
        else {
            console.log("Project created and saved: ", project);
            console.log("project._id = ", project._id);
            res.redirect('/project/' + project._id);
        }

    });
};

exports.displayInfo = function (req, res) {
    var id = req.params.id;

    if (req.session.loggedIn !== 'true') {
        res.redirect('/login');
    }
    if (!id) {
        res.redirect('/user');
    }

    Project.findById(id, function (err, project) {
        if (err) {
            console.log(err);
            res.redirect('/user?404=project');
        }
        else {
            console.log(project);

            res.render('project-page', {
                title: project.projectName,
                projectName: project.projectName,
                tasks: project.tasks,
                createdBy: project.createdBy,
                projectId: id
            });
        }
    });
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
    if (req.session.loggedIn !== 'true') {
        res.redirect('/login');
    }

    var id = req.params.id;

    if (!id) {
        res.redirect('/user');
    }

    Project.findById(id, function (err, project) {
        if (err) {
            console.log('Problem finding project ', id);
        }

        res.render('project-form', {
            title: 'Edit project',
            userid: req.session.user._id,
            userName: req.session.user.name,
            projectId: req.params.id,
            projectName: project.projectName,
            tasks: project.tasks,
            buttonText: 'Make the change!'
        });
    });

};

exports.doEdit = function (req, res) {
    if (req.session.loggedIn !== 'true') {
        res.redirect('/login');
    }

    var id = req.body.projectId;
    if (!id) {
        // TODO better error handling
        console.log('project.doEdit error: no projectId ', id);
        res.redirect('/user');
    }

    Project.findById(id, function (err, project) {
        if (err) return err;


        project.projectName = req.body.projectName;
        project.tasks = req.body.tasks;
        project.modifiedOn = Date.now();

        project.save(function (err, project) {
            if (err) return err;

            console.log('Project updated: ', req.body.projectName);
            res.redirect('/project/' + req.body.projectId);
        });
    });
};

exports.confirmDelete = function (req, res) {
    res.redirect('/?TODO=implement');
};

exports.doDelete = function (req, res) {
    res.redirect('/?TODO=implement');
};
