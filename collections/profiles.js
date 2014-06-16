Profiles = new Meteor.Collection('profiles');

Meteor.methods({

	//-----------------------------PROFILE CREATION METHOD------------------------------------------//

	addProfile: function(profileAttributes){

		// var user = Meteor.user();

		//Ensures that the user is logged in
		// if (!user){
		// 	throw new Meteor.Error(401, "You need to log in to create new profiles");
		// }

		var found = Profiles.findOne({'userName' : profileAttributes.userName});

		// if(found){
		// 	throw new Meteor.Error(423, 'Username already used by another user');
		// }
		// 
		console.log("Adding Profile...");

		//filling in other keys
		var profile = _.extend(_.pick(profileAttributes, 'userID'), {
			firstName: capitaliseFirstLetter(profileAttributes.firstName),
			lastName: capitaliseFirstLetter(profileAttributes.lastName),
			userName: capitaliseFirstLetter(profileAttributes.userName),
			points: 0,
			level: 1,
			// userID: user._id,
			numberOfEnrolledChallenges: 0,
			numberOfEnrolledEvents: 0,
			numberOfCompletedChallenges: 0,
			numberOfCompletedEvents: 0,
			enrolledChallengesIDs: [],
			enrolledEventsIDs: [],
			completedChallengesIDs: [],
			completedEventsIDs: [],
			inventory: [],
			lastLoggedIn: new Date().getTime(),
			lastCheckIn: new Date().getTime(),
			todaysCheckIns: [],
			todaysTotalCheckIns: 0
		});

		//Inserts new project into collection
		var profileID = Profiles.insert(profile);

		//returns the ID of the new project
		return profileID;
	},

	//-----------------------------------END OF PROFILE ADDTION METHODS--------------------------------------//

	//-----------------------------------PROFILE UPDATE METHODS----------------------------------------------//

	updateLastLoggedIn: function() {
		var userid = Meteor.user()._id;
		var found = Profiles.findOne( { 'userID': userid } );
		var now = new Date().getTime;
		Profiles.update(found._id, {$set: {'lastLoggedIn': now}});
	},

	updateLastCheckIn: function() {

		var userid = Meteor.user()._id;
		var found = Profiles.findOne( { 'userID': userid } );
		var now = new Date().getTime;
		Profiles.update(found._id, {$set: {'lastCheckIn': now}});
	},
	
	updateProfileFirstName: function(name) {
		var userid = Meteor.user()._id;
		var found = Profiles.findOne( { 'userID': userid } );
		Profiles.update(found._id, {$set: {'firstName': capitaliseFirstLetter(name) }});
	},

	updateProfileLastName: function(name) {
		var userid = Meteor.user()._id;
		var found = Profiles.findOne( { 'userID': userid } );
		Profiles.update(found._id, {$set: {'lastName':  capitaliseFirstLetter(name)}});
	},

	updateProfileUserName: function(name) {
		var userid = Meteor.user()._id;
		var found = Profiles.findOne( { 'userID': userid } );
		if(!found){
			Profiles.update(found._id, {$set: {'userName':  capitaliseFirstLetter(name) }});
		} else {
			throw new Meteor.Error(423, 'Username already used by another user');
		}
	},

	incrementPoints: function(id, points){
		Profiles.update(id, {$inc: {'points': points}});
	},

	levelUp: function(){
		var userid = Meteor.user()._id;
		var found = Profiles.findOne( { 'userID': userid } );
		Profiles.update(found._id, {$inc: {'level': 1}});
	},

	enrollInChallenge: function(challengeID){
		var userid = Meteor.user()._id;
		var found = Profiles.findOne( { 'userID': userid } );
		if (found.enrolledChallengesIDs.indexOf(challengeID) === -1) {
			Profiles.update(found._id, { $push: { 'enrolledChallengesIDs': challengeID }, $inc: { 'numberOfEnrolledChallenges' : 1} });
			Meteor.call('challengeEnroll', challengeID);
		} else {
			throw new Meteor.Error(424, 'Already Enrolled in Challenge');
		}
	},

	dismissChallenge: function(challengeID){
		var userid = Meteor.user()._id;
		var found = Profiles.findOne( { 'userID': userid } );
		if (found.enrolledChallengesIDs.indexOf(challengeID) !== -1) {
			Profiles.update(found._id, { $pull: { 'enrolledChallengesIDs': challengeID }, $inc: { 'numberOfEnrolledChallenges' : -1} });
			Meteor.call('challengeDismiss', challengeID);
		} else {
			throw new Meteor.Error(424, 'Not Enrolled in Challenge');
		}
	},

	enrollInEvent: function(eventID){
		var userid = Meteor.user()._id;
		var found = Profiles.findOne( { 'userID': userid } );
		if (found.enrolledEventsIDs.indexOf(eventID) === -1) {
			Profiles.update(found._id, { $push: { 'enrolledEventsIDs': eventID }, $inc: { 'numberOfEnrolledEvents' : 1} });
			Meteor.call('eventEnroll', eventID);
		} else {
			throw new Meteor.Error(424, 'Already Enrolled in Event');
		}
	},

	dismissEvent: function(eventID){
		var userid = Meteor.user()._id;
		var found = Profiles.findOne( { 'userID': userid } );
		if (found.enrolledEventsIDs.indexOf(eventID) !== -1) {
			Profiles.update(found._id, { $pull: { 'enrolledEventsIDs': eventID }, $inc: { 'numberOfEnrolledEvents' : -1} });
			Meteor.call('eventDismiss', eventID);
		} else {
			throw new Meteor.Error(424, 'Not Enrolled in Event');
		}
	},

	completeChallenge: function(challengeID){
		var userid = Meteor.user()._id;
		var found = Profiles.findOne( { 'userID': userid } );
		if (found.enrolledChallengesIDs.indexOf(challengeID) !== -1) {
			Profiles.update(found._id, { $pull: { 'enrolledChallengesIDs': challengeID }, $push: { 'completedChallengesIDs': challengeID }, $inc: { 'numberOfEnrolledChallenges' : -1, 'numberOfCompletedChallenges': 1} });
			Meteor.call('challengeComplete', challengeID, found._id);
		} else {
			throw new Meteor.Error(424, 'Not Enrolled in Challenge');
		}
	},

	completeEvent: function(eventID){
		var userid = Meteor.user()._id;
		var found = Profiles.findOne( { 'userID': userid } );
		if (found.enrolledEventsIDs.indexOf(eventID) !== -1) {
			Profiles.update(found._id, { $pull: { 'enrolledEventsIDs': eventID }, $push: { 'completedEventsIDs': eventID }, $inc: { 'numberOfEnrolledEvents' : -1, 'numberOfCompletedEvents': 1} });
			Meteor.call('eventComplete', eventID, found._id);
		} else {
			throw new Meteor.Error(424, 'Not Enrolled in Event');
		}
	},

	completeCheckIn: function(checkpointID) {
		var userid = Meteor.user()._id;
		var found = Profiles.findOne( { 'userID': userid } );
		if (found.todaysCheckIns.indexOf(checkpointID) > -1){
			throw new Meteor.Error(426, 'You have already checked into this location today');
		}

		var checkpoint = Checkpoints.findOne(checkpointID);

		//This will update the checkpoint and increase the users points
		Meteor.call('checkpointComplete', checkpointID, found._id);

		Profiles.update(found._id, { $push: { 'todaysCheckIns': checkpointID }, $inc: { 'todaysTotalCheckIns' : 1 } } );
	},

	//---------------------------------END OF PROFILE UPDATE METHODS-----------------------------------------//

	//-----------------------------------PROFILE REMOVE METHODS----------------------------------------------//
	
	
	removeProfile: function(id) {
		var user = Meteor.user();
		var found = Profiles.findOne(id);
		if(found.userID === user._id){
			Profiles.remove(id);
		} else {
			throw new Meteor.Error(405, "You need to own this profile to delete it");
		}
	}
	//---------------------------------END OF PROFILE REMOVE METHODS-----------------------------------------//
});