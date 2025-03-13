$(document).ready(function() {

  // --- DOM Elements ---
  const form = document.getElementById('estimateForm');
  const serviceAddressSection = document.getElementById('serviceAddressSection');
  const serviceAddressSame = document.getElementById('serviceAddressSame');
  const windowCleaningSection = document.getElementById('windowCleaningSection');
  const gutterCleaningSection = document.getElementById('gutterCleaningSection');
  const pressureWashingSection = document.getElementById('pressureWashingSection');
  const estimateResultDiv = document.getElementById('estimateResult');
  const estimateAmountP = document.getElementById('estimateAmount');
  const errorMessagesDiv = document.getElementById('errorMessages');

  // Pressure washing surface detail sections
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

  // --- Google Apps Script URL ---
  const scriptURL = 'https://script.google.com/macros/s/AKfycbz-wmSMFBYcAoHvuVQU7vhonXHKMZmzFsSKsBy6imcC8JjIr6fFDNPS5ZkfrpIhssQvSQ/exec';  // Replace this!
  console.log("Script URL:", scriptURL); // Debugging

  // --- Helper Functions ---

  function displayError(message) {
    console.error("Error:", message); // Log errors to the console too
    errorMessagesDiv.style.display = 'block';
    errorMessagesDiv.querySelector('p').textContent = message;
  }

  function clearErrors() {
    errorMessagesDiv.style.display = 'none';
    errorMessagesDiv.querySelector('p').textContent = '';
  }

  function validateForm() {
    clearErrors();  // Start by clearing any previous errors

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

    // Add more specific validation for other fields here if needed

    return true;  // Form is valid
  }

  // --- Event Listeners ---

  // Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    console.log("Form submission started.");  // Debugging

    if (!validateForm()) {
      console.log("Form validation failed.");  // Debugging
      return; // Stop submission if the form is invalid
    }

    const formData = new FormData(form);
    console.log("Form data:", formData); //Debugging: This won't show the data well, but confirms FormData object is created.

    try {
      const response = await fetch(scriptURL, {
        method: 'POST',
        body: formData,
      });

      console.log("Fetch response:", response); //Debugging: Check the raw response

      if (!response.ok) {
        const errorText = await response.text(); //Get the response text for better error message
        throw new Error(`HTTP error! status: ${response.status},  text: ${errorText}`);
      }

      const data = await response.json();
      console.log("Response data:", data);  //Debugging

      if (data.result === 'success') {
        estimateAmountP.textContent = `Your estimated cost: $${data.estimate}`;
        estimateResultDiv.style.display = 'block';
        console.log('Submission successful', data);
        form.reset(); // Clear the form after successful submission
      } else {
        displayError(`Submission failed: ${data.error}`);
        console.error('Submission failed', data);
      }
    } catch (error) {
      displayError(`Error: ${error.message}`);
      console.error('Error!', error.message);
    }
  });

  // Service Address Toggle
  serviceAddressSame.addEventListener('change', function() {
    serviceAddressSection.style.display = this.checked ? 'none' : 'block';
  });

  // Service Selection Toggles
  document.querySelectorAll('input[name="services"]').forEach(service => {
    service.addEventListener('change', function() {
      windowCleaningSection.style.display = document.getElementById('windowCleaning').checked ? 'block' : 'none';
      gutterCleaningSection.style.display = document.getElementById('gutterCleaning').checked ? 'block' : 'none';
      pressureWashingSection.style.display = document.getElementById('pressureWashing').checked ? 'block' : 'none';
    });
  });

  // Pressure Washing Surface Details Toggles
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

  console.log("Script loaded and event listeners attached."); // Debugging: Confirm script runs

}); // End of $(document).ready()
