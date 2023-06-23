import database from './index.js';
import {ref, onValue} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js"

function displayDashboardLocation(){
    var databaseRef = ref(database, "Saman");
    onValue(databaseRef,function(snapshot) {
      if (snapshot.exists()) {
        console.log("Database connected to the specified path.");
      } else {
        console.log("No data exists at the specified path.");
      }
  
      const locationData = snapshot.val();
  
  
     const locationNames = Object.keys(locationData);
     const ul = document.createElement('ul');
     locationNames.forEach((name) => {
       const li = document.createElement('li');
       li.textContent = name;
       ul.appendChild(li);
     });
  
     // Append the <ul> element to the document body or any other desired element
     document.body.appendChild(ul);
    });
  }
  
  document.getElementById("dashboard_locationBtn").addEventListener('DOMContentLoaded', function() {
      displayDashboardLocation();
  });