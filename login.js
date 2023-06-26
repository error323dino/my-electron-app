import database from './index.js';
import {ref, onValue} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js"

function submitLogin(e) {
  e.preventDefault();
  var username = getInputVal('username');
  var password = getInputVal('password');
  compareValue(username , password )
}

document.getElementById("submitBtn").addEventListener("click", submitLogin);

function getInputVal(id) {
    return document.getElementById(id).value;
}

function myFunction() {
  var x = document.getElementById("snackbarLogin");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function compareValue(inputUsername , inputPassword ) {
    var databaseRef = ref(database, "User");
    console.log(databaseRef)

    onValue(databaseRef,function(snapshot) {
      if (snapshot.exists()) {
        console.log("Database connected to the specified path.");
      } else {
        console.log("No data exists at the specified path.");
      }
   
      var users = snapshot.val();
      var auth = false;

      for (var i = 1; i < users.length; i++) {
        var storedUsername = users[i].Username;
        var storedPassword = users[i].Password;
  
        if (inputUsername === storedUsername && inputPassword === storedPassword) {
          auth = true;
          break;
        } 
      }
      if (auth == true){
        console.log("Input value matches the stored value.");
        window.location.href = "dashboard.html";
      }
      else{
        myFunction();
        console.log("Input value does not match the stored value.");
        document.getElementById('contactForm').reset();
      }
      
      });
}
