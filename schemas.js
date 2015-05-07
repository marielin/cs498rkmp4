Users = new Mongo.Collection("users");
Tasks = new Mongo.Collection("tasks");

var Schemas = {};

Schemas.User = new SimpleSchema({
	name: { type: String },
	email: { type: String, unique: true },
	pendingTasks: { type: [String] },
	dateCreated: { type: Date }
});

Schemas.Task = new SimpleSchema({
	name: { type: String },
	description: { type: String, optional: true },
	deadline: { type: Date, optional: true }, // optional or not?
	completed: { type: Boolean },
	assignedUser: { type: String },
	assignedUserName: { type: String },
	dateCreated: { type: Date }
});

Users.attachSchema(Schemas.User);
Tasks.attachSchema(Schemas.Task);