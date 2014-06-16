var infoOpen = false;

Template.map.rendered = function() {

	$('#map-canvas').height($(window).height()/1.35);
	GoogleMaps.init(
		{
		'sensor': true, //optional
		//'key': 'MY-GOOGLEMAPS-API-KEY', //optional
		//'language': 'de' //optional
	}, 
	function(){
		loadMap();		
	});

	//Load BoxLid
	boxlid();
	$('.box-lid-menu').boxLid();	

	//Create Twitter Widget
	! function (d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (!d.getElementById(id)) {
			js = d.createElement(s);
			js.id = id;
			js.src = "//platform.twitter.com/widgets.js";
			fjs.parentNode.insertBefore(js, fjs);
		}
	}(document, "script", "twitter-wjs");

	$('a[title]').tooltip();
};

function loadMap(){
	var mapOptions = {
		zoom: 13,
	};
	var myLat =  new google.maps.LatLng(49.8994, -97.1392);
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	map.setCenter(myLat);


	var challenges = Challenges.find();
	var i = 1;
	var eventsAndChallenges = [];
	challenges.forEach(function (chal) {
		console.log("Hello");
		eventsAndChallenges[eventsAndChallenges.length] = [chal.name, chal.longitude, chal.latitude, i];
		i++;
	});
	
	// Add markers to the map

	// Marker sizes are expressed as a Size of X,Y
	// where the origin of the image (0,0) is located
	// in the top left of the image.

	// Origins, anchor positions and coordinates of the marker
	// increase in the X direction to the right and in
	// the Y direction down.
	var image = {
		url: 'img/challenge.png',
		// This marker is 20 pixels wide by 32 pixels tall.
		size: new google.maps.Size(20, 32),
		// The origin for this image is 0,0.
		origin: new google.maps.Point(0,0),
		// The anchor for this image is the base of the flagpole at 0,32.
		anchor: new google.maps.Point(0, 32)
	};
	// Shapes define the clickable region of the icon.
	// The type defines an HTML &lt;area&gt; element 'poly' which
	// traces out a polygon as a series of X,Y points. The final
	// coordinate closes the poly by connecting to the first
	// coordinate.
	var shape = {
		coords: [1, 1, 1, 20, 18, 20, 18 , 1],
		type: 'poly'
	};
	for (var i = 0; i < eventsAndChallenges.length; i++) {
		var eAndC = eventsAndChallenges[i];
		var myLatLng = new google.maps.LatLng(eAndC[1], eAndC[2]);
		var marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			shape: shape,
			animation: google.maps.Animation.DROP,
			title: eAndC[0],
			zIndex: eAndC[3]
		});

		var infowindow = new google.maps.InfoWindow({
			content : UI.toHTML(Template['map-popover'])
		});
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map,marker);
			$('#openModal').click(function(){
				$('.ui.modal').modal('show');
			});
		});
		$('#map-canvas').addClass('animated slideInRight');
	}
}

Template.map.events({

	'click #toggleStats' : function(e){
		e.preventDefault();
		var button = $('#toggleStats');
		var map = $('#map-canvas');

		if(!infoOpen){
			map.removeClass('col-md-12');
			map.addClass('col-md-8');
			setTimeout(function(){
				$('#stats').addClass('animated fadeIn show');
			},400);
			google.maps.event.trigger(map, 'resize');
			infoOpen = true;
		}else{
			map.removeClass('col-md-8');
			map.addClass('col-md-12');
			$('#stats').removeClass('animated fadeIn show');
			google.maps.event.trigger(map, 'resize');
			infoOpen = false;
		}
	},

	'click .tab-toggle' : function(e) {
		var priorDisplay =	$('#home-display').find(".activeOverlay");
		priorDisplay.addClass('animated slideOutLeft');

		setTimeout(function() {
			priorDisplay.removeClass('activeOverlay animated slideOutLeft');
			var currentTarget =  $('#' + $(e.currentTarget).attr('data-home'));
			currentTarget.addClass('animated slideInRight activeOverlay');
			if($(e.currentTarget).attr('data-home') === 'map-overlay'){
				$('#toggleStats').fadeIn();
			}else{
				$('#toggleStats').fadeOut();
			}

		},500);				
	}

});
