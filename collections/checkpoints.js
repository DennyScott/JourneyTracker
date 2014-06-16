Checkpoints = new Meteor.Collection('checkpoints');

Meteor.methods({

	//-----------------------------EVENTS CREATION METHOD------------------------------------------//

	 addCheckpoint: function(checkpointAttributes){

		var user = Meteor.user();

		//Ensures that the user is logged in
		if (!user){
			throw new Meteor.Error(401, "You need to log in to create new checkpoints");
		}

		//filling in other keys
		var newCheckpoint = _.extend(_.pick(checkpointAttributes, 'name', 'description', 'type', 'longitude', 'latitude'), {
			//NEED TO DO VERIFACTION FOR TYPE!!!!!
			createdTime: new Date().getTime(),
			upVotes: 0,
			downVotes: 0,
			upVoterIDs: [],
			downVoterIDs: [],
			totalCheckIns: 0,
			points: 50,  //This will later be chosen by type!
			todaysCheckIns: [],
			lastCheckedIn: "No One",
			lastCheckedInOn: new Date().getTime()
		});

		//Inserts new project into collection
		var checkpointID = Checkpoints.insert(newCheckpoint);

		//returns the ID of the new project
		return checkpointID;
	},

	//-----------------------------------END OF EVENTS ADDTION METHODS--------------------------------------//

	//-----------------------------------EVENTS UPDATE METHODS----------------------------------------------//
	checkpointUpVote: function(id) {
		var user = Meteor.user();
		var profile = Profiles.findOne({'userID': user._id});
		var foundCheckpoint = Checkpoints.findOne(id);

		//If the user has already upvoted, this will dissallow them from upvoting again
		if(foundCheckpoint.upVoterIDs.indexOf(profile._id) > -1){
			throw new Meteor.Error(425, 'User has already up voted'); 
		}

		//In case the user had downvoted, this takes the downvote away
		if(foundCheckpoint.downVoterIDs.indexOf(profile._id) > -1){
			Checkpoints.update(id, { $pull: { 'downVoterIDs': profile._id }, $inc: { 'downVotes': -1 } } );
		}

		Checkpoints.update(id, { $inc: { 'upVotes': 1}, $push: { 'upVoterIDs': profile._id } });
	},
	
	checkpointDownVote: function(id) {
		var user = Meteor.user();
		var profile = Profiles.findOne({'userID': user._id});
		var foundCheckpoint = Checkpoints.findOne(id);

		//If the user has already downvoted, this will disallow them from upvoting again
		if(foundCheckpoint.downVoterIDs.indexOf(profile._id) > -1){
			throw new Meteor.Error(425, 'User has already up voted'); 
		}

		//In case the user had upvoted, this takes the upvote away
		if(foundCheckpoint.upVoterIDs.indexOf(profile._id) > -1){
			Checkpoints.update(id, { $pull: { 'upVoterIDs': profile._id }, $inc: { 'upVotes': -1 } } );
		}

		Checkpoints.update(id, { $inc: { 'downVotes': 1}, $push: { 'downVoterIDs': profile._id } } );
	},

	checkpointComplete: function(id, profileID) {
		var profile = Profiles.findOne(profileID);
		var now = new Date().getTime;
		var foundCheckpoint = Checkpoints.findOne(id);

		//Checks to see if the user has checked in today already
		if(foundCheckpoint.todaysCheckIns.indexOf(profile._id) > -1){
			throw new Meteor.Error(425, 'User has already checked in today');
		}
		
		Checkpoints.update(id, { $inc: { 'totalCheckIns': 1 }, $set: { 'lastCheckedInOn': now, 'lastCheckedIn': profile.userName }, $push : { 'todaysCheckIns' : profile._id } } );
		Meteor.call('incrementPoints', profileID, foundCheckpoint.points);
	},

	//---------------------------------END OF EVENTS UPDATE METHODS-----------------------------------------//

	//-----------------------------------EVENTS REMOVE METHODS----------------------------------------------//
	
	
	removeCheckpoint: function(id) {
		
		//NEEDS ADMIN VERIFICATION FOR REMOVAL!!!!
		Checkpoints.remove(id);
	}
	//---------------------------------END OF EVENTS REMOVE METHODS-----------------------------------------//
});