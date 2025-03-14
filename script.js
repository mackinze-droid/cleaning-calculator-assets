$(document).ready(function() {

    // --- DOM Elements --- (unchanged)
    const form = document.getElementById('estimateForm');
    const serviceAddressSection = document.getElementById('serviceAddressSection');
    const serviceAddressSame = document.getElementById('serviceAddressSame');
    const windowCleaningSection = document.getElementById('windowCleaningSection');
    const gutterCleaningSection = document.getElementById('gutterCleaningSection');
    const pressureWashingSection = document.getElementById('pressureWashingSection');
    const estimateResultDiv = document.getElementById('estimateResult');
    const estimateAmountP = document.getElementById('estimateAmount');
    const errorMessagesDiv = document.getElementById('errorMessages');

    // Pressure washing surface detail sections (unchanged)
    const pwHouseCheckbox = document.getElementById('pwHouse');
    const houseDetails = document.getElementById('houseDetails');
    const pwPatioCheckbox = document.getElementById('pwPatio');
    const patioDetails = document.getElementById('patioDetails');
    const pwDeckCheckbox = document.getElementById('pwDeck');
    const deckDetails = document.getElementById('deckDetails');
    const pwDrivewayCheckbox = document.getElementById('pwDriveway');
    const drivewayDetails = document.getElementById('drivewayDetails');
    const pwSidewalkCheckbox = document.getElementById('pwSidewalk');
    const sidewalkDetails = document.getElementById('sidewalkDetails');
    const pwRoofCheckbox = document.getElementById('pwRoof');
    const roofDetails = document.getElementById('roofDetails');

    // --- Google Apps Script URL --- (unchanged)
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxFFSeVwvcRTyJG0RMHxxaxD2qOK6LFj43BeI3oJk_Ja0rU6iwIZUv-KNb5DPcU-tmUGQ/exec';  // Replace this!
    console.log("Script URL:", scriptURL); // Debugging

    // --- Helper Functions --- (unchanged)
    function displayError(message) {
        console.error("Error:", message);
        errorMessagesDiv.style.display = 'block';
        errorMessagesDiv.querySelector('p').textContent = message;
    }

    function clearErrors() {
        errorMessagesDiv.style.display = 'none';
        errorMessagesDiv.querySelector('p').textContent = '';
    }

    function validateForm() { // (unchanged)
        clearErrors();
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();

        if (!name) {
            displayError('Please enter your name.');
            return false;
        }
        if (!phone) {
            displayError('Please enter your phone number.');
            return false;
        }
        if (!email) {
            displayError('Please enter your email address.');
            return false;
        }
        if (!address) {
            displayError('Please enter your address.');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            displayError('Please enter a valid email address.');
            return false;
        }
        return true;
    }

    // --- Event Listeners --- (Form Submission - **MODIFIED for Calculation**)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        console.log("Form submission started.");

        if (!validateForm()) {
            console.log("Form validation failed.");
            return;
        }

        // --- **ESTIMATE CALCULATION LOGIC (Moved from Code.gs)** ---
        let estimate = 0;
        const services = Array.from(document.querySelectorAll('input[name="services"]:checked')).map(cb => cb.value);

        if (services.includes('windowCleaning')) {
            const doubleHung = parseInt(document.getElementById('doubleHung').value) || 0;
            const bay = parseInt(document.getElementById('bay').value) || 0;
            const specialty = parseInt(document.getElementById('specialty').value) || 0;
            const sliding = parseInt(document.getElementById('sliding').value) || 0;
            const casement = parseInt(document.getElementById('casement').value) || 0;
            const picture = parseInt(document.getElementById('picture').value) || 0;
            estimate += (doubleHung * 5) + (bay * 10) + (specialty * 15) + (sliding * 7) + (casement * 8) + (picture * 12); // Example pricing
        }
        if (services.includes('gutterCleaning')) {
            const gutterFootage = parseInt(document.getElementById('gutterFootage').value) || 0;
            estimate += gutterFootage * 2; // Example pricing
        }
        if (services.includes('pressureWashing')) {
            let pwArea = 0;
            const pwSurfaces = Array.from(document.querySelectorAll('input[name="pwSurfaces"]:checked')).map(cb => cb.value);
            if (pwSurfaces.includes('house')) {
                const houseLength = parseInt(document.getElementById('houseLength').value) || 0;
                const houseWidth = parseInt(document.getElementById('houseWidth').value) || 0;
                pwArea += houseLength * houseWidth;
            }
            if (pwSurfaces.includes('patio')) {
                const patioLength = parseInt(document.getElementById('patioLength').value) || 0;
                const patioWidth = parseInt(document.getElementById('patioWidth').value) || 0;
                pwArea += patioLength * patioWidth;
            }
            if (pwSurfaces.includes('deck')) {
                const deckLength = parseInt(document.getElementById('deckLength').value) || 0;
                const deckWidth = parseInt(document.getElementById('deckWidth').value) || 0;
                pwArea += deckLength * deckWidth;
            }
            if (pwSurfaces.includes('driveway')) {
                const drivewayLength = parseInt(document.getElementById('drivewayLength').value) || 0;
                const drivewayWidth = parseInt(document.getElementById('drivewayWidth').value) || 0;
                pwArea += drivewayLength * drivewayWidth;
            }
            if (pwSurfaces.includes('sidewalk')) {
                const sidewalkLength = parseInt(document.getElementById('sidewalkLength').value) || 0;
                const sidewalkWidth = parseInt(document.getElementById('sidewalkWidth').value) || 0;
                pwArea += sidewalkLength * sidewalkWidth;
            }
            if (pwSurfaces.includes('roof')) {
                const roofLength = parseInt(document.getElementById('roofLength').value) || 0;
                const roofWidth = parseInt(document.getElementById('roofWidth').value) || 0;
                pwArea += roofLength * roofWidth;
            }
            estimate += pwArea * 0.5; // Example pricing per square foot
        }
        // --- **END ESTIMATE CALCULATION** ---

        estimateAmountP.textContent = `Your estimated cost: $${estimate}`; // Display estimate in script.js
        estimateResultDiv.style.display = 'block'; // Show estimate result

        const formData = new FormData(form);
        formData.append('calculatedEstimate', estimate); // Add calculated estimate to formData

        console.log("Form data for submission:", formData);

        try {
            const response = await fetch(scriptURL, {
                method: 'POST',
                body: formData,
            });

            console.log("Fetch response:", response);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status},  text: ${errorText}`);
            }

            const data = await response.json();
            console.log("Response data from Apps Script (data storage confirmation):", data);

            if (data.result === 'success') {
                console.log('Data submission successful (data storage confirmed)', data);
                form.reset(); // Clear the form after successful submission
            } else {
                displayError(`Data submission failed: ${data.error}`);
                console.error('Data submission failed', data);
            }
        } catch (error) {
            displayError(`Error submitting data: ${error.message}`);
            console.error('Error!', error.message);
        }
    });

    // --- Event Listeners (Service Address, Service Toggles, PW Surface Toggles) --- (unchanged)
    serviceAddressSame.addEventListener('change', function() {
        serviceAddressSection.style.display = this.checked ? 'none' : 'block';
    });

    document.querySelectorAll('input[name="services"]').forEach(service => {
        service.addEventListener('change', function() {
            windowCleaningSection.style.display = document.getElementById('windowCleaning').checked ? 'block' : 'none';
            gutterCleaningSection.style.display = document.getElementById('gutterCleaning').checked ? 'block' : 'none';
            pressureWashingSection.style.display = document.getElementById('pressureWashing').checked ? 'block' : 'none';
        });
    });

    pwHouseCheckbox.addEventListener('change', function() {
        houseDetails.style.display = this.checked ? 'block' : 'none';
    });

    pwPatioCheckbox.addEventListener('change', function() {
        patioDetails.style.display = this.checked ? 'block' : 'none';
    });

    pwDeckCheckbox.addEventListener('change', function() {
        deckDetails.style.display = this.checked ? 'block' : 'none';
    });

    pwDrivewayCheckbox.addEventListener('change', function() {
        drivewayDetails.style.display = this.checked ? 'block' : 'none';
    });

    pwSidewalkCheckbox.addEventListener('change', function() {
        sidewalkDetails.style.display = this.checked ? 'block' : 'none';
    });

    pwRoofCheckbox.addEventListener('change', function() {
        roofDetails.style.display = this.checked ? 'block' : 'none';
    });

    console.log("Script loaded and event listeners attached.");

}); // End of $(document).ready()

    console.log("Script loaded and event listeners attached."); // Debugging: Confirm script runs

}); // End of $(document).ready()
