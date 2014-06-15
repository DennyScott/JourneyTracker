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
			}
    }),

		this.route('inventory', {
			path: 'inventory'
		})
});
