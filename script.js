$(document).ready(function() { 
const form = document.getElementById('estimateForm');
const serviceAddressSection = document.getElementById('serviceAddressSection');
const serviceAddressSame = document.getElementById('serviceAddressSame');
const windowCleaningSection = document.getElementById('windowCleaningSection');
const gutterCleaningSection = document.getElementById('gutterCleaningSection');
const pressureWashingSection = document.getElementById('pressureWashingSection');
const estimateResultDiv = document.getElementById('estimateResult');
const estimateAmountP = document.getElementById('estimateAmount');
const errorMessagesDiv = document.getElementById('errorMessages');

//Pressure washing surface detail sections
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

// Google Apps Script URL (replace with your actual URL)
const scriptURL = 'https://script.google.com/macros/s/AKfycbzJIs2BTuswQYjpEyOogEhULTvPmt_8IDlEy0KDN9fD6fZUJTwYTYEfUv29rH0iL6pGzQ/exec';

// Function to display error messages
function displayError(message) {
    errorMessagesDiv.style.display = 'block';
    errorMessagesDiv.querySelector('p').textContent = message;
}

// Function to clear error messages
function clearErrors() {
    errorMessagesDiv.style.display = 'none';
    errorMessagesDiv.querySelector('p').textContent = '';
}

// Function to validate the form
function validateForm() {
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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        displayError('Please enter a valid email address.');
        return false;
    }

    // Add more validation as needed for other fields

    return true;
}

// Function to handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const formData = new FormData(form);

    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.result === 'success') {
            // Display the estimate
            estimateAmountP.textContent = `Your estimated cost: $${data.estimate}`;
            estimateResultDiv.style.display = 'block';
            console.log('Submission successful', data);
            form.reset(); // Clear the form
        } else {
            // Display error message from the script
            displayError(`Submission failed: ${data.error}`);
            console.error('Submission failed', data);
        }
    } catch (error) {
        displayError(`Error: ${error.message}`);
        console.error('Error!', error.message);
    }
});

// Event listeners to toggle service address and service sections
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

// Pressure washing surface details toggle

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
}
