document.addEventListener('DOMContentLoaded', function () {
    // Get references to the checkboxes and buttons
    const polizaCheckbox = document.getElementById('poliza-checkbox');
    const polizaInput = document.getElementById('poliza');
    const placaInput = document.getElementById('placa'); // Assuming placa input exists and needs to be disabled
    const nivelAtencionCheckboxes = document.querySelectorAll('input[name="nivelAtencionRadio"]');
    const operacionesEfectuarSelect = document.getElementById('operacionesEfectuar1');
    const moduloRespuestaSelect = document.getElementById('moduloRespuesta');
    const acceptTermsCheckbox = document.getElementById('acceptTerms');
    const firmarBtn = document.getElementById('firmar-btn');
    const enviarSolicitudBtn = document.getElementById('enviar-solicitud-btn');

    // Get references to photo input elements and preview elements
    const photoInputs = [
        { input: document.getElementById('foto1'), preview: document.getElementById('preview1') },
        { input: document.getElementById('foto2'), preview: document.getElementById('preview2') },
        { input: document.getElementById('foto3'), preview: document.getElementById('preview3') },
        { input: document.getElementById('foto4'), preview: document.getElementById('preview4') }
    ];

    // Function to handle photo input change and display preview
    function handlePhotoChange(event) {
        const input = event.target;
        const preview = photoInputs.find(item => item.input === input).preview;

        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                preview.src = e.target.result;
                preview.style.display = 'block'; // Show the image
            };

            reader.readAsDataURL(input.files[0]);
        } else {
            preview.src = '#';
            preview.style.display = 'none'; // Hide the image if no file
        }
        updateSendButtonState(); // Call this to check if all photos are taken
    }

    // Add event listeners to all photo input fields
    photoInputs.forEach(item => {
        item.input.addEventListener('change', handlePhotoChange);
    });

    // Function to check if all required photos are taken
    function areAllPhotosTaken() {
        return photoInputs.every(item => item.input.files && item.input.files.length > 0);
    }

    // Modify the updateButtonStates function to also check for photos
    function updateButtonStates() {
        firmarBtn.disabled = !acceptTermsCheckbox.checked;
        firmarBtn.style.backgroundColor = acceptTermsCheckbox.checked ? '#881F1E' : '#555555';
        firmarBtn.style.cursor = acceptTermsCheckbox.checked ? 'pointer' : 'not-allowed';
        // Enviar Solicitud button remains disabled until "Firmar" is clicked AND all photos are taken
        enviarSolicitudBtn.disabled = true; // Initially disabled
        enviarSolicitudBtn.style.backgroundColor = '#555555';
        enviarSolicitudBtn.style.cursor = 'not-allowed';
    }

    // Add a new function to update the "Enviar Solicitud" button state
    function updateSendButtonState() {
        if (acceptTermsCheckbox.checked && firmarBtn.disabled && areAllPhotosTaken()) {
            enviarSolicitudBtn.disabled = false;
            enviarSolicitudBtn.style.backgroundColor = '#881F1E';
            enviarSolicitudBtn.style.cursor = 'pointer';
        } else {
            enviarSolicitudBtn.disabled = true;
            enviarSolicitudBtn.style.backgroundColor = '#555555';
            enviarSolicitudBtn.style.cursor = 'not-allowed';
        }
    }

    // Modify the firmarBtn click event to also trigger photo check
    firmarBtn.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission
        if (!firmarBtn.disabled) { // Only proceed if the button is enabled
            firmarBtn.disabled = true; // Disable "Firmar" after click
            firmarBtn.style.backgroundColor = '#555555'; // Visually indicate disabled/clicked state
            firmarBtn.style.cursor = 'not-allowed';
            updateSendButtonState(); // Check if all conditions are met to enable "Enviar Solicitud"
        }
    });

    // Add event listener for the "Enviar Solicitud" button (optional, for future API integration)
    enviarSolicitudBtn.addEventListener('click', function (event) {
        if (!enviarSolicitudBtn.disabled) {
            // Here you would implement the logic to send data, including photos, to your API
            alert('¡Solicitud enviada (simulado)! Las fotos y datos están listos para ser procesados.');
            // For now, it just alerts. You'll replace this with your API call.
        }
    });

    // Set the initial states when the page loads
    updatePolizaAndPlacaStates();
    updateButtonStates(); // Set initial state for the final buttons
    moduloRespuestaSelect.innerHTML = '<option value="">Escribe</option>';




    // Function to update the state of the poliza and placa inputs
    function updatePolizaAndPlacaStates() {
        if (polizaCheckbox.checked) {
            polizaInput.disabled = true;
            polizaInput.value = ''; // Clear value when disabled
            polizaInput.placeholder = 'No aplica';
            placaInput.disabled = true; // Disable placa when poliza checkbox is checked
            placaInput.value = ''; // Clear value when disabled
            placaInput.placeholder = 'No aplica';
        } else {
            polizaInput.disabled = false;
            polizaInput.placeholder = 'N° de póliza';
            placaInput.disabled = false; // Enable placa
            placaInput.placeholder = 'N° de placa';
        }
    }

    // Function to handle "Nivel de atención" checkboxes
    function handleNivelAtencionCheckbox(event) {
        // Deselect all other checkboxes in the group
        nivelAtencionCheckboxes.forEach(checkbox => {
            if (checkbox !== event.target) {
                checkbox.checked = false;
            }
        });

        // Update "Modulo al que da respuesta la practica" dropdown based on selected "Nivel de atención"
        const selectedNivel = event.target.value;
        moduloRespuestaSelect.innerHTML = '<option value="">Escribe</option>'; // Clear existing options

        switch (selectedNivel) {
            case '1er_anio':
                addOptions(moduloRespuestaSelect, ['Seguridad e Higiene Ocupacional', 'Mantenimiento Preventivo y Correctivo de Motores', 'Sistema de Suspensión y Dirección', 'Sistema de Frenos', 'Sistema Eléctrico Automotriz']);
                break;
            case '2do_anio':
                addOptions(moduloRespuestaSelect, ['Diagnóstico y Reparación de Sistemas de Inyección', 'Transmisiones Automáticas y Mecánicas', 'Mantenimiento de Sistemas de Climatización', 'Electrónica Automotriz Avanzada']);
                break;
            case '3er_anio':
                addOptions(moduloRespuestaSelect, ['Gestión de Taller y Servicio al Cliente', 'Mantenimiento de Vehículos Híbridos y Eléctricos', 'Sistemas de Confort y Seguridad', 'Mecatrónica Automotriz']);
                break;
            default:
                // No options or a default message
                break;
        }
    }

    // Helper function to add options to a select element
    function addOptions(selectElement, options) {
        options.forEach(optionText => {
            const option = document.createElement('option');
            option.value = optionText;
            option.textContent = optionText;
            selectElement.appendChild(option);
        });
    }

    // Function to update button states based on checkbox
    function updateButtonStates() {
        firmarBtn.disabled = !acceptTermsCheckbox.checked;
        enviarSolicitudBtn.disabled = true; // Always disabled until "Firmar" is clicked
        firmarBtn.style.backgroundColor = acceptTermsCheckbox.checked ? '#881F1E' : '#555555';
        firmarBtn.style.cursor = acceptTermsCheckbox.checked ? 'pointer' : 'not-allowed';
        enviarSolicitudBtn.style.backgroundColor = '#555555'; // Keep grey
        enviarSolicitudBtn.style.cursor = 'not-allowed';
    }

    // Event listener for the "Firmar" button click
    firmarBtn.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission
        if (!firmarBtn.disabled) { // Only proceed if the button is enabled
            firmarBtn.disabled = true; // Disable "Firmar" after click
            firmarBtn.style.backgroundColor = '#555555'; // Visually indicate disabled/clicked state
            firmarBtn.style.cursor = 'not-allowed';
            enviarSolicitudBtn.disabled = false; // Enable "Enviar Solicitud"
            enviarSolicitudBtn.style.backgroundColor = '#881F1E';
            enviarSolicitudBtn.style.cursor = 'pointer';
        }
    });

    // Add event listeners
    polizaCheckbox.addEventListener('change', updatePolizaAndPlacaStates);
    nivelAtencionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleNivelAtencionCheckbox);
    });
    acceptTermsCheckbox.addEventListener('change', updateButtonStates);

    // Set the initial states when the page loads
    updatePolizaAndPlacaStates();
    updateButtonStates(); // Set initial state for the final buttons

    // Initially clear and populate modules based on no selection (or a default if you want one)
    moduloRespuestaSelect.innerHTML = '<option value="">Escribe</option>';
});