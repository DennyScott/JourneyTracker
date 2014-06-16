Template.front.events({
	'click .lid-navigation' : function(e) {
		var myNavigation = $(e.currentTarget).attr('data-navigation');
		var foundPage = $('#pages').children('.activePage').addClass('animated fadeOut');
		
		setTimeout(function() {
	 		foundPage.removeClass('activePage animated fadeOut');	
			$('#' + myNavigation + '-page').addClass('activePage animated fadeIn');

		}, 700);	

				console.log(myNavigation);
	}
});
