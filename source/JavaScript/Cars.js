const tableBody = document.getElementById("cars-table-body");
const localCarsApi = "http://localhost:8080/cars"


document.addEventListener("DOMContentLoaded", () => {
    getCars()
});

// Function that filters the table
$(document).ready(function () {
    $("#searchInput").keyup(function () {
        // Get the search term
        let searchTerm = $(this).val().toLowerCase();

        // Filter the table rows
        $("#cars-table-body tbody tr").filter(function () {
            // Hide rows that don't match the search term
            $(this).toggle($(this).text().toLowerCase().indexOf(searchTerm) > -1);
        });
    });
});

function displayCarsTable(cars) {
// Clear the table
    tableBody.innerHTML = "";
// Loop through the list of cars
    for (let i = 0; i < cars.length; i++) {
        const car = cars[i];

        // Create the table row
        const row = document.createElement("tr");

        // Create the table cells
        const idCell = document.createElement("td");
        idCell.innerHTML = car.id;
        row.appendChild(idCell);

        const brandCell = document.createElement("td");
        brandCell.innerHTML = car.brand;
        row.appendChild(brandCell);

        const modelCell = document.createElement("td");
        modelCell.innerHTML = car.model;
        row.appendChild(modelCell);

        const pricePerDayCell = document.createElement("td");
        pricePerDayCell.innerHTML = car.pricePerDay;
        row.appendChild(pricePerDayCell);

        const bestDiscountCell = document.createElement("td");
        bestDiscountCell.innerHTML = car.bestDiscount;
        row.appendChild(bestDiscountCell);

        // Create the edit button
        const editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        editButton.classList.add("btn", "btn-primary", "btn-sm");
        editButton.addEventListener("click", () => {
            // console.log("edit")
            initCarModal("edit", car);
            // Handle the edit button click event
            // (e.g., open a modal to edit the car)
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
                    "Are you sure you want to delete " + car.brand + " " + car.model + "?"
                )
            ) {
                deleteRequest(car.id).then(() => location.reload())
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
function createNewCar() {
    let newCar = {
        "brand": "Insert Brand",
        "model": "Insert Model",
        "pricePerDay": "Insert Price per Day",
        "bestDiscount": "Insert Best Discount",
    }
    initCarModal("create", newCar)
}

// Initialize the modal
function initCarModal(mode, car) {
    // Get the modal elements
    const modalTitle = $('#editCarModalLabel');
    const editModalButton = $("#modal-edit-button");
    const createButton = $("#modal-create-button");
    createButton.hide();
    editModalButton.hide();

    // Set the modal title based on the mode
    if (mode === "create") {
        modalTitle.text("Create Car");
        createButton.show();
    } else if (mode === "edit") {
        modalTitle.text("Edit Car");
        editModalButton.show()
    }

    // If in edit mode, populate the form fields with the car's data
    if (mode === 'edit') {
        $("#id").val(car.id);
        $("#brand").val(car.brand);
        $("#model").val(car.model);
        $("#pricePerDay").val(car.pricePerDay);
        $("#bestDiscount").val(car.bestDiscount);
    }

    if (mode === 'create') {
        $("#brand").val("").attr('placeholder', car.brand);
        $("#model").val("").attr('placeholder', car.model);
        $("#pricePerDay").val("").attr('placeholder', car.pricePerDay);
        $("#bestDiscount").val("").attr('placeholder', car.bestDiscount);
    }

    // Show the modal
    $('#edit-car-modal').modal('show');
}


async function submitCar(text) {
    // Get the form data
    const id = $('#id').val();
    const brand = $('#brand').val();
    const model = $('#model').val();
    const pricePerDay = $('#pricePerDay').val();
    const bestDiscount = $('#bestDiscount').val();

    if (text === "Create") {
        if (confirm("Are you sure you want to create this car?")) {
            let newCar = {
                "brand": brand,
                "model": model,
                "pricePerDay": pricePerDay,
                "bestDiscount": bestDiscount
            }
            await postRequest(newCar).then(() => location.reload())
        }
    } else if (confirm("Are you sure you want to edit this car?")) {
        let newCar = {
            "id": id,
            "brand": brand,
            "model": model,
            "pricePerDay": pricePerDay,
            "bestDiscount": bestDiscount
        }
        await putRequest(newCar).then(() => location.reload())
    }

    // Close the modal
    $('#editCarModal').modal('hide');
}

//REST Functions
function getCars() {
    // Send a GET request to the API endpoint

    fetch(localCarsApi)
        .then(response => response.json()) // Parse the response as JSON
        .then(members => {
            // Do something with the list of cyclists
            console.log(members);
            displayCarsTable(members);
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });
}

async function postRequest(newCar) {
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: ""
    }
    console.log(newCar)
    fetchOptions.body = JSON.stringify(newCar);
    const response = await fetch(localCarsApi, fetchOptions);
    // Refresh table on reload
    if (response.ok) {
    }
    return response;
}

async function putRequest(updatedCarObject) {
    const fetchOptions = {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: ""
    }
    fetchOptions.body = JSON.stringify(updatedCarObject);
    const response = await fetch(localCarsApi, fetchOptions);
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
    const response = await fetch(localCarsApi + "/" + id, fetchOptions);
    // Refresh table on reload
    if (response.ok) {
    }
    return response;
}