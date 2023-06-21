
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, onValue} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js"

      const firebaseConfig = {
        apiKey: "AIzaSyBjoxb19fWnFguzRXBRH5jhjpMEddNb-0I",
        authDomain: "fyptraffic-92fba.firebaseapp.com",
        databaseURL: "https://fyptraffic-92fba-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "fyptraffic-92fba",
        storageBucket: "fyptraffic-92fba.appspot.com",
        messagingSenderId: "707494421168",
        appId: "1:707494421168:web:537ac76b5cdb09acc3d175",
        measurementId: "G-XF7ZJ9DP8W"
      };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
console.log(database)
document.getElementById("submitBtn").addEventListener("click", submitLogin);

function submitLogin(e) {
    e.preventDefault();
    var username = getInputVal('username');
    var password = getInputVal('password');
    compareValue(username, password);
}

function getInputVal(id) {
    return document.getElementById(id).value;
}

function compareValue(inputUsername , inputPassword ) {
  console.log("3");
    // Reference to the Firebase Realtime Database location
    var databaseRef = ref(database, "User");
    console.log(databaseRef)

    onValue(databaseRef,function(snapshot) {
      console.log("4");
      if (snapshot.exists()) {
        console.log("Database connected to the specified path.");
      } else {
        console.log("No data exists at the specified path.");
      }
   
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
      });
  }
      
    
