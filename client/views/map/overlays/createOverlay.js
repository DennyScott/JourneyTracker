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
		var desc = $('creationDescription').html();
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

function readyValidation() {
$('.input-group input[required], .input-group textarea[required], .input-group select[required]').on('keyup change', function() {
		var $form = $(this).closest('form'),
            $group = $(this).closest('.input-group'),
			$addon = $group.find('.input-group-addon'),
			$icon = $addon.find('span'),
			state = false;
            
    	if (!$group.data('validate')) {
			state = $(this).val() ? true : false;
		}else if ($group.data('validate') == "email") {
			state = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test($(this).val())
		}else if($group.data('validate') == 'phone') {
			state = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/.test($(this).val())
		}else if ($group.data('validate') == "length") {
			state = $(this).val().length >= $group.data('length') ? true : false;
		}else if ($group.data('validate') == "number") {
			state = !isNaN(parseFloat($(this).val())) && isFinite($(this).val());
		}

		if (state) {
				$addon.removeClass('danger');
				$addon.addClass('success');
				$icon.attr('class', 'glyphicon glyphicon-ok');
		}else{
				$addon.removeClass('success');
				$addon.addClass('danger');
				$icon.attr('class', 'glyphicon glyphicon-remove');
		}
        
        if ($form.find('.input-group-addon.danger').length == 0) {
            $form.find('[type="submit"]').prop('disabled', false);
        }else{
            $form.find('[type="submit"]').prop('disabled', true);
        }
	});
    
    $('.input-group input[required], .input-group textarea[required], .input-group select[required]').trigger('change');
    
}
