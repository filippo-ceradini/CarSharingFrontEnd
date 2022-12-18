function openForm(formId) {
    // Hide all forms
    var forms = document.getElementsByTagName("form");
    for (var i = 0; i < forms.length; i++) {
        forms[i].style.display = "none";
    }
    // Show the selected form
    document.getElementById(formId).style.display = "block";
}