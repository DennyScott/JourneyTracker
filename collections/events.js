Events = new Meteor.Collection('events');

Meteor.methods({

	//-----------------------------EVENTS CREATION METHOD------------------------------------------//

	 addEvent: function(eventAttributes){

		var user = Meteor.user();

		//Ensures that the user is logged in
		if (!user){
			throw new Meteor.Error(401, "You need to log in to create new events");
		}

		//filling in other keys
		var newEvent = _.extend(_.pick(eventAttributes, 'name', 'description', 'eventDate', 'completionDate'), {
			createdTime: new Date().getTime(),
			upVotes: 0,
			downVotes: 0,
			upVoterIDs: [],
			downVoterIDs: [],
			numberOfEnrolls: 0,
			numberOfCompleted: 0,
		});

		//Inserts new project into collection
		var eventID = Events.insert(newEvent);

		//returns the ID of the new project
		return eventID;
	},

	//-----------------------------------END OF EVENTS ADDTION METHODS--------------------------------------//

	//-----------------------------------EVENTS UPDATE METHODS----------------------------------------------//
	eventUpVote: function(id) {
		var user = Meteor.user();
		var profile = Profiles.findOne({'userID': user._id});
		var foundEvent = Events.findOne(id);

		//If the user has already upvoted, this will dissallow them from upvoting again
		if(foundEvent.upVoterIDs.indexOf(profile._id) > -1){
			throw new Meteor.Error(425, 'User has already up voted'); 
		}

		//In case the user had downvoted, this takes the downvote away
		if(foundEvent.downVoterIDs.indexOf(profile._id) > -1){
			Events.update(id, { $pull: { 'downVoterIDs': profile._id }, $inc: { 'downVotes': -1 } } );
		}

		Events.update(id, {$inc: {'upVotes': 1}, $push{ 'upVoterIDs': profile._id } });
	},
	
	eventDownVote: function(id) {
		var user = Meteor.user();
		var profile = Profiles.findOne({'userID': user._id});
		var foundEvent = Events.findOne(id);

		//If the user has already downvoted, this will dissallow them from upvoting again
		if(foundEvent.downVoterIDs.indexOf(profile._id) > -1){
			throw new Meteor.Error(425, 'User has already up voted'); 
		}

		//In case the user had upvoted, this takes the upvote away
		if(foundEvent.upVoterIDs.indexOf(profile._id) > -1){
			Events.update(id, { $pull: { 'upVoterIDs': profile._id }, $inc: { 'upVotes': -1 } } );
		}

		Events.update(id, {$inc: {'downVotes': 1}, $push{ 'downVoterIDs': profile._id } });
	},

	eventEnroll: function(id) {
		Events.update(id, { $inc: { 'numberOfEnrolls': 1 } } );
	},

	eventComplete: function(id) {
		var user = Meteor.user();
		var profile = Profiles.findOne({'userID': user._id});
		var now = new Date().getTime;
		Events.update(id, { $inc: { 'numberOfCompleted': 1 } } );
	},

	//---------------------------------END OF EVENTS UPDATE METHODS-----------------------------------------//

	//-----------------------------------EVENTS REMOVE METHODS----------------------------------------------//
	
	
	removeEvent: function(id) {

		//NEEDS ADMIN VERIFICATION FOR REMOVAL!!!!
		Events.remove(id);
	}
	//---------------------------------END OF EVENTS REMOVE METHODS-----------------------------------------//
});