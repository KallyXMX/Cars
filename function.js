const searchInput = document.getElementById("carSearch");
const brandFilter = document.getElementById("brandFilter");
const cars = document.querySelectorAll(".car-card");
const counter = document.getElementById("carCounter");

const modal = document.getElementById("detailsModal");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalMeta = document.getElementById("modalMeta");
const modalWhatsapp = document.getElementById("modalWhatsapp");
const modalImg = document.querySelector(".modal-image img");
const closeModal = document.querySelector(".modal-close");

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

function filterCars() {
    let searchValue = searchInput.value.toLowerCase();
    let brandValue = brandFilter.value.toLowerCase();
    let visibleCount = 0;

    cars.forEach(car => {
        let title = car.querySelector("h3").textContent.toLowerCase();

        let matchesSearch = title.includes(searchValue);
        let matchesBrand = brandValue === "all" || title.includes(brandValue);

        if (matchesSearch && matchesBrand) {
            car.style.display = "block";
            visibleCount++;
        } else {
            car.style.display = "none";
        }
    });

    counter.textContent = `Showing ${visibleCount} Cars in Kano`;
}

searchInput.addEventListener("input", filterCars);
brandFilter.addEventListener("change", filterCars);

document.querySelectorAll(".details-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();

        const card = btn.closest(".car-card");

        const title = card.querySelector("h3").textContent;
        const price = card.querySelector(".car-price").textContent;
        const meta = card.querySelector(".car-meta").textContent;
        const img = card.querySelector("img").src;

        modalTitle.textContent = title;
        modalPrice.textContent = price;
        modalMeta.textContent = meta;
        modalImg.src = img;

        modalWhatsapp.href = "https://wa.me/2348000000000";

        modal.classList.add("open");
    });
});

closeModal.addEventListener("click", () => {
    modal.classList.remove("open");
});

document.querySelector(".details-modal-backdrop").addEventListener("click", () => {
    modal.classList.remove("open");
});

navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
});