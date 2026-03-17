
const fmt = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 });

// Parse car data from carsData array
const inventory = carsData.map(car => {
    const nameMatch = car.car_name.match(/^(\d{4})\s+(.+?)\s+(.+)$/);
    const priceMatch = car.whatsapp_message.match(/₦([\d,]+)/);
    
    const year = nameMatch ? parseInt(nameMatch[1]) : 2010;
    const brand = nameMatch ? nameMatch[2] : "Toyota";
    const model = nameMatch ? nameMatch[3] : "Car";
    const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0;
    
    return {
        id: car.id,
        year,
        brand,
        model,
        price,
        condition: year >= 2015 ? "Tokunbo" : "Nigerian Used",
        image: car.car_link_image
    };
});

function show(cars) {
    const grid = document.getElementById('carGrid');
    grid.innerHTML = cars.length === 0 ? `<div style="grid-column: 1/-1; text-align: center; padding: 50px;"><h3>No cars found</h3></div>` : '';
    cars.forEach(car => {
        const card = document.createElement('div');
        card.className = 'car-card';
        card.innerHTML = `
            <div class="car-img-box"><span class="condition-tag">${car.condition}</span><img src="${car.image}" alt="${car.brand} ${car.model}" loading="lazy"></div>
            <div class="car-details"><h3>${car.year} ${car.brand} ${car.model}</h3>
            <div class="car-meta"><span>Automatic</span><span>Kano Stock</span></div>
            <span class="car-price">${fmt.format(car.price)}</span>
            <div class="card-actions">
                <a href="https://wa.me/2348000000000?text=Hello, I saw the ${car.year} ${car.brand} ${car.model} for ${fmt.format(car.price)} on your website. Is it still available?" target="_blank" class="wa-btn">WhatsApp Us</a>
                <a href="#" class="details-btn" data-id="${car.id}">View Details</a></div></div>`;
        grid.appendChild(card);
    });
    document.getElementById('carCounter').innerText = `Showing ${cars.length} Cars in Kano`;
}

function filter() {
    const term = document.getElementById('carSearch').value.toLowerCase();
    const brand = document.getElementById('brandFilter').value;
    show(inventory.filter(car => `${car.brand} ${car.model} ${car.year}`.toLowerCase().includes(term) && (brand === "all" || car.brand === brand)));
}

document.addEventListener('DOMContentLoaded', () => {
    show(inventory);
    document.getElementById('carSearch').addEventListener('input', filter);
    document.getElementById('brandFilter').addEventListener('change', filter);
    
    const modal = document.getElementById('detailsModal');
    document.getElementById('carGrid').addEventListener('click', e => {
        const btn = e.target.closest('.details-btn');
        if (btn) {
            const car = inventory.find(c => c.id === parseInt(btn.dataset.id));
            if (car) {
                document.getElementById('modalTitle').innerText = `${car.year} ${car.brand} ${car.model}`;
                document.getElementById('modalMeta').innerText = `Stock • Automatic • ${car.year}`;
                document.getElementById('modalPrice').innerText = fmt.format(car.price);
                document.getElementById('modalCondition').innerText = car.condition;
                modal.querySelector('.modal-image img').src = car.image;
                document.getElementById('modalWhatsapp').href = `https://wa.me/2348000000000?text=Hi, I'm interested in the ${car.year} ${car.brand} ${car.model} listed on your site.`;
                modal.classList.add('open');
            }
            e.preventDefault();
        }
    });
    
    modal.addEventListener('click', e => {
        if (e.target.classList.contains('details-modal-backdrop') || e.target.classList.contains('modal-close')) modal.classList.remove('open');
    });
    
    document.addEventListener('keydown', e => e.key === 'Escape' && modal.classList.remove('open'));
    document.querySelector('.nav-toggle')?.addEventListener('click', () => document.querySelector('.nav-links').classList.toggle('open'));
});