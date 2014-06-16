if(Meteor.users.find().count() === 0) {
	var options = {
		email : "travisscott301@gmail.com",
		password : '1234abcd'
	};

	var id = Accounts.createUser(options);
	var profileOptions = {
		firstName: "Travis",
		lastName: "Scott",
		userName: "Admin",
		points: 0,
		level: 1,
		userID: id,
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
	};

		//Inserts new project into collection
		var profileID = Profiles.insert(profileOptions);

		var newChallenge = {
			name: "Hike Trail",
			description: "An easy trail with a very light hill at the end",
			latitude: 49.8964,
			longitude: -97.1392,
			createdTime: new Date().getTime(),
			upVotes: 0,
			downVotes: 0,
			upVoterIDs: [],
			downVoterIDs: [],
			numberOfEnrolls: 0,
			numberOfCompleted: 0,
			lastCompletedBy: "No One",
			lastCompletedOn: new Date().getTime(),
			points: 25,
		};

		//Inserts new project into collection
		var challengeID = Challenges.insert(newChallenge);

		newChallenge = {
			name: "Bike Path",
			description: "This path goes through a nice shaded area",
			latitude: 49.8794,
			longitude: -97.1392,
			createdTime: new Date().getTime(),
			upVotes: 0,
			downVotes: 0,
			upVoterIDs: [],
			downVoterIDs: [],
			numberOfEnrolls: 0,
			numberOfCompleted: 0,
			lastCompletedBy: "No One",
			lastCompletedOn: new Date().getTime(),
			points: 25,
		};
		
		//Inserts new project into collection
		challengeID = Challenges.insert(newChallenge);

		newChallenge = {
			name: "Easy Hike Trail",
			description: "No real elevation, just a nice walk",
			latitude: 49.8894,
			longitude: -97.1392,
			createdTime: new Date().getTime(),
			upVotes: 0,
			downVotes: 0,
			upVoterIDs: [],
			downVoterIDs: [],
			numberOfEnrolls: 0,
			numberOfCompleted: 0,
			lastCompletedBy: "No One",
			lastCompletedOn: new Date().getTime(),
			points: 25,
		};
		
		//Inserts new project into collection
		challengeID = Challenges.insert(newChallenge);

		newChallenge = {
			name: "500m Sprint",
			description: "Sprinted around the track for 500m",
			latitude: 49.8894,
			longitude: -97.1592,
			createdTime: new Date().getTime(),
			upVotes: 0,
			downVotes: 0,
			upVoterIDs: [],
			downVoterIDs: [],
			numberOfEnrolls: 0,
			numberOfCompleted: 0,
			lastCompletedBy: "No One",
			lastCompletedOn: new Date().getTime(),
			points: 25,
		};
		
		//Inserts new project into collection
		challengeID = Challenges.insert(newChallenge);

		newChallenge = {
			name: "500m Swim",
			description: "Any style swim",
			latitude: 49.8794,
			longitude: -97.1592,
			createdTime: new Date().getTime(),
			upVotes: 0,
			downVotes: 0,
			upVoterIDs: [],
			downVoterIDs: [],
			numberOfEnrolls: 0,
			numberOfCompleted: 0,
			lastCompletedBy: "No One",
			lastCompletedOn: new Date().getTime(),
			points: 25,
		};
		
		//Inserts new project into collection
		challengeID = Challenges.insert(newChallenge);
	}
