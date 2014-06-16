Template.myChallenges.helpers({
	userChallenges: function () {
		if(this.enrolledChallengesIDs){
			return Challenges.find( { '_id' : { $in : this.enrolledChallengesIDs } } );
		}
	}
});