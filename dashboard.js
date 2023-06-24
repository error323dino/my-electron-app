import database from './index.js';
import {ref, onValue} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js"

let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
 
  slides[slideIndex-1].style.display = "block";  
  setTimeout(showSlides, 2000); // Change image every 2 seconds
}

document.getElementById("dashboard_locationBtn").addEventListener("load", displayDashboardLocation());

function displayDashboardLocation(){
    var databaseRef = ref(database, "Location");
  
    onValue(databaseRef,function(snapshot) {
        if (snapshot.exists()) {
          console.log("Database connected to the specified path.");
        } else {
          console.log("No data exists at the specified path.");
        }
        const objectNames = Object.keys(snapshot.val());
        const buttonsContainer = document.getElementById('dashboard_locationBtn');
        objectNames.forEach((objectName) => {
          const button = document.createElement('button');
          button.textContent = objectName;

          button.style.backgroundColor = 'Grey';
          button.style.fontSize = '15px';
          button.style.color = 'white';
          button.style.border = 'none';
          button.style.width = '200px';
          button.style.padding = '20px 20px';
          button.style.margin = '35px';

          // button.addEventListener('click', () => {
            // window.location.href = 'location.html?parameter=${encodeURIComponent(objectName)}`';
          // });
      
          buttonsContainer.appendChild(button);
        });
      });
    }

document.getElementById("redLightBtn").addEventListener("click", () => {
  // Redirect to another page
  window.location.href = 'redLight.html';
});

  
