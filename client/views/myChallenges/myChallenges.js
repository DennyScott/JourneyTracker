Template.myChallenges.helpers({
	userChallenges: function () {
		if(this.enrolledChallengesIDs){
			return Challenges.find( { '_id' : { $in : this.enrolledChallengesIDs } } );
		}
	}
});

Template.myChallenges.events({
	'click .complete': function (e) {
		var challengeID = $(e.currentTarget).attr('id');
		Meteor.call("completeChallenge", challengeID );
	},

	'click .dismiss': function (e) {
		var challengeID = $(e.currentTarget).attr('id');
		Meteor.call("dismissChallenge", challengeID );
	}
});