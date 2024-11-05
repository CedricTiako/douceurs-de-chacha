let currentPage = 1;               // Page actuelle
const productsPerPage = 6;         // Nombre de produits par page
let products = [];                 // Tableau de produits

// Charger les produits depuis un fichier JSON
async function loadProducts() {
    const response = await fetch('products.json');
    products = await response.json();
    displayProducts();
    setupPagination();
    displayStats();
}

// Afficher les produits en fonction de la pagination bg-pink-500
function displayProducts() {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = ''; // Réinitialise le conteneur des produits

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToDisplay = products.slice(startIndex, endIndex);

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'bg-white rounded-lg shadow-md p-6 text-center transition-transform transform hover:scale-105';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-lg mb-4">
            <h2 class="text-xl md:text-2xl font-semibold">${product.name}</h2>
            <p class="mt-2 text-gray-700">${product.price}</p>
            <p class="mt-2 text-gray-600">${product.description}</p>
            <button onclick="orderProduct('${product.whatsappMessage}', '${product.image}')" class="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Commander sur WhatsApp
            </button>
        `;
        productsContainer.appendChild(productCard);
    });
}

// Configurer la pagination pour les produits
function setupPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Réinitialise le conteneur de pagination

    const totalPages = Math.ceil(products.length / productsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.className = `mx-1 px-3 py-1 rounded ${i === currentPage ? 'bg-pink-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`;
        pageButton.onclick = () => {
            currentPage = i;
            displayProducts();
            setupPagination();
        };
        paginationContainer.appendChild(pageButton);
    }
}

// Afficher les statistiques fictives
function displayStats() {
    const visitCount = 5423;
    const orderCount = 1274;
    const engagementRate = ((orderCount / visitCount) * 100).toFixed(2);

    document.getElementById("visit-count").innerText = visitCount;
    document.getElementById("order-count").innerText = orderCount;
    document.getElementById("engagement-rate").innerText = `${engagementRate}%`;
}

// Slider pour le bloc de statistiques
document.addEventListener("DOMContentLoaded", () => {
    let currentSlide = 0;
    const slides = document.querySelectorAll("#stats-slider .slider-item");
    const totalSlides = slides.length;

    function updateSlider() {
        slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
        });
    }

    document.getElementById("nextBtn").addEventListener("click", () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    });

    document.getElementById("prevBtn").addEventListener("click", () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    });

    updateSlider();
});

// Fonction pour rediriger vers WhatsApp avec message et image
function orderProduct(message, image) {
    const phoneNumber = "237652257129"; // Remplacez par votre numéro de téléphone
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(`${message}\nVoir l'image : ${window.location.origin}/${image}`)}`;
    window.open(whatsappUrl, '_blank');
}

// Gestion du formulaire de contact
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const feedback = document.getElementById('feedback');
    feedback.innerText = `Merci ${name} ! Votre message a été envoyé.`;
    feedback.classList.remove('hidden');

    // Réinitialiser le formulaire après un délai
    setTimeout(() => {
        feedback.classList.add('hidden');
        this.reset();
    }, 3000);
});

// Charger les produits au démarrage
window.onload = loadProducts;
