import database from './index.js';
import {ref, onValue} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js"

document.getElementById("screenshots").addEventListener("load", displayLocationScreenshots());

function displayLocationScreenshots(){
    var databaseRef = ref(database, "Location");
  
    onValue(databaseRef,function(snapshot) {
        if (snapshot.exists()) {
          console.log("Database connected to the specified path.");
        } else {
          console.log("No data exists at the specified path.");
        }

        const listElement = document.createElement('ul');

        const objectNames = Object.keys(snapshot.val());

        objectNames.forEach((objectName) => {
          const listItemElement = document.createElement('li');
          const clickableWord = document.createElement('a');
          clickableWord.textContent = objectName;
          clickableWord.href = '#';

          listElement.style.listStyleType = 'none';
          listElement.style.padding= '10px';
          listItemElement.style.marginBottom='40px';
          clickableWord.style.color = 'black';
          clickableWord.style.cursor = 'pointer';
          clickableWord.style.textDecoration = 'none';

          clickableWord.addEventListener('click', () => {
            findChildPath(objectName);
          });
  
          listItemElement.appendChild(clickableWord);
          listElement.appendChild(listItemElement);
        });
        listLocation.appendChild(listElement);
        const firstClickableWord = listElement.querySelector('a');
        if (firstClickableWord) {
          firstClickableWord.click();
        }
      });
}

function findChildPath(location) {
  const dynamicPath = "Saman"; // You may need to update this if your path structure varies
  var databaseRef = ref(database, dynamicPath);

  onValue(databaseRef, function (snapshot) {
    if (snapshot.exists()) {
      console.log("Database connected to the specified path.");
    } else {
      console.log("No data exists at the specified path.");
    }

    const objectNames = Object.keys(snapshot.val());

    // Call the displayScreenshots function with the selected location and the database snapshot
    displayScreenshots(location, snapshot);
  });
}


function displayScreenshots(location, snapshot) {
  const ssContainer = document.getElementById('listScreenshot');
  ssContainer.innerHTML = '';

  const objects = snapshot.val();

  let row = document.createElement('div');
  row.classList.add('grid-row'); // Create a row container

  let count = 0; // To keep track of items in the current row

  // Iterate through the objects and display only those matching the selected location
  for (const objectName in objects) {
    if (objects.hasOwnProperty(objectName)) {
      const objectDetails = objects[objectName];
      if (objectDetails.Location === location) {
        const objectDiv = document.createElement('div');
        objectDiv.classList.add('grid-item'); // Assuming you have a CSS class for styling grid items

        const objectHeader = document.createElement('h3');
        objectHeader.textContent = objectName;

        // Create an <img> element for displaying the image
        const imageElement = document.createElement('img');

        // Generate the signed URL for the image
        const signedUrl = objectDetails.Picture; // Replace with the actual signed URL

        imageElement.src = signedUrl; // Set the src attribute to the signed URL

        const fieldsToDisplay = ['Camera', 'CarPlate', 'Location', 'Time'];

        fieldsToDisplay.forEach((fieldName) => {
          if (objectDetails.hasOwnProperty(fieldName)) {
            const propertyParagraph = document.createElement('p');
            propertyParagraph.textContent = `${fieldName}: ${objectDetails[fieldName]}`;
            objectDiv.appendChild(propertyParagraph);
          }
        });

        // Append the image and other details to the current grid item
        objectDiv.appendChild(imageElement);
        row.appendChild(objectDiv);

        count++;

        // If we have reached two items in the current row, start a new row
        if (count === 2) {
          ssContainer.appendChild(row);
          row = document.createElement('div');
          row.classList.add('grid-row'); // Create a new row container
          count = 0;
        }
      }
    }
  }

  // Append the last row if it's not full
  if (count > 0) {
    ssContainer.appendChild(row);
  }
}



document.getElementById('goBackLink').addEventListener('click', function (event) {
  event.preventDefault(); // Prevent the default link behavior
  window.history.back(); // Navigate back to the previous page
});
