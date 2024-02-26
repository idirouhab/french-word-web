// Example: Dynamically setting the API URL based on hostname
let apiURL;

if (window.location.hostname === "localhost") {
    apiURL = "http://localhost:3000/word";
} else {
    apiURL = "https://french-word-game-api.onrender.com/word";
}

// Make the API URL globally available
window.apiURL = apiURL;
