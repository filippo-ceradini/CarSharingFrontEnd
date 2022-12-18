const tableBody = document.getElementById("reservation-table-body");
const localReservationsApi = "http://localhost:8080/reservations"
const localCarsApi = "http://localhost:8080/cars"
const localMembersApi = "http://localhost:8080/members"
let membersArray = []
let carsArray = []

document.addEventListener("DOMContentLoaded", () => {
    getReservations()
    getCars()
    getMembers()
});

// Function that filters the table
$(document).ready(function () {
    $("#searchInput").keyup(function () {
        // Get the search term
        let searchTerm = $(this).val().toLowerCase();

        // Filter the table rows
        $("#reservation-table-body tbody tr").filter(function () {
            // Hide rows that don't match the search term
            $(this).toggle($(this).text().toLowerCase().indexOf(searchTerm) > -1);
        });
    });
});

function displayReservationsTable(reservations) {
    // Clear the table
    tableBody.innerHTML = "";

    // Loop through the list of reservations
    for (let i = 0; i < reservations.length; i++) {
        const reservation = reservations[i];

        // Create the table row
        const row = document.createElement("tr");

        // Create the table cells
        const idCell = document.createElement("td");
        idCell.innerHTML = reservation.id;
        row.appendChild(idCell);

        const reservationDateCell = document.createElement("td");
        reservationDateCell.innerHTML = reservation.reservationDate;
        row.appendChild(reservationDateCell);

        const rentalDateCell = document.createElement("td");
        rentalDateCell.innerHTML = reservation.rentalDate;
        row.appendChild(rentalDateCell);

        const carCell = document.createElement("td");
        carCell.innerHTML = reservation.car.brand + " " + reservation.car.model;
        row.appendChild(carCell);

        const memberCell = document.createElement("td");
        memberCell.innerHTML = reservation.member.firstName + " " + reservation.member.lastName;
        row.appendChild(memberCell);

        // Create the edit button
        const editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        editButton.classList.add("btn", "btn-primary", "btn-sm");
        editButton.addEventListener("click", () => {
            // console.log("edit")
            initReservationModal("edit", reservation);
            // Handle the edit button click event
            // (e.g., open a modal to edit the reservation)
        });
        const editButtonCell = document.createElement("td");
        editButtonCell.appendChild(editButton);
        row.appendChild(editButtonCell);

        // Create the delete button
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        deleteButton.classList.add("btn", "btn-danger", "btn-sm");
        deleteButton.addEventListener("click", () => {
            if (
                confirm(
                    "Are you sure you want to delete this reservation?"
                )
            ) {
                deleteRequest(reservation.id).then(() => location.reload())
            }
            // Handle the delete button click event
            // (e.g., send a DELETE request to the server)
        });
        const deleteButtonCell = document.createElement("td");
        deleteButtonCell.appendChild(deleteButton);
        row.appendChild(deleteButtonCell);
        tableBody.appendChild(row);
    }
}


// Handle the submit button click


// When the user clicks the create Button, open the modal
function createNewReservation() {
    let today = new Date()
    let newReservation = {
        "reservationDate": today.toISOString().substring(10, 0),
        "rentalDate": today.toISOString().substring(10, 0)
    }
    initReservationModal("create", newReservation)
}

// Initialize the modal
function initReservationModal(mode, reservation) {
    // Get the modal elements
    const modalTitle = $('#editReservationModalLabel');
    const editModalButton = $("#modal-edit-button");
    const createButton = $("#modal-create-button");
    createButton.hide();
    editModalButton.hide();

    // Set the modal title based on the mode
    if (mode === "create") {
        modalTitle.text("Create Reservation");
        createButton.show();
    } else if (mode === "edit") {
        modalTitle.text("Edit Reservation");
        editModalButton.show()
    }

    // fillOptions(localCarsApi, "car-selector", "brand", "model")
    // fillOptions(localMembersApi, "member-selector","firstName", "lastName")

    // If in edit mode, populate the form fields with the reservation's data
    if (mode === 'edit') {
        $("#id").val(reservation.id);
        $("#reservationDate").val(reservation.reservationDate);
        $("#rentalDate").val(reservation.rentalDate);
        fillOptions(carsArray, "car-selector", "brand", "model")
        $("#car-selector").val(reservation.car.id);

        fillOptions(membersArray, "member-selector", "firstName", "lastName")
        $("#member-selector").val(reservation.member.id);


    }

    if (mode === 'create') {
        const carElement = document.getElementById("car-selector");
        const optionCarElement = document.createElement('option');
        optionCarElement.textContent = "Select a Car";
        carElement.appendChild(optionCarElement);
        const memberElement = document.getElementById("member-selector");
        const optionMemberElement = document.createElement('option');
        optionMemberElement.textContent = "Select a Member";
        memberElement.appendChild(optionMemberElement);
        fillOptions(carsArray, "car-selector", "brand", "model")
        fillOptions(membersArray, "member-selector", "firstName", "lastName")
        $("#reservationDate").val("").attr('placeholder', reservation.reservationDate);
        $("#rentalDate").val("").attr('placeholder', reservation.rentalDate);
    }

    // Show the modal
    $('#edit-reservation-modal').modal('show');
}


