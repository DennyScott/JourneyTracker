Profiles = new Meteor.Collection('profiles');

Meteor.methods({

	//-----------------------------PROFILE CREATION METHOD------------------------------------------//

	addProfile: function(profileAttributes){

		var user = Meteor.user();

		//Ensures that the user is logged in
		if (!user){
			throw new Meteor.Error(401, "You need to log in to create new profiles");
		}

		var found = Profiles.findOne({'userName' : name});

		if(found){
			throw new Meteor.Error(423, 'Username already used by another user');
		}

		//filling in other keys
		var profile = _.extend(_.pick(profileAttributes, 'firstName', 'lastName', 'userName'), {
			points: 0,
			level: 1,
			userID: user._id,
			numberOfEnrolledChallanges: 0,
			numberOfEnrolledEvents: 0,
			numberOfCompletedChallanges: 0,
			numberOfCompletedEvents: 0,
			enrolledChallangesIDs: [],
			enrolledEventsIDs: [],
			completedChallangesIDs: [],
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
	
	updateLastLoggedIn: function(id) {
		var user = Meteor.user();
		var now = new Date().getTime;
		Profiles.update(id, {$set: {'lastLoggedIn': now}});
	},

	updateLastCheckIn: function(id) {
		var user = Meteor.user();
		var now = new Date().getTime;
		Profiles.update(id, {$set: {'lastCheckIn': now}});
	},
	
	updateProfileFirstName: function(id, name) {
		Profiles.update(id, {$set: {'firstName': name}});
	},

	updateProfileLastName: function(id, name) {
		Profiles.update(id, {$set: {'lastName': name}});
	},

	updateProfileUserName: function(id, name) {
		var found = Profiles.findOne({'userName' : name});
		if(!found){
			Profiles.update(id, {$set: {'userName': name}});
		} else {
			throw new Meteor.Error(423, 'Username already used by another user');
		}
	},

	increasePoints: function(id, points){
		var totalPoints = found.points + points;
		Profiles.update(id, {$set: {'points': totalPoints}});
	},

	decreasePoints: function(id, points){
		var totalPoints = found.points - points;
		Profiles.update(id, {$set: {'points': totalPoints}});
	},

	increaseLevel: function(id){
		var found = Profiles.findOne(id);
		var level = found.level + 1;
		Profiles.update(id, {$set: {'level': level}});
	},

	enrollInChallange: function(id, challangeID){
		var found = Profiles.findOne(id);
		if (found.enrolledChallangesIDs.indexOf(challangeID) === -1) {
			Profiles.update(id, { $push: { 'enrolledChallangesIDs': challangeID }, $inc: { 'numberOfEnrolledChallanges' : 1} });
		} else {
			throw new Meteor.Error(424, 'Already Enrolled in Challange');
		}
	},

	enrollInEvent: function(id, eventID){
		var found = Profiles.findOne(id);
		if (found.enrolledEventsIDs.indexOf(eventID) === -1) {
			Profiles.update(id, { $push: { 'enrolledEventsIDs': eventID }, $inc: { 'numberOfEnrolledEvents' : 1} });
		} else {
			throw new Meteor.Error(424, 'Already Enrolled in Event');
		}
	},

	completeChallange: function(id, challangeID){
		var found = Profiles.findOne(id);
		if (found.enrolledChallangesIDs.indexOf(challangeID) !== -1) {
			Profiles.update(id, { $pull: { 'enrolledChallangesIDs': challangeID }, $push: { 'completedChallangesIDs': challangeID }, $inc: { 'numberOfEnrolledChallanges' : -1, 'numberOfCompletedChallanges': 1} });
			Meteor.call('challangeComplete', eventID, profile._id, function (error, result) {
				Meteor.call('increasePoints', id, result);
			});
		} else {
			throw new Meteor.Error(424, 'Not Enrolled in Challange');
		}
	},

	completeEvent: function(id, eventID){
		var found = Profiles.findOne(id);
		if (found.enrolledEventsIDs.indexOf(eventID) !== -1) {
			Profiles.update(id, { $pull: { 'enrolledEventsIDs': eventID }, $push: { 'completedEventsIDs': eventID }, $inc: { 'numberOfEnrolledEvents' : -1, 'numberOfCompletedEvents': 1} });
			Meteor.call('eventComplete', eventID, profile._id, function (error, result) {
				Meteor.call('increasePoints', id, result);
			});
		} else {
			throw new Meteor.Error(424, 'Not Enrolled in Event');
		}
	},

	completeCheckIn: function(id, checkpointID) {
		var found = Profiles.findOne(id);
		if (found.todaysCheckIns.indexOf(checkpointID) > -1){
			throw new Meteor.Error(426, 'You have already checked into this location today');
		}

		var checkpoint = Checkpoints.findOne(checkpointID);

		//This will update the checkpoint and increase the users points
		Meteor.call('checkpointComplete', checkpointID, profile._id, function (error, result) {
			Meteor.call('increasePoints', id, result);
		});

		Profiles.update(id, { $push: { 'todaysCheckIns': checkpointID }, $inc: { 'todaysTotalCheckIns' : 1 } } );
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