Template.myEvents.helpers({
	userEvents: function () {
		if(this.enrolledEventsIDs){
			return Events.find( { '_id' : { $in : this.enrolledEventsIDs } } );
		}
	}
});