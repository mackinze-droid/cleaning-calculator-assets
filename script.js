document.addEventListener('DOMContentLoaded', function() {
    const services = [
        { checkbox: 'window-cleaning-service', details: 'window-cleaning-details', toggle: toggleWindowCleaningDetails },
        { checkbox: 'pressure-washing-service', details: 'pressure-washing-details', toggle: togglePressureWashingDetails },
        { checkbox: 'gutter-cleaning-service', details: 'gutter-cleaning-details', toggle: toggleGutterCleaningDetails },
        { checkbox: 'roof-cleaning-service', details: 'roof-cleaning-details', toggle: toggleRoofCleaningDetails }
    ];

    const pressureWashingServices = [
        { checkbox: 'house-wash', details: 'house-wash-details', toggle: toggleHouseWashDetails },
        { checkbox: 'driveway-clean', details: 'driveway-clean-details', toggle: toggleDrivewayCleanDetails },
        { checkbox: 'patio-clean', details: 'patio-clean-details', toggle: togglePatioCleanDetails },
        { checkbox: 'deck-clean', details: 'deck-clean-details', toggle: toggleDeckCleanDetails }
    ];

    services.forEach(service => {
        const checkbox = document.getElementById(service.checkbox);
        const details = document.getElementById(service.details);
        if (checkbox) {
            checkbox.addEventListener('change', service.toggle);
            service.toggle(); // Initial setup
        }
    });

    pressureWashingServices.forEach(service => {
        const checkbox = document.getElementById(service.checkbox);
        const details = document.getElementById(service.details);
        if (checkbox) {
            checkbox.addEventListener('change', service.toggle);
            service.toggle(); // Initial setup
        }
    });

    function toggleWindowCleaningDetails() {
        const checkbox = document.getElementById('window-cleaning-service');
        const details = document.getElementById('window-cleaning-details');
        if (details) {
            details.style.display = checkbox.checked ? 'block' : 'none';
        }
    }

    function togglePressureWashingDetails() {
        const checkbox = document.getElementById('pressure-washing-service');
        const details = document.getElementById('pressure-washing-details');
        if (details) {
            details.style.display = checkbox.checked ? 'block' : 'none';
        }
    }

    function toggleGutterCleaningDetails() {
        const checkbox = document.getElementById('gutter-cleaning-service');
        const details = document.getElementById('gutter-cleaning-details');
        if (details) {
            details.style.display = checkbox.checked ? 'block' : 'none';
        }
    }

    function toggleRoofCleaningDetails() {
        const checkbox = document.getElementById('roof-cleaning-service');
        const details = document.getElementById('roof-cleaning-details');
        if (details) {
            details.style.display = checkbox.checked ? 'block' : 'none';
        }
    }

    function toggleHouseWashDetails() {
        const checkbox = document.getElementById('house-wash');
        const details = document.getElementById('house-wash-details');
        if (details) {
            details.style.display = checkbox.checked ? 'block' : 'none';
            checkbox.setAttribute('aria-expanded', checkbox.checked.toString());
        }
    }

    function toggleDrivewayCleanDetails() {
        const checkbox = document.getElementById('driveway-clean');
        const details = document.getElementById('driveway-clean-details');
        if (details) {
            details.style.display = checkbox.checked ? 'block' : 'none';
            checkbox.setAttribute('aria-expanded', checkbox.checked.toString());
        }
    }

    function togglePatioCleanDetails() {
        const checkbox = document.getElementById('patio-clean');
        const details = document.getElementById('patio-clean-details');
        if (details) {
            details.style.display = checkbox.checked ? 'block' : 'none';
            checkbox.setAttribute('aria-expanded', checkbox.checked.toString());
        }
    }

    function toggleDeckCleanDetails() {
        const checkbox = document.getElementById('deck-clean');
        const details = document.getElementById('deck-clean-details');
        if (details) {
            details.style.display = checkbox.checked ? 'block' : 'none';
            checkbox.setAttribute('aria-expanded', checkbox.checked.toString());
        }
    }

    const photoUpload = document.getElementById('photo-upload');
    const imagePreview = document.getElementById('image-preview');

    if (photoUpload) {
        photoUpload.addEventListener('change', displayImagePreview);
    }

    function displayImagePreview(event) {
        if (!imagePreview) return;
        imagePreview.innerHTML = ''; // Clear previous previews
        const files = event.target.files;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                imagePreview.appendChild(img);
            }

            reader.readAsDataURL(file);
        }
    }

    const calculateButton = document.getElementById('calculate-button');
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateEstimate);
    }

    function calculateEstimate() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const additionalDetails = document.getElementById('additional-details').value;
    
        const uploadedPhotos = photoUpload && photoUpload.files ? photoUpload.files : [];
    
        const formDataObject = {
            name,
            email,
            phone,
            address,
            additionalDetails,
            windowCleaning: document.getElementById('window-cleaning-service').checked,
            pressureWashing: document.getElementById('pressure-washing-service').checked,
            gutterCleaning: document.getElementById('gutter-cleaning-service').checked,
            houseSize: document.getElementById('house-size') ? document.getElementById('house-size').value : '',
            drivewaySize: document.getElementById('driveway-size') ? document.getElementById('driveway-size').value : ''
        };
    
        const photoURLs = Array.from(uploadedPhotos).map((file, index) => {
            return `https://example.com/placeholder-image-${index + 1}.jpg`; // Replace with your image upload logic
        });
    
        formDataObject.photoURLs = photoURLs.join(',');
    
        console.log('Form Data:', formDataObject);
    
        fetch('https://script.google.com/macros/s/AKfycbwb0bojFsXmVWT4vyHd1-DHHS6mImYZBUzmETTv9EYuoXX8SupcfqOxEDTfniC6f-t81Q/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObject),
        })
        .then(response => {
            console.log('Response:', response);
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        })
        .then(data => {
            console.log('Data:', data);
            alert(data.message);
            const estimatedCostSpan = document.getElementById('estimated-cost');
            if (estimatedCostSpan) {
                estimatedCostSpan.textContent = data.estimatedCost;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting the estimate: ' + error.message);
            const estimatedCostSpan = document.getElementById('estimated-cost');
            if (estimatedCostSpan) {
                estimatedCostSpan.textContent = 'Error!';
            }
        });
    }
});