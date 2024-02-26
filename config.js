// Example: Dynamically setting the API URL based on hostname
let apiURL;

if (window.location.hostname === "localhost") {
    apiURL = "http://localhost:3000";
} else {
    apiURL = "https://french-word-game-api.onrender.com";
}

// Make the API URL globally available
window.apiURL = apiURL;
