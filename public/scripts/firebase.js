// Initialize Firebase using compat API
const firebaseConfig = {
  apiKey: "AIzaSyAwiWR0kfMErKdDEeE9Em6v858_wLYp0LM",
  authDomain: "idle-wave-game.firebaseapp.com",
  databaseURL: "https://idle-wave-game-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "idle-wave-game",
  storageBucket: "idle-wave-game.firebasestorage.app",
  messagingSenderId: "209695931120",
  appId: "1:209695931120:web:9e8816480ba1e910136035"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Save player progress
window.savePlayerProgress = function(playerId, progress) {
  db.ref('players/' + playerId).set(progress)
    .then(() => {
      console.log('Player progress saved successfully.');
    })
    .catch((error) => {
      console.error('Error saving player progress:', error);
    });
};

// Retrieve player progress
window.getPlayerProgress = function(playerId, callback) {
  db.ref('players/' + playerId).get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        callback(null);
      }
    })
    .catch((error) => {
      console.error('Error retrieving player progress:', error);
    });
};

// Save item research data
window.saveItemResearch = function(playerId, itemId, researchData) {
  db.ref('players/' + playerId + '/items/' + itemId).set(researchData)
    .then(() => {
      console.log('Item research data saved successfully.');
    })
    .catch((error) => {
      console.error('Error saving item research data:', error);
    });
};

// Retrieve item research data
window.getItemResearch = function(playerId, itemId, callback) {
  db.ref('players/' + playerId + '/items/' + itemId).get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        callback(null);
      }
    })
    .catch((error) => {
      console.error('Error retrieving item research data:', error);
    });
};