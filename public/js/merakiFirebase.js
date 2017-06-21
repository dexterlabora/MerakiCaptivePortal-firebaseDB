/*
This sript will collect the form data and paramters sent by Meraki, store the results
in a Firebase database, then log the user into the Meraki WiFi network.
*/

// Initialize Firebase -- UPDATE THIS
var config = {
    apiKey: "YourAPIKey",
    authDomain: "YourAppName.firebaseapp.com",
    databaseURL: "https://YourAppName.firebaseio.com",
    projectId: "YourProjectID",
    storageBucket: "YourAppName.appspot.com",
    messagingSenderId: "YourSenderId"
};

firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

// Parse Meraki supplied parameters
var base_grant_url = decodeURIComponent(GetURLParameter("base_grant_url"));
var user_continue_url = decodeURIComponent(GetURLParameter("user_continue_url"));
var node_mac = GetURLParameter("node_mac");
var client_ip = GetURLParameter("client_ip");
var client_mac = GetURLParameter("client_mac");

// Print Meraki provided paramaters to console
console.log("base_grant_url: "+base_grant_url);
console.log("client_ip: "+client_ip);

// Display Paramters for Demo
$("div.baseGrantURL").text(base_grant_url);
$("div.userContinueURL").text(user_continue_url);
$("div.clientIP").text(client_ip);
$("div.clientMAC").text(client_mac);
$("div.nodeMAC").text(node_mac);

// Handle Form Submission
$('form').submit(function(event) {    
    console.log("processing loginForm");

    event.preventDefault();

    // Store form data into variable
    formData = {
    "name":$("input#name").val(),
    "email":$("input#email").val(),
    "company":$("input#company").val()
    }

    // Save Data to Firebase
    console.log("saving form data", formData);
    writeUserData(formData);


    // ******************
    // Login to Meraki by redirecting client to the base_grant_url 
    // The logingUrl will add a continue_url parameter for a final client
    // rediret
    // ****************** 
    var loginUrl = base_grant_url;
    if(user_continue_url !== "undefined"){
        // add the users intended website to the login parameters.
        // You could also re-write the user_continue_url if you wanted a custom 
        // landing page.
         loginUrl += "?continue_url="+user_continue_url;
    }
    console.log("Logging in... ",loginUrl);
    // redirect browser to meraki auth URL.
    window.location.href = loginUrl;

});

// Write to firebase database
function writeUserData(data) {
    date = new Date;
    database.ref('wifiLogins/' + date.getTime()).set({
        name: data.name,
        email: data.email,
        company: data.company
    });
}


// Helper function to parse URL
function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}