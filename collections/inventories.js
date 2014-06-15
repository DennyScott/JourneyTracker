Inventories = new Meteor.Collection('inventories');

Meteor.methods({

	//-----------------------------INVENTORY CREATION METHOD------------------------------------------//

	 addInventory: function(inventoryAttributes){

		var user = Meteor.user();

		//Ensures that the user is logged in
		if (!user){
			throw new Meteor.Error(401, "You need to log in to create new inventories");
		}

		//filling in other keys
		var newInventory = _.extend(_.pick(inventoryAttributes, 'name', 'abstract'), {
			createdTime: new Date().getTime(),
			upVotes: 0,
			downVotes: 0,
			upVoterIDs: [],
			downVoterIDs: []
		});

		//Inserts new project into collection
		var inventoryID = Inventories.insert(newInventory);

		//returns the ID of the new project
		return inventoryID;
	},

	//-----------------------------------END OF INVENTORY ADDTION METHODS--------------------------------------//

	//-----------------------------------INVENTORY UPDATE METHODS----------------------------------------------//
	inventoryUpVote: function(id) {
		var user = Meteor.user();
		var profile = Profiles.findOne({'userID': user._id});
		var foundInventory = Inventories.findOne(id);

		//If the user has already upvoted, this will dissallow them from upvoting again
		if(foundInventory.upVoterIDs.indexOf(profile._id) > -1){
			throw new Meteor.Error(425, 'User has already up voted'); 
		}

		//In case the user had downvoted, this takes the downvote away
		if(foundInventory.downVoterIDs.indexOf(profile._id) > -1){
			Inventories.update(id, { $pull: { 'downVoterIDs': profile._id }, $inc: { 'downVotes': -1 } } );
		}

		Inventories.update(id, { $inc: { 'upVotes': 1}, $push: { 'upVoterIDs': profile._id } } );
	},
	
	inventoryDownVote: function(id) {
		var user = Meteor.user();
		var profile = Profiles.findOne({'userID': user._id});
		var foundInventory = Inventories.findOne(id);

		//If the user has already downvoted, this will disallow them from upvoting again
		if(foundInventory.downVoterIDs.indexOf(profile._id) > -1){
			throw new Meteor.Error(425, 'User has already up voted'); 
		}

		//In case the user had upvoted, this takes the upvote away
		if(foundInventory.upVoterIDs.indexOf(profile._id) > -1){
			Inventories.update(id, { $pull: { 'upVoterIDs': profile._id }, $inc: { 'upVotes': -1 } } );
		}

		Inventories.update(id, { $inc: { 'downVotes': 1}, $push: { 'downVoterIDs': profile._id } } );
	},

	updateAbstract: function(id, abstract){
		Inventories.update(id, { $set : { 'abstract' : abstract } } );
	},

	updateName: function(id, name){
		Inventories.update(id, { $set : { 'name' : name } } );
	},

	//---------------------------------END OF INVENTORY UPDATE METHODS-----------------------------------------//

	//-----------------------------------INVENTORY REMOVE METHODS----------------------------------------------//
	
	
	removeInventory: function(id) {
		
		//NEEDS ADMIN VERIFICATION FOR REMOVAL!!!!
		Inventories.remove(id);
	}
	//---------------------------------END OF INVENTORY REMOVE METHODS-----------------------------------------//
});