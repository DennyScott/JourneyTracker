Challenges = new Meteor.Collection('challenges');

Meteor.methods({

	//-----------------------------EVENTS CREATION METHOD------------------------------------------//

	 addChallenge: function(challengeAttributes){

		var user = Meteor.user();

		//Ensures that the user is logged in
		if (!user){
			throw new Meteor.Error(401, "You need to log in to create new challenges");
		}

		//filling in other keys
		var newChallenge = _.extend(_.pick(challengeAttributes, 'name', 'description', 'isTimed', 'time'), {
			createdTime: new Date().getTime(),
			upVotes: 0,
			downVotes: 0,
			upVoterIDs: [],
			downVoterIDs: [],
			numberOfEnrolls: 0,
			numberOfCompleted: 0,
			lastCompletedBy: "No One",
			lastCompletedOn: new Date().getTime()
		}

		//Inserts new project into collection
		var challengeID = Challenges.insert(newChallenge);

		//returns the ID of the new project
		return challengeID;
	},

	//-----------------------------------END OF EVENTS ADDTION METHODS--------------------------------------//

	//-----------------------------------EVENTS UPDATE METHODS----------------------------------------------//
	incrementChallangeVotes: function(id) {
		var user = Meteor.user();
		var profile = Profiles.findOne({'userID': user._id});
		var foundChallenge = Challenges.findOne(id);

		//If the user has already upvoted, this will dissallow them from upvoting again
		if(foundChallenge.upVoterIDs.indexOf(profile._id) > -1){
			throw new Meteor.Error(425, 'User has already up voted'); 
		}

		//In case the user had downvoted, this takes the downvote away
		if(foundChallenge.downVoterIDs.indexOf(profile._id) > -1){
			Challenges.update(id, { $pull: { 'downVoterIDs': profile._id }, $inc: { 'downVotes': -1 } } );
		}

		Challenges.update(id, {$inc: {'upVotes': 1}, $push{ 'upVoterIDs': profile._id } });
	},
	
	decrementChallangeVotes: function(id) {
		var user = Meteor.user();
		var profile = Profiles.findOne({'userID': user._id});
		var foundChallenge = Challenges.findOne(id);

		//If the user has already downvoted, this will disallow them from upvoting again
		if(foundChallenge.downVoterIDs.indexOf(profile._id) > -1){
			throw new Meteor.Error(425, 'User has already up voted'); 
		}

		//In case the user had upvoted, this takes the upvote away
		if(foundChallenge.upVoterIDs.indexOf(profile._id) > -1){
			Challenges.update(id, { $pull: { 'upVoterIDs': profile._id }, $inc: { 'upVotes': -1 } } );
		}

		Challenges.update(id, {$inc: {'downVotes': 1}, $push{ 'downVoterIDs': profile._id } });
	},

	challengeEnroll: function(id) {
		Challenges.update(id, { $inc: { 'numberOfEnrolls': 1 } } );
	},

	challengeComplete: function(id) {
		var user = Meteor.user();
		var profile = Profiles.findOne({'userID': user._id});
		var now = new Date().getTime;
		Challenges.update(id, { $inc: { 'numberOfEnrolls': -1, 'numberOfCompleted': 1 }, $set: { 'lastCompletedOn': now, 'lastCompletedBy': profile.userName } } );
	},

	//---------------------------------END OF EVENTS UPDATE METHODS-----------------------------------------//

	//-----------------------------------EVENTS REMOVE METHODS----------------------------------------------//
	
	
	removeChallenge: function(id) {
		
		//NEEDS ADMIN VERIFICATION FOR REMOVAL!!!!
		Challenges.remove(id);
	}
	//---------------------------------END OF EVENTS REMOVE METHODS-----------------------------------------//
});