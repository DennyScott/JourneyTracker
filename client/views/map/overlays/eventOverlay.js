Template.eventOverlay.helpers({
	soonEvents: function () {
		return Events.find( {}, { $sort: { eventDate: 1} } );

	},
	enrolled: function () {
		if(Meteor.user()){
			var prof = Profiles.findOne({'userID': Meteor.user()._id});
			if(prof){
				if(prof.enrolledEventsIDs.indexOf(this._id) > -1){
					return true;
				} else {
					return false;
				}
			}
		}
	},

	convertEventDate: function () {
		return "In " + moment(this.eventDate).fromNow(true);
	}
});

Template.eventOverlay.events({
	'click .enroll': function (e) {
		var eventID = $(e.currentTarget).attr('id');
		if($(e.currentTarget).hasClass("btn-info")){
			Meteor.call("enrollInEvent", eventID);
		} else {
			 Meteor.call("dismissEvent", eventID);
		}
	}
});