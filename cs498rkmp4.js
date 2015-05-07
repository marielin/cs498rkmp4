if (Meteor.isClient) {
	// Meteor.subscribe("users");
	// Meteor.subscribe("tasks", Session.get('page'));

	Session.set('tasks-page', 0);
	Session.set('tasks-pageLimit', 10);
	Session.set('tasks-filter', 0);
	Session.set('tasks-sort', "dateCreated");
	Session.set('tasks-order', 1);

	Template.body.helpers({

	});

	Template.body.events({

	});

	Template.users.helpers({
		users: function() {
			return Users.find();
		}
	});

	Template.users.events({
		"click .delete-user": function() {
			Meteor.call("deleteUser", this._id);
		}
	});

	Template.userDetail.helpers({
		userPendingTasks: function() {
			console.log(this.pendingTasks[0]);
			return Tasks.find({ _id: { $in: this.pendingTasks } });
		}
	});

	Template.userDetail.events({
		"click .toggle-completed": function() {
			Meteor.call("completeTask", this._id, ! this.completed);
		}
	});

	Template.addUser.helpers({

	});

	Template.addUser.events({
		"submit .add-user": function() {
			var name = event.target.name.value;
			var email = event.target.email.value;
			Meteor.call("addUser", name, email);
			return false;
		}
	});

	Template.tasks.helpers({
		tasks: function() {
			var query = {
				sort: {},
				limit: Session.get('tasks-pageLimit'),
				skip: Session.get('tasks-pageLimit') * Session.get('tasks-page'),
			};
			query.sort[Session.get('tasks-sort')] = Session.get('tasks-order');

			if (Session.get('tasks-filter') == "pending")
				return Tasks.find({ completed: false }, query);
			else if (Session.get('tasks-filter') == "completed")
				return Tasks.find({ completed: true }, query);
			return Tasks.find({}, query);
		}
	});

	Template.tasks.events({
		"click .tasks-next": function() {
			var taskCount = Tasks.find().count();
			if ((Session.get('tasks-page') + 1) * Session.get('tasks-pageLimit') < taskCount) Session.set('tasks-page', Session.get('tasks-page') + 1);
		},
		"click .tasks-prev": function() {
			if (Session.get('tasks-page') > 0)
				Session.set('tasks-page', Session.get('tasks-page') - 1);
		},
		"click .delete-task": function() {
			Meteor.call("deleteTask", this._id);
		},
		"click .tasks-filter": function() {
			Session.set('tasks-filter', event.target.value);
		},
		"click .tasks-order": function() {
			Session.set('tasks-order', event.target.value);
		},
		"click .tasks-sort": function() {
			Session.set('tasks-sort', event.target.value);
		}
	});

	Template.addTask.helpers({
		users: function() {
			return Users.find();
		},
	});

	Template.taskDetail.helpers({

	});

	Template.taskDetail.events({
		"click .toggle-completed": function() {
			Meteor.call("completeTask", this._id, ! this.completed);
		}
	});

	Template.addTask.events({
		"submit .add-task": function() {
			var name = event.target.name.value;
			var description = event.target.description.value;
			var deadline = event.target.deadline.value;
			var assignedUser = event.target.owner.value;
			console.log(deadline);
			Meteor.call("addTask", name, description, deadline, assignedUser);
			return false;
		}
	});

	Template.datePicker.rendered=function() {
		$('#my-datepicker').datepicker();
	}
}

Meteor.methods({
	addUser: function(name, email) {
		var pendingTasks = [];
		Users.insert({
			name: name,
			email: email,
			pendingTasks: pendingTasks,
			dateCreated: new Date()
		});
	},
	addTask: function(name, description, deadline, assignedUserId) {
		var assignedUserName = Users.findOne({_id: assignedUserId}).name;
		var taskId = Tasks.insert({
			name: name,
			description: description,
			deadline: deadline,
			completed: false,
			assignedUser: assignedUserId,
			assignedUserName: assignedUserName,
			dateCreated: new Date()
		});
		var userPendingTasks = Users.findOne(assignedUserId).pendingTasks
		userPendingTasks.push(taskId);
		Users.update(assignedUserId, { $set: { pendingTasks: userPendingTasks } })
	},
	deleteUser: function(userId) {
		Users.remove(userId);
	},
	deleteTask: function(taskId) {
		Tasks.remove(taskId);
	},
	completeTask: function(taskId, completed) {
		Tasks.update(taskId, { $set: {completed: completed} });
	}
});

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
	});

	// Meteor.publish("users", function () {
	// 	return Users.find({});
	// });

	// Meteor.publish("tasks", function (sort, ascending, page) {
	// 	if (!order) sort = "-" + sort;
	// 	return Tasks.find({}, { sort: sort, limit: 10, skip: 10 * page });
	// });

	// Meteor.publish("tasks", function (page) {
	// 	return Tasks.find({}, { limit: 1, skip: 1 * page });
	// });
}

