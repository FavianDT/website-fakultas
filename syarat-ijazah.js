const requirementsContent = document.getElementById("requirementsContent");
const requirementsEditor = document.getElementById("requirementsEditor");
const requirementsText = document.getElementById("requirementsText");
const requirementsStorageKey = "ijazahRequirements";
const isAdminMode = new URLSearchParams(window.location.search).get("admin") === "1";

function renderRequirements(value) {
    requirementsContent.textContent = value.trim() || "Belum ada informasi syarat yang tersedia.";
    requirementsContent.classList.toggle("has-content", Boolean(value.trim()));
}

const savedRequirements = localStorage.getItem(requirementsStorageKey) || "";
renderRequirements(savedRequirements);

if (isAdminMode) {
    requirementsEditor.hidden = false;
    requirementsText.value = savedRequirements;
}

requirementsEditor.addEventListener("submit", function (event) {
    event.preventDefault();
    const value = requirementsText.value.trim();
    localStorage.setItem(requirementsStorageKey, value);
    renderRequirements(value);
    alert("Syarat pengajuan berhasil disimpan.");
});
