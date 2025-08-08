// Import Firebase (if using modules, otherwise ensure firebase is loaded via CDN in index.html)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAwiWR0kfMErKdDEeE9Em6v858_wLYp0LM",
  authDomain: "idle-wave-game.firebaseapp.com",
  databaseURL: "https://idle-wave-game-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "idle-wave-game",
  storageBucket: "idle-wave-game.firebasestorage.app",
  messagingSenderId: "209695931120",
  appId: "1:209695931120:web:9e8816480ba1e910136035"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Save player progress
window.savePlayerProgress = function(playerId, progress) {
  set(ref(database, 'players/' + playerId), progress)
    .then(() => {
      console.log('Player progress saved successfully.');
    })
    .catch((error) => {
      console.error('Error saving player progress:', error);
    });
};

// Retrieve player progress
window.getPlayerProgress = function(playerId, callback) {
  get(child(ref(database), 'players/' + playerId))
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
  set(ref(database, 'players/' + playerId + '/items/' + itemId), researchData)
    .then(() => {
      console.log('Item research data saved successfully.');
    })
    .catch((error) => {
      console.error('Error saving item research data:', error);
    });
};

// Retrieve item research data
window.getItemResearch = function(playerId, itemId, callback) {
  get(child(ref(database), 'players/' + playerId + '/items/' + itemId))
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