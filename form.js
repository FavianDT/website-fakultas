const applicationForm = document.getElementById("applicationForm");

applicationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!applicationForm.checkValidity()) {
        applicationForm.reportValidity();
        return;
    }

    const formData = Object.fromEntries(new FormData(applicationForm));
    const applications = JSON.parse(localStorage.getItem("applications") || "[]");

    applications.push({
        ...formData,
        status: "Menunggu",
        submittedAt: new Date().toISOString()
    });

    localStorage.setItem("applications", JSON.stringify(applications));
    alert("Permohonan berhasil dikirim.");
    applicationForm.reset();
});
