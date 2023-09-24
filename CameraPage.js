import { ref, onValue, set, get, remove } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import database from './index.js';


// Regular expression for validating an IP address
const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

document.addEventListener('DOMContentLoaded', async () => {
    const db = database;
    const params = new URLSearchParams(window.location.search);
    const stateName = params.get('state');
    
    
    if (stateName) {
        const stateRef = ref(db, 'Location/' + stateName);
        const cameraRef = ref(db, 'Camera');
        
        try {
            const [stateSnapshot, cameraSnapshot] = await Promise.all([
                get(stateRef),
                get(cameraRef)
            ]);
            
            if (stateSnapshot.exists()) {
                const stateData = stateSnapshot.val();
                const cameraData = cameraSnapshot.val();
            
            // Populate State Input
            document.getElementById('stateInput').value = stateName;
            
            // Populate City Input
            document.getElementById('cityInput').value = stateData.Address;
            
            // Populate Street Input
            document.getElementById('streetInput').value = stateData.Street; // Corrected to "Street"
    
            // Populate IP Address Inputs
            const ipAddressesContainer = document.getElementById('ipAddressesContainer');
            const cameraIDs = stateData.Camera || {}; // Corrected to "Camera"
            for (const cameraID in cameraIDs) {
              if (cameraData[cameraID]) {
                console.log("IP Address for cameraID", cameraID, ":", cameraData[cameraID].ipAddress);
                
                const div = document.createElement('div');
                const label = document.createElement('label');
                label.innerHTML = 'IP Address';
                div.appendChild(label);
                
                const ipAddressInput = document.createElement('input');
                ipAddressInput.type = "text";
                ipAddressInput.className = "form-control";
                ipAddressInput.value = cameraData[cameraID].ipAddress;
                ipAddressInput.disabled = true;
                div.appendChild(ipAddressInput);
                
                ipAddressesContainer.appendChild(div);
              } else {
                console.warn("No data available for cameraID:", cameraID);
              }
            }
    
           // Add Edit Button Event Listener
            document.getElementById('editBtn').addEventListener('click', () => {
            document.querySelectorAll('.form-control').forEach(input => input.disabled = false);
            document.getElementById('editBtn').style.display = 'none';
            document.getElementById('saveBtn').style.display = 'block';
            document.getElementById('deleteBtn').style.display = 'none';

            // Attach IP Address Validation Listener to all IP Address inputs
            document.querySelectorAll('.ip-address-input').forEach(ipInput => {
                ipInput.addEventListener('input', function () {
                if (ipPattern.test(ipInput.value)) {
                    ipInput.classList.add('is-valid');
                    ipInput.classList.remove('is-invalid');
                } else {
                    ipInput.classList.add('is-invalid');
                    ipInput.classList.remove('is-valid');
                }
                });
            });
        });

        // Add Edit Button Event Listener
        document.getElementById('saveBtn').addEventListener('click', () => {
            document.querySelectorAll('.form-control').forEach(input => input.disabled = true);
            document.getElementById('editBtn').style.display = 'inline';
            document.getElementById('saveBtn').style.display = 'none';
            document.getElementById('deleteBtn').style.display = 'inline';
        });
        

        // Add Save Button Event Listener
        document.getElementById('saveBtn').addEventListener('click', async (e) => {
            e.preventDefault();
            const updatedState = document.getElementById('stateInput').value;
            const updatedCity = document.getElementById('cityInput').value;
            const updatedStreet = document.getElementById('streetInput').value;
            
            await set(stateRef, { ...stateData, State: updatedState, Address: updatedCity, Street: updatedStreet });

            document.querySelectorAll('.form-control').forEach(input => input.disabled = true);
            document.getElementById('saveBtn').style.display = 'none';
            
            alert('Data Saved Successfully!');
        });

        // Add Delete Button Event Listener
        document.getElementById('deleteBtn').addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this camera?')) {
                try {
                    // Remove the camera data from Firebase
                    await remove(ref(db, 'Location/' + stateName));
                    await remove(ref(db, 'Camera/' + stateName)); // Adjust the path if needed
                    
                    // Redirect to the dashboard page
                    window.location.href = 'dashboard.html';
                } catch (error) {
                    console.error("Error deleting data:", error);
                }
            }
        });

    } else {
        console.error('No data available for this state.');
    }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        } else {
        console.error('State parameter is missing in the URL.');
        }
        });

