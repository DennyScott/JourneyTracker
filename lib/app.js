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
		data: function() {
			if(Meteor.user()){
				var prof = Profiles.findOne({"userID" : Meteor.user()._id});
				if(prof){
					return prof;
				} else {
					return {};
				}
			} else {
				return {};
			}
		}
    }),

		this.route('inventory', {
			path: 'inventory'
		})
});
