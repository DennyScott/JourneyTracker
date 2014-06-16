Template.createOverlay.rendered = function(){
 $('.datetimepicker').datetimepicker();
 $('.event-article').prop('disabled', true);	

 readyValidation();

	GoogleMaps.init(
		{
		'sensor': true, //optional
		//'key': 'MY-GOOGLEMAPS-API-KEY', //optional
		//'language': 'de' //optional
	}, 
	function(){
		loadMap();	
		

	});

	function loadMap(){
		var mapOptions = {
			zoom: 13,
		};
		var myLat =  new google.maps.LatLng(49.8994, -97.1392);
		selectionMap = new google.maps.Map(document.getElementById("creation-selection"), mapOptions);
		selectionMap.setCenter(myLat);

		google.maps.event.addListener(selectionMap, 'click', function( event ){
  	$('#latitude').val(event.latLng.lat()).trigger('change');
		$('#longitude').val(event.latLng.lng()).trigger('change'); 
});
		
	}

}

Template.createOverlay.events({
	'change #creation-type' : function() {
			if($('#creation-type').find(':selected').text() === 'Event'){
				$('.event-article').prop('disabled', false);	
			}else{
				$('.event-article').prop('disabled', true);	
			}
	},

	'click #submit' : function(e){
		e.preventDefault();

		var name = $('#create-name').val();
		var desc = $('#creationDescription').val();
		console.log(desc);
		var type = $('#creation-type').find(':selected').text();
		var lat = $('#latitude').val();
		var lon = $('#longitude').val();

		if(type === 'Event'){
			var time = $('#datetime').val();
			Meteor.call('addEvent', {name: name, description: desc, eventDate: new Date(time), longitude: lon, latitude: lat});
		}else{
			Meteor.call('addChallenge', {name: name, description: desc, longitude: lon, latitude: lat});
		}
	}
});

