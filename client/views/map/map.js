var infoOpen = false;
var challengeIds = [];
var eventIds = [];

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



	// Add markers to the map

	// Marker sizes are expressed as a Size of X,Y
	// where the origin of the image (0,0) is located
	// in the top left of the image.

	// Origins, anchor positions and coordinates of the marker
	// increase in the X direction to the right and in
	// the Y direction down.
	var challengeImage = {
		url: 'img/walkingtour.png',
		// This marker is 20 pixels wide by 32 pixels tall.
		size: new google.maps.Size(30, 34),
		// The origin for this image is 0,0.
		origin: new google.maps.Point(0,0),
		// The anchor for this image is the base of the flagpole at 0,32.
		anchor: new google.maps.Point(0, 32)
	};

	// Add markers to the map

	// Marker sizes are expressed as a Size of X,Y
	// where the origin of the image (0,0) is located
	// in the top left of the image.

	// Origins, anchor positions and coordinates of the marker
	// increase in the X direction to the right and in
	// the Y direction down.
	var eventImage = {
		url: 'img/festival.png',
		// This marker is 20 pixels wide by 32 pixels tall.
		size: new google.maps.Size(30, 34),
		// The origin for this image is 0,0.
		origin: new google.maps.Point(0,0),
		// The anchor for this image is the base of the flagpole at 0,32.
		anchor: new google.maps.Point(0, 32)
	};

	var challenges = Challenges.find();
	var events = Events.find();
	var i = 1;
	var eventsAndChallenges = [];

	challenges.forEach(function (chal) {
		eventsAndChallenges[eventsAndChallenges.length] = [chal.name, chal.latitude, chal.longitude, i, challengeImage, chal.description];
		challengeIds.push(chal._id);
		i++;
	});

		events.forEach(function (evt) {
		eventsAndChallenges[eventsAndChallenges.length] = [evt.name, evt.latitude, evt.longitude, i, eventImage, evt.description];
		eventIds.push(evt._id);
		i++;
	});




	for (var i = 0; i < eventsAndChallenges.length; i++) {
		var eAndC = eventsAndChallenges[i];
			add_marker(eAndC[1], eAndC[2], eAndC[0], eAndC[4], i, eAndC[5]);
	
			$('#map-canvas').addClass('animated slideInRight');
	}

	//Check for Challenge Update
	Deps.autorun(function(){
		console.log('detected');
		var i = 1;
		var reactiveChall = Challenges.find();
		reactiveChall.forEach(function (chal) {
			if(!($.inArray(chal._id, challengeIds) > -1)){
				console.log("add marker");
				add_marker(chal.latitude, chal.longitude, chal.name, challengeImage, i, chal.description);
			
					challengeIds.push(chal._id);
				}
				i++;
			});

		});
		
		//Check for Event Update
		Deps.autorun(function(){
		var i = 1;
		var reactiveEvt = Events.find();
		reactiveEvt.forEach(function (evt) {
			if(!($.inArray(evt._id, eventIds) > -1)){
					add_marker(evt.latitude, evt.longitude, evt.name, eventImage, i, evt.description);
					eventIds.push(evt._id);
				}
				i++;
			});

		});

	}


	function add_marker(lat, lon, name, image, zindex, desc){
		// Shapes define the clickable region of the icon.
	// The type defines an HTML &lt;area&gt; element 'poly' which
	// traces out a polygon as a series of X,Y points. The final
	// coordinate closes the poly by connecting to the first
	// coordinate.
	var shape = {
		coords: [1, 1, 1, 20, 18, 20, 18 , 1],
		type: 'poly'
	};
	console.log('drawing');
		var myLatLng = new google.maps.LatLng(lat, lon);
				var marker = new google.maps.Marker({
					position: myLatLng,
					map: map,
					shape: shape,
					icon: image,
					animation: google.maps.Animation.DROP,
					title: name,
					zIndex: zindex
				});
		marker.info = new google.maps.InfoWindow({
			content : toHTMLWithData(Template['map-popover'], {
				lat:lat,
				lon:lon,
				name:name,
				image: image,
				zindex: zindex,
				desc: desc
			})
		});
		google.maps.event.addListener(marker, 'click', function() {
			marker.info.open(map,marker);

		});


}

var toHTMLWithData = function (kind, data) {
    return UI.toHTML(kind.extend({data: function () { return data; }}));
};

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

				if($(e.currentTarget).attr('data-home') === 'create-overlay'){
					console.log('here');
					google.maps.event.trigger(selectionMap, 'resize');
				}

			},500);				
		}

	});