async function submitReservation(text) {
    // Get the form data

    const id = $('#id').val();
    const reservationDate = $("#reservationDate").val();
    const rentalDate = $("#rentalDate").val();
    const car = $("#car-selector").val();
    const member = $("#member-selector").val();

    if (text === "Create") {
        let newReservation = {
            "reservationDate": reservationDate,
            "rentalDate": rentalDate,
            "car": {
                "id": car,
            },
            "member": {
                "id": member,
            }
        }
        let isAvailable = await checkIfFree(newReservation);
        if (isAvailable === true) {
            if (confirm("Are you sure you want to create this reservation?")) {
                await postRequest(newReservation).then(() => location.reload())
            }
        } else{alert($("#car-selector option:selected").text() +" is not Free on " +newReservation.rentalDate)}
    }
    if (text === "edit") {
        let newReservation = {
            "id": id,
            "reservationDate": reservationDate,
            "rentalDate": rentalDate,
            "car": {
                "id": car,
            },
            "member": {
                "id": member,
            }
        }
        let isAvailableEdit = await checkIfFree(newReservation);
        if (isAvailableEdit === true) {
            if (confirm("Are you sure you want to edit this reservation?")) {
                await putRequest(newReservation).then(() => location.reload())
            }
        }else{alert($("#car-selector option:selected").text() +" is not Free on " +newReservation.rentalDate)}
    }

    // Close the modal
    $('#editReservationModal').modal('hide');
}

//REST Functions


function getReservations() {
    // Send a GET request to the API endpoint

    fetch(localReservationsApi)
        .then(response => response.json()) // Parse the response as JSON
        .then(reservations => {
            // Do something with the list of cyclists
            console.log(reservations);
            displayReservationsTable(reservations);
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });
}

function getCars() {
    // Send a GET request to the API endpoint

    fetch(localCarsApi)
        .then(response => response.json()) // Parse the response as JSON
        .then(cars => {
            // Do something with the list of cyclists
            carsArray = cars
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });
}

function getMembers() {
    // Send a GET request to the API endpoint

    fetch(localMembersApi)
        .then(response => response.json()) // Parse the response as JSON
        .then(members => {
            // Do something with the list of cyclists
            membersArray = members;
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });
}

async function postRequest(newReservation) {
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: ""
    }
    fetchOptions.body = JSON.stringify(newReservation);
    const response = await fetch(localReservationsApi, fetchOptions);
    // Refresh table on reload
    if (response.ok) {
    }
    return response;
}

async function putRequest(updatedReservationObject) {
    const fetchOptions = {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: ""
    }
    fetchOptions.body = JSON.stringify(updatedReservationObject);
    const response = await fetch(localReservationsApi, fetchOptions);
    // Refresh table on reload
    if (response.ok) {
    }
    return response;
}

async function deleteRequest(id) {
    const fetchOptions = {
        method: "DELETE",
        headers: {
            "Content-type": "application/json"
        },
        body: ""
    }
    const response = await fetch(localReservationsApi + "/" + id, fetchOptions);
    // Refresh table on reload
    if (response.ok) {
    }
    return response;
}

async function checkIfFree(newReservation) {
    try {
        const fetchOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: ""
        }
        fetchOptions.body = JSON.stringify(newReservation);
        const response = await fetch(localReservationsApi+"/free", fetchOptions);
        return await response.json();
    } catch (error) {
        console.error(error); // logs any errors that occurred during the request
        return false;
    }
}


function fillOptions(items, selectorId, attribute1, attribute2) {
    const selectElement = document.getElementById(selectorId);
    // Loop through the items and create an option element for each one
    items.forEach(item => {
        const optionElement = document.createElement('option');
        optionElement.value = item.id;
        optionElement.textContent = item[attribute1] + " " + item[attribute2];
        selectElement.appendChild(optionElement);
    })
}