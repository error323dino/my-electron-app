var firebaseConfig = {
    apiKey: "AIzaSyBjoxb19fWnFguzRXBRH5jhjpMEddNb-0I",
    authDomain: "fyptraffic-92fba.firebaseapp.com",
    projectId: "fyptraffic-92fba",
    storageBucket: "fyptraffic-92fba.appspot.com",
    messagingSenderId: "707494421168",
    appId:  "1:707494421168:web:537ac76b5cdb09acc3d175",
    databaseURL: "https://fyptraffic-92fba.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);

document.getElementById("submitBtn").addEventListener("click", compareValue);

function submitLogin(e) {
    e.preventDefault();
    var username = getInputVal('username');
    var password = getInputVal('password');
    console.log("1");
    compareValue(username, password);
    console.log("2");

}

function getInputVal(id) {
    return document.getElementById(id).value;
}

function compareValue(inputUsername , inputPassword ) {
  console.log("3");
    // Reference to the Firebase Realtime Database location
    var databaseRef = firebase.database().ref("User");
  
    // Retrieve the stored value from Firebase Realtime Database
    databaseRef.once("value").then(function(snapshot) {
      var users = snapshot.val();

      for (var i = 1; i < users.length; i++) {
        var storedUsername = users[i].Username;
        var storedPassword = users[i].Password;
  
  
        // Compare the input value with the stored value
      if (inputUsername === storedUsername && inputPassword === storedPassword) {
        console.log("Input value matches the stored value.");
        //to main
      } else {
        console.log("Input value does not match the stored value.");
        //clear to input again
        // document.getElementById('contactForm').reset();
       }
      }
      })
      .catch(function(error) {
        console.log("Error retrieving stored value:", error);
      });

      
    }
