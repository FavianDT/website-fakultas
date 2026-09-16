function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function addStoredApplications() {
    const applications = JSON.parse(localStorage.getItem("applications") || "[]");
    const list = document.querySelector(".list");

    applications.forEach(function (application, index) {
        const name = application.studentName || "Mahasiswa Baru";
        const initials = name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map(part => part[0].toUpperCase())
            .join("");
        const submittedAt = new Date(application.submittedAt);
        const date = submittedAt.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
        const time = submittedAt.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit"
        });
        const status = application.status === "Disetujui"
            ? { className: "approved", label: "Disetujui" }
            : application.status === "Ditolak"
                ? { className: "rejected", label: "Ditolak" }
                : { className: "waiting", label: "Menunggu" };
        const actions = status.className === "waiting"
            ? `
                <button class="btn view" type="button">Lihat Berkas</button>
                <button class="btn accept" type="button">Setujui</button>
                <button class="btn reject" type="button">Tolak</button>
            `
            : '<button class="btn detail" type="button">Lihat Detail</button>';

        list.insertAdjacentHTML("beforeend", `
            <article class="request ${status.className === "approved" ? "approved" : ""}" data-application-id="application-${index}">
                <div class="meta">
                    <div class="avatar">${escapeHtml(initials || "M")}</div>
                    <div class="info">
                        <h3>${escapeHtml(name)}</h3>
                        <div class="small">
                            ${escapeHtml(application.studentId)} · ${escapeHtml(application.studyProgram)} · Pengajuan Baru
                        </div>
                    </div>
                </div>
                <div class="details">
                    <div class="doc">
                        <div>
                            <strong>Permohonan</strong>
                            <div class="small">${escapeHtml(application.purpose)}</div>
                        </div>
                        <div class="small">
                            Tanggal Pengajuan<br />${date}, ${time}
                        </div>
                    </div>
                    <div class="actions-right">
                        <span class="badge ${status.className}">${status.label}</span>
                        <div class="btns">
                            ${actions}
                        </div>
                    </div>
                </div>
            </article>
        `);
    });
}

function persistStatus(request, status) {
    const applicationId = request.dataset.applicationId;
    if (!applicationId) return;

    const index = Number(applicationId.replace("application-", ""));
    const applications = JSON.parse(localStorage.getItem("applications") || "[]");
    if (applications[index]) {
        applications[index].status = status;
        localStorage.setItem("applications", JSON.stringify(applications));
    }
}

addStoredApplications();

const requests = [...document.querySelectorAll(".request")];
const tabs = [...document.querySelectorAll(".tab")];
const searchInput = document.querySelector('.search-filter input');
const filterButton = document.querySelector(".filter");
const paginationText = document.querySelector(".pagination");
const requestedStatus = new URLSearchParams(window.location.search).get("status");
let activeStatus = ["all", "waiting", "approved", "rejected"].includes(requestedStatus)
    ? requestedStatus
    : "all";

for (const tab of tabs) {
    tab.classList.toggle("active", tab.dataset.status === activeStatus);
}

function requestStatus(request) {
    const badge = request.querySelector(".badge");
    return badge.classList.contains("approved") ? "approved" : badge.classList.contains("rejected") ? "rejected" : "waiting";
}

function updateCounts() {
    const counts = { all: requests.length, waiting: 0, approved: 0, rejected: 0 };
    for (const request of requests) {
        counts[requestStatus(request)]++;
    }

    for (const tab of tabs) {
        const count = tab.querySelector(".count");
        if (count) {
            count.textContent = counts[tab.dataset.status];
        }
    }
}

function renderRequests() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    for (const request of requests) {
        const matchesStatus = activeStatus === "all" || requestStatus(request) === activeStatus;
        const matchesSearch = request.textContent.toLowerCase().includes(query);
        const visible = matchesStatus && matchesSearch;
        request.hidden = !visible;
        if (visible) visibleCount++;
    }

    paginationText.childNodes[0].textContent = `Menampilkan ${visibleCount} Dari ${requests.length} Permohonan`;
}

for (const tab of tabs) {
    tab.addEventListener("click", function () {
        activeStatus = tab.dataset.status;
        for (const item of tabs) item.classList.toggle("active", item === tab);
        renderRequests();
    });
}

searchInput.addEventListener("input", renderRequests);
filterButton.addEventListener("click", function () {
    searchInput.focus();
});

document.querySelectorAll(".request").forEach(function (request) {
    request.querySelector(".accept")?.addEventListener("click", function () {
        const badge = request.querySelector(".badge");
        badge.textContent = "Disetujui";
        badge.className = "badge approved";
        request.classList.add("approved");
        request.querySelector(".btns").innerHTML = '<button class="btn detail" type="button">Lihat Detail</button>';
        persistStatus(request, "Disetujui");
        updateCounts();
        renderRequests();
    });

    request.querySelector(".reject")?.addEventListener("click", function () {
        const badge = request.querySelector(".badge");
        badge.textContent = "Ditolak";
        badge.className = "badge rejected";
        request.classList.remove("approved");
        request.querySelector(".btns").innerHTML = '<button class="btn detail" type="button">Lihat Detail</button>';
        persistStatus(request, "Ditolak");
        updateCounts();
        renderRequests();
    });

    request.querySelector(".view, .detail")?.addEventListener("click", function () {
        alert("Detail permohonan demo belum terhubung ke berkas backend.");
    });
});

for (const page of document.querySelectorAll(".p")) {
    page.addEventListener("click", function () {
        document.querySelectorAll(".p").forEach(item => item.classList.remove("active"));
        page.classList.add("active");
    });
}

updateCounts();
renderRequests();
