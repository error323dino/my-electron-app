import database from './index.js';
import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let numberText = document.querySelector(".numbertext"); // Select the numbertext element
  
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  
  slides[slideIndex-1].style.display = "block";
  
  // Update the numbertext for the current slide
  numberText.textContent = `${slideIndex} / ${slides.length}`;
  
  setTimeout(showSlides, 2000); 
}

document.getElementById("dashboard_locationBtn").addEventListener("load", displayDashboardLocation());
const buttonsContainer = document.getElementById('dashboard_locationBtn');
const searchInput = document.getElementById('search-bar');

function displayDashboardLocation() {
  var databaseRef = ref(database, "Location");
  onValue(databaseRef, function(snapshot) {
    if (snapshot.exists()) {
      console.log("Database connected to the specified path.");
    } else {
      console.log("No data exists at the specified path.");
    }
    const objectNames = Object.keys(snapshot.val());

    objectNames.forEach((objectName) => {
      const button = document.createElement('button');
      button.textContent = objectName;
      button.classList.add('btn', 'btn-outline-primary');
      button.style.fontSize = '15px';
      button.style.width = '200px';
      button.style.margin = '25px';
      button.style.padding = '10px 20px';

      button.addEventListener('click', () => {
        window.location.href = `CameraPage.html?state=${objectName}`;
      });

      buttonsContainer.appendChild(button);
    });

    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      const buttons = document.getElementsByClassName("btn");

      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const buttonText = button.textContent.toLowerCase();

        if (searchTerm === "") {
          location.reload();
        } else if (buttonText.includes(searchTerm)) {
          button.style.display = "block";
        } else {
          button.style.display = "none";
        }
      }
    });
  });
}

document.getElementById("logoutBtn").addEventListener("click", function() {
  window.location.href = "login.html";
});

//go to camera page 
document.getElementById("toAddCameraPage").addEventListener("click", function() {
  window.location.href = "addCamera.html";
});
