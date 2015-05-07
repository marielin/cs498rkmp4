// Client

Router.route('/', function() {
	this.redirect('/users');
});

Router.route('/users', function() {
	this.render('users');
});

Router.route('/tasks', function() {
	this.render('tasks');
});

Router.route('/users/:_id', function() {
	this.render('userDetail', {
		data: function() {
			return Users.findOne({_id: this.params._id});
		}
	});
});

Router.route('/tasks/:_id', function() {
	this.render('taskDetail', {
		data: function() {
			return Tasks.findOne({_id: this.params._id});
		}
	});
});