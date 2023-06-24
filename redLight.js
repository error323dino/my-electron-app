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

          clickableWord.addEventListener('click', displayScreenshots(objectName));
  
          listItemElement.appendChild(clickableWord);
          listElement.appendChild(listItemElement);
        });
        listLocation.appendChild(listElement);
      });
}

function displayScreenshots(location){
  const l = location;
  const dynamicPath = "Saman/" + l + "/";
  var databaseRef = ref(database, dynamicPath);
  onValue(databaseRef,function(snapshot) {
    const objectN = Object.keys(snapshot.val());
    const ssContainer = document.getElementById('listScreenshot');
    objectN.forEach((object) => {
      const ss= document.createElement('div');
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          const propertyParagraph = document.createElement("p");
          propertyParagraph.textContent = `${key}: ${object[key]}`;
          

          ss.appendChild(propertyParagraph);
        }
      }


      ssContainer.appendChild(ss);
    });
  });

}

