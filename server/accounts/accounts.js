Meteor.startup(function() {
	AccountsEntry.config({
		defaultProfile: {
			someDefault: 'default'
		}
	});
	Accounts.onCreateUser(function(options, user) {
		Meteor.call('addProfile', {firstName: "", lastName: "", userName: user.emails[0].address, userID: user._id}, function (error, result) {});
	});
});
