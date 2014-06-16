Template.challengeOverlay.helpers({
	soonChallenges: function () {
		return Challenges.find( {} );
	},
	enrolled: function () {
		if(Meteor.user()){
			var prof = Profiles.findOne({'userID': Meteor.user()._id});
			if (prof) {
				if(prof.enrolledChallengesIDs.indexOf(this._id) > -1){
					return true;
				} else {
					return false;
				}
			}
		}
	}
});

Template.challengeOverlay.events({
	'click .enroll': function (e) {
		var challengeID = $(e.currentTarget).attr('id');
		if($(e.currentTarget).hasClass("btn-info")){
			Meteor.call("enrollInChallenge", challengeID);
		} else {
			 Meteor.call("dismissChallenge", challengeID);
		}
	}
});