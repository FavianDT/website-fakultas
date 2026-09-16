const guideButtons = document.querySelectorAll(".hero-content button");
const menuSection = document.querySelector(".menu-section");
const topButton = document.querySelector(".top-button");
const whatsappButton = document.querySelector(".wa-button");
const logoutControls = document.querySelectorAll(".theme-toggle, .switch, .profile");
const notificationIcons = document.querySelectorAll(".notification-icon, .actions .icon");
const isAdminPage = /home-admin|kotak_masuk_admin/.test(window.location.pathname)
    || new URLSearchParams(window.location.search).get("admin") === "1";

for (const button of guideButtons) {
    button.addEventListener("click", function () {
        menuSection?.scrollIntoView({ behavior: "smooth" });
    });
}

topButton?.addEventListener("click", function (event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
});

if (whatsappButton) {
    whatsappButton.href = "https://wa.me/6281234566777";
    whatsappButton.target = "_blank";
    whatsappButton.rel = "noopener noreferrer";
}

for (const control of logoutControls) {
    control.setAttribute("role", "button");
    control.setAttribute("tabindex", "0");
    control.setAttribute("aria-label", "Keluar");
    control.addEventListener("click", function () {
        window.location.href = "index.html";
    });
    control.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            control.click();
        }
    });
}

for (const notification of notificationIcons) {
    notification.setAttribute("aria-label", isAdminPage ? "Buka permohonan masuk" : "Notifikasi");
    if (isAdminPage) {
        notification.setAttribute("role", "button");
        notification.setAttribute("tabindex", "0");
        notification.addEventListener("click", function () {
            window.location.href = "kotak_masuk_admin.html";
        });
    } else {
        notification.setAttribute("aria-disabled", "true");
    }
}

for (const button of document.querySelectorAll(".slide-btn")) {
    button.setAttribute("aria-label", button.classList.contains("left") ? "Slide sebelumnya" : "Slide berikutnya");
}
