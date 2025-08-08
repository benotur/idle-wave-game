// Initialize Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to the database
const database = firebase.database();

// Function to save player progress
function savePlayerProgress(playerId, progress) {
    database.ref('players/' + playerId).set(progress)
        .then(() => {
            console.log('Player progress saved successfully.');
        })
        .catch((error) => {
            console.error('Error saving player progress:', error);
        });
}

// Function to retrieve player progress
function getPlayerProgress(playerId, callback) {
    database.ref('players/' + playerId).once('value')
        .then((snapshot) => {
            const progress = snapshot.val();
            callback(progress);
        })
        .catch((error) => {
            console.error('Error retrieving player progress:', error);
        });
}

// Function to save item research data
function saveItemResearch(playerId, itemId, researchData) {
    database.ref('players/' + playerId + '/items/' + itemId).set(researchData)
        .then(() => {
            console.log('Item research data saved successfully.');
        })
        .catch((error) => {
            console.error('Error saving item research data:', error);
        });
}

// Function to retrieve item research data
function getItemResearch(playerId, itemId, callback) {
    database.ref('players/' + playerId + '/items/' + itemId).once('value')
        .then((snapshot) => {
            const researchData = snapshot.val();
            callback(researchData);
        })
        .catch((error) => {
            console.error('Error retrieving item research data:', error);
        });
}