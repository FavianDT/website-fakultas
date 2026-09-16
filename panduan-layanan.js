const guideContent = document.getElementById("guideContent");
const guideEditor = document.getElementById("guideEditor");
const guideText = document.getElementById("guideText");
const guideStorageKey = "serviceGuide";
const isAdminMode = new URLSearchParams(window.location.search).get("admin") === "1";
const defaultGuide = `1. Masuk ke halaman login.
2. Masukkan username dan password, lalu pilih Sign In.
3. Pada halaman utama, pilih layanan yang ingin digunakan.
4. Isi seluruh data pada formulir pengajuan dengan lengkap dan benar.
5. Pilih SUBMIT FORM untuk mengirim permohonan.
6. Permohonan akan diproses oleh admin dan statusnya dapat dipantau melalui informasi dari fakultas.`;

function renderGuide(value) {
    guideContent.textContent = value.trim();
}

const savedGuide = localStorage.getItem(guideStorageKey) || defaultGuide;
renderGuide(savedGuide);

if (isAdminMode) {
    guideEditor.hidden = false;
    guideText.value = savedGuide;
}

guideEditor.addEventListener("submit", function (event) {
    event.preventDefault();
    const value = guideText.value.trim();
    if (!value) {
        guideText.focus();
        return;
    }

    localStorage.setItem(guideStorageKey, value);
    renderGuide(value);
    alert("Panduan layanan berhasil disimpan.");
});
