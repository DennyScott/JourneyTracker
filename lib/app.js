Router.configure({
	layoutTemplate: 'default',
	yieldTemplates: {
		'header': {to: 'header'},
		'footer': {to: 'footer'}
	},
});

Router.map(function() {
	this.route('home', {
		path: '/',
		layoutTemplate: 'front',
		yieldTemplates: {
			'header': {to: 'header'}
		},
		onBeforeAction: function(){
			AccountsEntry.signInRequired(this)
		},
		data: function() {
			if(Meteor.user()){
				var prof = Profiles.findOne({"userID" : Meteor.user()._id});
				if(prof){
					return prof;
				} else{
					Meteor.call('addProfile', {firstName: "", lastName: "", userName: "newUser", userID: Meteor.user()._id}, function (error, result) {});
					prof = Profiles.findOne({"userID" : Meteor.user()._id});
					return prof;
				}

			}
		}
	}),

	this.route('inventory', {
		path: 'inventory'
	}),
	this.route('settings', {
		path: 'settings'
	})
});



//Force all pages to load at the top of the page, and remove any styles to body
var loadAtTop = function() {
	window.scrollTo(0,0);
	var body = $('body');
	body.removeAttr('style'); //Static pages were being made larger by height attr.
};

Router.onRun(loadAtTop); //Load all pages from the top of the page.
