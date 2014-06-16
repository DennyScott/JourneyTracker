Template.myEvents.helpers({
	userEvents: function () {
		if(this.enrolledEventsIDs){
			return Events.find( { '_id' : { $in : this.enrolledEventsIDs } } );
		}
	},

	convertEventDate: function () {
		return "In " + moment(this.eventDate).fromNow(true);
	}
});

Template.myEvents.events({
	'click .complete': function (e) {
		var eventID = $(e.currentTarget).attr('id');
		Meteor.call("completeEvent", eventID );
	},

	'click .dismiss': function (e) {
		var eventID = $(e.currentTarget).attr('id');
		Meteor.call("dismissEvent", eventID );
	}
});