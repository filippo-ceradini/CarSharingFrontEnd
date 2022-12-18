const tableBody = document.getElementById("members-table-body");
const localMembersApi = "http://localhost:8080/members"


document.addEventListener("DOMContentLoaded", () => {
    getMembers()
});

// Function that filters the table
$(document).ready(function () {
    $("#searchInput").keyup(function () {
        // Get the search term
        let searchTerm = $(this).val().toLowerCase();

        // Filter the table rows
        $("#membersTable tbody tr").filter(function () {
            // Hide rows that don't match the search term
            $(this).toggle($(this).text().toLowerCase().indexOf(searchTerm) > -1);
        });
    });
});

function displayMembersTable(members) {
    // Clear the table
    tableBody.innerHTML = "";

    // Loop through the list of members
    for (let i = 0; i < members.length; i++) {
        const member = members[i];

        // Create the table row
        const row = document.createElement("tr");

        // Create the table cells
        const idCell = document.createElement("td");
        idCell.innerHTML = member.id;
        row.appendChild(idCell);

        const firstNameCell = document.createElement("td");
        firstNameCell.innerHTML = member.firstName;
        row.appendChild(firstNameCell);

        const lastNameCell = document.createElement("td");
        lastNameCell.innerHTML = member.lastName;
        row.appendChild(lastNameCell);

        const streetCell = document.createElement("td");
        streetCell.innerHTML = member.street;
        row.appendChild(streetCell);

        const cityCell = document.createElement("td");
        cityCell.innerHTML = member.city;
        row.appendChild(cityCell);

        const zipCell = document.createElement("td");
        zipCell.innerHTML = member.zip;
        row.appendChild(zipCell);

        const ApprovedCell = document.createElement("td");
        if (member.approved) {
            ApprovedCell.innerHTML = "&#x2713;";
        } else {
            ApprovedCell.innerHTML = "";
        }
        row.appendChild(ApprovedCell);


        const RankingCell = document.createElement("td");
        RankingCell.innerHTML = member.ranking;
        row.appendChild(RankingCell);

        // Create the edit button
        const editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        editButton.classList.add("btn", "btn-primary", "btn-sm");
        editButton.addEventListener("click", () => {
            // console.log("edit")
            initMemberModal("edit", member);
            // Handle the edit button click event
            // (e.g., open a modal to edit the member)
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
                    "Are you sure you want to delete " + member.firstName + " " + member.lastName + "?"
                )
            ) {
                deleteRequest(member.id).then(()=>location.reload())
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
function createNewMember() {
    let newMember = {
        "firstName": "Insert First Name",
        "lastName": "Insert Last Name",
        "street": "Insert Street",
        "city": "Insert City",
        "zip": "Insert Zip Code",
        "approved": "Toggle if Approved",
        "ranking": "Insert Ranking",
    }
    initMemberModal("create", newMember)
}

// Initialize the modal
function initMemberModal(mode, member) {
    // Get the modal elements
    const modalTitle = $('#editMemberModalLabel');
    const editModalButton = $("#modal-edit-button");
    const createButton = $("#modal-create-button");
    createButton.hide();
    editModalButton.hide();

    // Set the modal title based on the mode
    if (mode === "create") {
        modalTitle.text("Create Member");
        createButton.show();
    } else if (mode === "edit") {
        modalTitle.text("Edit Member");
        editModalButton.show()
    }


    // If in edit mode, populate the form fields with the member's data
    if (mode === 'edit') {
        $("#id").val(member.id);
        $("#firstName").val(member.firstName);
        $("#lastName").val(member.lastName);
        $("#street").val(member.street);
        $("#city").val(member.city);
        $("#zip").val(member.zip);
        $("#approved").prop("checked", member.approved);
        $("#ranking").val(member.ranking);
    }

    if (mode === 'create') {
        $("#id").val("").attr('placeholder', member.id);
        $("#firstName").val("").attr('placeholder', member.firstName);
        $("#lastName").val("").attr('placeholder', member.lastName);
        $("#street").val("").attr('placeholder', member.street);
        $("#city").val("").attr('placeholder', member.city);
        $("#zip").val("").attr('placeholder', member.zip);
        $("#ranking").val("").attr('placeholder', member.ranking);
    }

    // Show the modal
    $('#editMemberModal').modal('show');
}



async function submitMember(text) {
    // Get the form data
    const id = $('#id').val();
    const firstName = $('#firstName').val();
    const lastName = $('#lastName').val();
    const street = $('#street').val();
    const city = $('#city').val();
    const zip = $('#zip').val();
    const approved = $('#approved').is(':checked');
    const ranking = $('#ranking').val();

    if (text === "Create") {
        if (confirm("Are you sure you want to create this member?")) {
            let newMember = {
                "firstName": firstName,
                "lastName": lastName,
                "street": street,
                "city": city,
                "zip": zip,
                "approved": approved,
                "ranking": ranking
            }
            await postRequest(newMember).then(() => location.reload())
        }
    } else if (confirm("Are you sure you want to edit this member?")) {
        let newMember = {
            "id": id,
            "firstName": firstName,
            "lastName": lastName,
            "street": street,
            "city": city,
            "zip": zip,
            "approved": approved,
            "ranking": ranking
        }
        await putRequest(newMember).then(() => location.reload())
    }

    // Close the modal
    $('#editMemberModal').modal('hide');
}

//REST Functions
function getMembers() {
    // Send a GET request to the API endpoint

    fetch(localMembersApi)
        .then(response => response.json()) // Parse the response as JSON
        .then(members => {
            // Do something with the list of cyclists
            console.log(members);
            displayMembersTable(members);
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });
}

async function postRequest(newMember) {
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: ""
    }
    console.log(newMember)
    fetchOptions.body = JSON.stringify(newMember);
    const response = await fetch(localMembersApi, fetchOptions);
    // Refresh table on reload
    if (response.ok) {
    }
    return response;
}

async function putRequest(updatedMemberObject) {
    const fetchOptions = {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: ""
    }
    fetchOptions.body = JSON.stringify(updatedMemberObject);
    const response = await fetch(localMembersApi, fetchOptions);
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
    const response = await fetch(localMembersApi + "/" + id, fetchOptions);
    // Refresh table on reload
    if (response.ok) {
    }
    return response;
}