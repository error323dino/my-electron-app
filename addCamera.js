import { ref, set, push, orderByChild, equalTo, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js"
import database from './index.js';

// Regular expression for validating an IP address
const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

// The 'DOMContentLoaded' event is fired when the initial HTML document has been completely loaded
// and parsed, without waiting for stylesheets, images, and subframes to finish loading.

// ipCount initialized
let ipCount = 1;
document.addEventListener('DOMContentLoaded', (event) => {

    // Attach event listener to the first IP Address input
    const firstIpAddressInput = document.getElementById('ipAddressInput1');
    
    firstIpAddressInput.addEventListener('input', function() {
        if(ipPattern.test(firstIpAddressInput.value)) {
            firstIpAddressInput.classList.add('is-valid');
            firstIpAddressInput.classList.remove('is-invalid');
        } else {
            firstIpAddressInput.classList.add('is-invalid');
            firstIpAddressInput.classList.remove('is-valid');
        }
    });

    // Event listener for "Add More Camera" button
    addMoreCameraBtn.addEventListener('click', function () {
        // Check if the maximum number of IP address fields is reached
        if(ipCount < 3) {
            ipCount++;
            const newIpRow = document.createElement('div');
            newIpRow.className = 'form-row ip-address-row';
            newIpRow.innerHTML = `
                <div class="col-md-4 mb-3">
                    <label for="ipAddressInput${ipCount}">Ip Address</label>
                    <input type="text" class="form-control" id="ipAddressInput${ipCount}" placeholder="Ip Address" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                    <div class="invalid-feedback">
                        Please enter a valid IP address.
                    </div>
                </div>`;
            ipAddressesContainer.appendChild(newIpRow);
            
            // Attach event listener to the new IP Address input
            const newIpAddressInput = document.getElementById(`ipAddressInput${ipCount}`);
            newIpAddressInput.addEventListener('input', function() {
                if(ipPattern.test(newIpAddressInput.value)) {
                    newIpAddressInput.classList.add('is-valid');
                    newIpAddressInput.classList.remove('is-invalid');
                } else {
                    newIpAddressInput.classList.add('is-invalid');
                    newIpAddressInput.classList.remove('is-valid');
                }
            });
            if (ipCount >= 3) {
                // Hide the "Add More Camera" button
                addMoreCameraBtn.style.display = 'none';
            }
        } else {
            // Optionally, inform the user that they cannot add more IP address fields
            alert("You can only add up to 3 IP addresses.");
        }
    });


    // Fetching the data from the JSON file
    fetch('location.json')
    .then(response => response.json()) // Parsing the data as JSON
    .then(data => {
    // Getting the select elements
    const stateDropdown = document.getElementById('stateDropdown');
    const cityDropdown = document.getElementById('cityDropdown');

    // Initially, cityDropdown is disabled
    cityDropdown.disabled = true;
    
    // Populating the state dropdown
    for (const state in data) {
        const option = document.createElement('option');
        option.value = state;
        option.text = state;
        stateDropdown.add(option);
    }

    // Event listener to update the city/town dropdown when a state is selected
    stateDropdown.addEventListener('change', function() {
        // Clearing the previous city/town options
        cityDropdown.innerHTML = '<option value="" selected disabled>Please Select City/Town</option>';
        
        // Validate the state dropdown
        validateDropdown(this);

        // Getting the selected state
        const selectedState = this.value;

        // If a state is selected, enable cityDropdown, else disable it
        cityDropdown.disabled = !selectedState;
        
        // Populating the city/town dropdown
        if (selectedState) {
            data[selectedState].forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.text = city;
                cityDropdown.add(option);
            });
        }
    });

    // Event listener to validate the city/town selection
    cityDropdown.addEventListener('change', function() {
        // Validate the city dropdown
        validateDropdown(this);
    });

    // Function to validate dropdown selection
    function validateDropdown(dropdown) {
        const selectedValue = dropdown.value;
        if (!selectedValue) {
            dropdown.classList.add('is-invalid');
        } else {
            dropdown.classList.remove('is-invalid');
        }
    }
    })
    .catch(error => console.error('Error fetching the JSON data:', error));

    const streetInput = document.getElementById('streetInput');
        
    streetInput.addEventListener('blur', function() {
        if (this.value.trim() === "") {
            this.classList.remove('is-valid');
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
        }
    });

    document.getElementById('yourForm').addEventListener('submit', async function(e) {
        e.preventDefault();
    
        try {
            // Gather form data
            let ipAddresses = []; // Collect IP addresses from the form
            let state = document.getElementById('stateDropdown').value;
            let city = document.getElementById('cityDropdown').value;
            let street = document.getElementById('streetInput').value;
    
            // Collect IP Addresses
            for (let i = 1; i <= ipCount; i++) {
                let ipInput = document.getElementById(`ipAddressInput${i}`);
                if (ipInput && ipPattern.test(ipInput.value)) {
                    ipAddresses.push(ipInput.value);
                }
            }
    
            // Validate form data
            if (!state || !city || !street || ipAddresses.length === 0) {
                throw new Error('All fields are required!');
            }
    
            // Define the location reference
            let locationRef = ref(database, `Location/${state}`);
            // Define the camera reference
            let cameraRef = ref(database, 'Camera');
            
            // Array to store the new Camera IDs
            let cameraIds = [];
    
            // Loop through the IP Addresses, create a new Camera entry for each, and collect the IDs
            for (let ip of ipAddresses) {
                let newCameraRef = push(cameraRef); // This will create a new entry in Camera node with a unique key
                await set(newCameraRef, {
                    ipAddress: ip
                });
                cameraIds.push(newCameraRef.key); // Store the unique key (cameraID)
            }
    
            // Set the data for the specific state along with the camera IDs
            await set(locationRef, {
                Address: city,
                Street: street,
                Camera: Object.fromEntries(cameraIds.map(id => [id, true])) // Storing cameraIds as keys
            });
    
            // Optionally, show a success message to the user
            alert('Data has been successfully saved!');
            window.location.href = "dashboard.html";
            
        } catch (error) {
            // Log the error to the console and show an error message to the user
            console.error('Error saving data:', error);
            alert('Error saving data: ' + error.message);
        }
    });
    


});
