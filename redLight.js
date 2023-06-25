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

function findChildPath(location){
  const childValue =location;
  const dynamicPath = "Saman";
  var databaseRef = ref(database, dynamicPath);

  onValue(databaseRef,function(snapshot) {
    if (snapshot.exists()) {
      console.log("Database connected to the specified path.");
    } else {
      console.log("No data exists at the specified path.");
    }

    const objectN = Object.keys(snapshot.val());
    let findObjectN = [];

    objectN.forEach((objectName) => {
      const childObject = snapshot.child(objectName).val();
      if (childObject && childObject.Location=== childValue) {
        findObjectN.push(objectName);
      }
      console.log(findObjectN)
      displayScreenshots(findObjectN, snapshot)
    });
  });

}

function displayScreenshots(path, snapshot){

  const ssContainer = document.getElementById('listScreenshot');

  
    ssContainer.innerHTML = '';

    path.forEach((objectName) => {
      const objectDiv = document.createElement('div');
      objectDiv.style.padding = '100px';
      objectDiv.style.marginBottom = '10px';
  
      objectDiv.classList.add('objectDetails');

      const objectHeader = document.createElement('h3');
      objectHeader.textContent = objectName;

      const objectDetails = snapshot.val()[objectName];

      for (const key in objectDetails) {
        if (objectDetails.hasOwnProperty(key)) {
          const propertyParagraph = document.createElement("p");
          propertyParagraph.textContent = `${key}: ${objectDetails[key]}`;

          objectDiv.appendChild(propertyParagraph);
        }
      }

      ssContainer.appendChild(objectDiv);
    });
}
