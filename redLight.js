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
          clickableWord.classList.add('location-link');
          clickableWord.addEventListener('click', () => {
            findChildPath(objectName);
          });
  
          listItemElement.appendChild(clickableWord);
          listElement.appendChild(listItemElement);
        });
        listLocation.appendChild(listElement);
        const locationLinks = listElement.querySelectorAll('.location-link');

        locationLinks.forEach((link) => {
          link.addEventListener('mouseenter', () => {
            // Change the color to blue (or your desired color) on hover
            link.style.color = 'blue';
          });
          link.addEventListener('mouseleave', () => {
            // Change the color back to black when not hovering
            link.style.color = 'black';
          });

        });
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

// Function to display the screenshots without sorting
function displayScreenshots(location, snapshot) {
  const ssContainer = document.getElementById('listScreenshot');
  ssContainer.innerHTML = '';

  const objects = snapshot.val();
  let recordsFound = false; 

  let row = document.createElement('div');
  row.classList.add('grid-row'); // Create a row container

  let count = 0; // To keep track of items in the current row

  // Create an array to collect the items to display
  const screenshotItems = [];

  // Iterate through the objects and collect only those matching the selected location
  for (const objectName in objects) {
    if (objects.hasOwnProperty(objectName)) {
      const objectDetails = objects[objectName];
      if (objectDetails.Location === location) {
        recordsFound = true; 
        console.log("ok")
        const objectDiv = document.createElement('div');
        objectDiv.classList.add('grid-item'); // Assuming you have a CSS class for styling grid items

        const objectHeader = document.createElement('div');
        objectHeader.textContent = `Saman ID: ${objectName}`; // Display the Saman ID

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

        // Append the Saman ID, image, and other details to the current grid item
        objectDiv.appendChild(objectHeader);
        objectDiv.appendChild(imageElement);
        row.appendChild(objectDiv);

        count++;

        // If we have reached two items in the current row, start a new row
        if (count === 2) {
          screenshotItems.push(row.cloneNode(true)); // Clone the row and add it to the array
          row.innerHTML = ''; // Clear the row for the next items
          count = 0;
        }
      }
    }
  }
  if (!recordsFound) {
    const noRecordsDiv = document.createElement('div');
    noRecordsDiv.textContent = 'No record found for this location.';
    noRecordsDiv.classList.add('no-records-message'); // Add the CSS class
    ssContainer.appendChild(noRecordsDiv);
  }
  
  if(count > 0) {
    screenshotItems.push(row); // Add the last row if it's not empty
  }

  // Log the screenshot items to the console
  console.log(screenshotItems);

  // Add the screenshot items to the container
  screenshotItems.forEach((item) => {
    ssContainer.appendChild(item);
  });
}

// Function to extract timestamp
function extractTimestamp(textContent) {
  const timestampRegex = /(\d{2}\/\d{2} \d{2}:\d{2}:\d{2})/g;
  const timestamps = textContent.match(timestampRegex);

  if (timestamps && timestamps.length > 0) {
    // Use the first timestamp found in the text content for sorting
    const timestampString = timestamps[0];
    const [month, day, time] = timestampString.split(" ");
    const currentYear = new Date().getFullYear(); // Get the current year
    // Append the current year to the timestamp string to make it 'YYYY/MM/DD HH:MM:SS'
    const timestampWithYear = `${currentYear}/${timestampString}`;
    return new Date(timestampWithYear);
  }

  // Return a default date in case of missing or invalid timestamps
  return new Date(0);
}


// Track the current sorting order
let ascendingOrder = true;

// Select the sorting button by its ID
const sortButton = document.getElementById('sortButton');

// Add a click event listener to the button
sortButton.addEventListener('click', () => {
  // Toggle the sorting order
  ascendingOrder = !ascendingOrder;

  // Call the function to sort the output
  sortOutput();

  // Update the sort icon based on the sorting order
  updateSortIcon();
});

// Function to sort the output
function sortOutput() {
  const listScreenshot = document.getElementById('listScreenshot');
  const screenshotItems = Array.from(listScreenshot.querySelectorAll('.grid-item'));

  screenshotItems.sort((a, b) => {
    const timestampA = extractTimestamp(a.innerHTML);
    const timestampB = extractTimestamp(b.innerHTML);

    // Sort in ascending or descending order based on the current sorting order
    if (ascendingOrder) {
      return timestampA - timestampB;
    } else {
      return timestampB - timestampA;
    }
  });

  // Clear the container and append the sorted elements
  listScreenshot.innerHTML = ''; // Clear the existing content

  const columnsPerRow = 2; // Adjust this number to change the number of columns per row
  let currentRow;
  screenshotItems.forEach((item, index) => {
    if (index % columnsPerRow === 0) {
      // Start a new row
      currentRow = document.createElement('div');
      currentRow.classList.add('grid-row');
    }
    currentRow.appendChild(item);
    if ((index + 1) % columnsPerRow === 0 || index === screenshotItems.length - 1) {
      // Append the row to the container when it's full or for the last item
      listScreenshot.appendChild(currentRow);
    }
  });
}


// Function to update the sort icon
function updateSortIcon() {
  const sortIcon = document.querySelector('#sortButton svg');
  if (ascendingOrder) {
    // Change the icon to indicate ascending order
    sortIcon.classList.remove('bi-sort-down');
    sortIcon.classList.add('bi-sort-up');
  } else {
    // Change the icon to indicate descending order
    sortIcon.classList.remove('bi-sort-up');
    sortIcon.classList.add('bi-sort-down');
  }
}

// Initial sorting
sortOutput();

document.getElementById('goBackLink').addEventListener('click', function (event) {
  event.preventDefault(); // Prevent the default link behavior
  window.history.back(); // Navigate back to the previous page
});
document.getElementById("logoutBtn").addEventListener("click", function() {
  window.location.href = "login.html";
});
