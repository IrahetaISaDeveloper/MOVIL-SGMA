document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const placa = urlParams.get("placa");

  const recordNumberSpan = document.getElementById("recordNumber");
  const infoModeloSpan = document.getElementById("infoModelo");
  const adjustmentStatusP = document.getElementById("adjustmentStatus"); // Changed from .adjustment-status
  const infoPlacaSpan = document.getElementById("infoPlaca");
  const assignedStudentSpan = document.getElementById("assignedStudent");
  const assignedModuleSpan = document.getElementById("assignedModule");
  const contactNameSpan = document.getElementById("contactName");
  const progressBarDiv = document.getElementById("progressBar");
  const progressPercentageSpan = document.getElementById("progressPercentage");
  const remainingTimeSpan = document.getElementById("remainingTime");
  const totalTimeSpan = document.getElementById("totalTime");
  const vehicleImage = document.getElementById("vehicleImage"); // Added vehicle image element
  const repairTasksGrid = document.getElementById("repairTasksGrid"); // Get the grid to clear/populate
  const updatesList = document.getElementById("updatesList"); // Get updates list

  // Function to populate data
  const populateVehicleData = (data) => {
    recordNumberSpan.textContent = data.recordNumber || "N/A";
    infoModeloSpan.textContent = data.modelo || "Vehículo Desconocido";
    adjustmentStatusP.textContent = data.status || "Sin Información";
    infoPlacaSpan.textContent = data.placa || "Placa no especificada";
    assignedStudentSpan.textContent = data.assignedStudent || "N/A";
    assignedModuleSpan.textContent = data.assignedModule || "N/A";
    contactNameSpan.textContent = data.contactName || "N/A";

    progressBarDiv.style.width = data.progressPercentage + "%";
    progressPercentageSpan.textContent = data.progressPercentage + "%";
    remainingTimeSpan.textContent = data.remainingTime || "N/A";
    totalTimeSpan.textContent = data.totalTime || "N/A";

    if (data.vehicleImage) {
      vehicleImage.src = data.vehicleImage;
    } else {
      vehicleImage.src = "imgs/default_vehicle.jpg"; // Provide a default image
    }

    // Populate repair tasks dynamically (if you had this from backend)
    // For now, these are hardcoded in HTML, so we just clear/add if necessary
    if (data.tasks && data.tasks.length > 0) {
      repairTasksGrid.innerHTML = ""; // Clear existing hardcoded tasks
      data.tasks.forEach(task => {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";
        taskItem.innerHTML = `<i class="${task.icon}"></i><span>${task.text}</span>`;
        repairTasksGrid.appendChild(taskItem);
      });
    } else if (placa) { // Only show message if a placa was provided but no tasks found
        repairTasksGrid.innerHTML = `<div class="task-item"><i class="fas fa-info-circle"></i><span>No se encontraron tareas de reparación.</span></div>`;
    }

    // Populate updates dynamically
    if (data.updates && data.updates.length > 0) {
      updatesList.innerHTML = ""; // Clear existing updates
      data.updates.forEach(update => {
        const li = document.createElement("li");
        li.textContent = update;
        updatesList.appendChild(li);
      });
    } else if (placa) { // Only show message if a placa was provided but no updates found
        updatesList.innerHTML = `<li class="no-results">No se encontraron actualizaciones para este vehículo.</li>`;
    }
  };

  // Dummy data based on placa for demonstration
  const getVehicleDataByPlaca = (placa) => {
    switch (placa.toUpperCase()) {
      case "ABC-123":
        return {
          recordNumber: "20250428",
          modelo: "Volvo - XC40",
          status: "Ajustes eléctricos completo",
          placa: "P258-854",
          assignedStudent: "Manuel Perez",
          assignedModule: "Sistemas Eléctricos",
          contactName: "José E.",
          progressPercentage: 85,
          remainingTime: "30 min restantes",
          totalTime: "6h totales",
          vehicleImage: "imgs/volvo.jpg", // Ensure this path is correct
          tasks: [
            { icon: "fas fa-lightbulb", text: "Conexión y reparación de luces" },
            { icon: "fas fa-window-restore", text: "Reparación de puertas y ventanas" },
            { icon: "fas fa-wind", text: "Reparación de Parabrisas" },
            { icon: "fas fa-car-crash", text: "Cambio de Airbag" },
            { icon: "fas fa-eye", text: "Reparación de espejo" },
          ],
          updates: [
            "2025-06-10: Revisión inicial completada.",
            "2025-06-11: Componentes eléctricos diagnosticados.",
            "2025-06-12: Inicio de ajustes eléctricos.",
            "2025-06-13: Pruebas finales de sistemas eléctricos.",
            "2025-06-14: Ajustes eléctricos completados. Próximo: Inspección general."
          ]
        };
      case "ABC-122":
        return {
          recordNumber: "20231026",
          modelo: "Sedán Genérico",
          status: "En reparación - Motor",
          placa: "ABC-123",
          assignedStudent: "Ana López",
          assignedModule: "Mecánica General",
          contactName: "Carlos R.",
          progressPercentage: 50,
          remainingTime: "12h restantes",
          totalTime: "24h totales",
          vehicleImage: "imgs/volvo.jpg", // Add a default image for this
          tasks: [
            { icon: "fas fa-gears", text: "Revisión de motor" },
            { icon: "fas fa-oil-can", text: "Cambio de aceite" },
            { icon: "fas fa-cogs", text: "Ajuste de transmisión" },
          ],
          updates: [
            "2023-10-26: Recepción del vehículo para diagnóstico.",
            "2023-10-27: Diagnóstico completado. Problema en el motor detectado.",
            "2023-10-28: Inicio de la reparación del motor.",
            "2023-10-30: 50% de la reparación del motor completada."
          ]
        };
      default:
        return null; // No data found for this placa
    }
  };

  if (placa) {
    const vehicleData = getVehicleDataByPlaca(placa);
    if (vehicleData) {
      populateVehicleData(vehicleData);
    } else {
      // If placa is provided but no data matches
      populateVehicleData({
        recordNumber: "N/A",
        modelo: "Vehículo no encontrado",
        status: "Placa no registrada en el sistema",
        placa: placa,
        assignedStudent: "N/A",
        assignedModule: "N/A",
        contactName: "N/A",
        progressPercentage: 0,
        remainingTime: "N/A",
        totalTime: "N/A",
        updates: ["No se encontraron resultados para la placa: " + placa],
        tasks: [],
      });
    }
  } else {
    // If no placa is provided in the URL
    populateVehicleData({
      recordNumber: "N/A",
      modelo: "Por favor, ingresa una placa",
      status: "Esperando búsqueda...",
      placa: "N/A",
      assignedStudent: "N/A",
      assignedModule: "N/A",
      contactName: "N/A",
      progressPercentage: 0,
      remainingTime: "N/A",
      totalTime: "N/A",
      updates: ["Ingresa una placa para ver el seguimiento del vehículo."],
      tasks: [],
    });
  }

  // Example for contact button - in a real app, this might open a chat or call
  const contactButton = document.querySelector(".contact-button");
  if (contactButton) {
    contactButton.addEventListener("click", function(e) {
      e.preventDefault();
      alert("Contactar a " + contactNameSpan.textContent);
      // In a real app, you might use:
      // window.location.href = `tel:${phoneNumber}`;
      // window.location.href = `mailto:${emailAddress}`;
    });
  }
});