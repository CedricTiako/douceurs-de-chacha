// Variables globales pour la recherche, filtrage et produits
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const productsContainer = document.getElementById('products-container');
const pagination = document.getElementById('pagination');
const reviewsContainer = document.getElementById('reviews-container');
const orderPopup = document.getElementById('order-popup');
const closePopupButton = document.getElementById('close-popup');
const reviewForm = document.getElementById('review-form');

// Variable globale pour stocker les produits
let allProducts = [];

// Charger les produits depuis le fichier JSON
async function loadProducts() {
    const response = await fetch('products.json');
    allProducts = await response.json();
    displayProducts(allProducts);
}

// Calcul de la note moyenne d'un produit
function calculateAverageRating(ratings) {
    const total = ratings.reduce((acc, rating) => acc + rating, 0);
    return (total / ratings.length).toFixed(1);
}

// Fonction pour afficher les produits dans le DOM
function displayProducts(products) {
    productsContainer.innerHTML = ''; // Clear current products
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToDisplay = products.slice(startIndex, endIndex);

    productsToDisplay.forEach(product => {
        const averageRating = calculateAverageRating(product.ratings);
        const starsHTML = generateStars(averageRating); // Générer les étoiles
        const productHTML = `
            <div class="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-lg mb-4">
                <h3 class="text-xl font-bold text-center">${product.name}</h3>
                <p class="text-gray-700 text-center">${product.description}</p>
                <p class="font-semibold text-center">Prix: ${product.price}</p>
                <p class="text-yellow-500 text-center">${starsHTML} (${averageRating} / 5)</p> <!-- Affichage des étoiles et de la note -->
                <button class="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 mt-4" onclick="redirectToWhatsApp('${product.whatsappMessage}')">Commander via WhatsApp</button>
            </div>
        `;
        productsContainer.innerHTML += productHTML;
    });

    updatePagination(products.length);
}

// Pagination - Nombre de produits par page
const productsPerPage = 3;
let currentPage = 1;

// Mise à jour de la pagination
function updatePagination(filteredProductsCount) {
    const totalPages = Math.ceil(filteredProductsCount / productsPerPage);
    pagination.innerHTML = ''; // Clear current pagination

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.classList.add('px-4', 'py-2', 'mx-2', 'bg-pink-200', 'text-white', 'rounded', 'hover:bg-pink-300');
        pageButton.className = `mx-1 px-3 py-1 rounded ${i === currentPage ? 'bg-pink-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`;
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            loadProducts();
        });
        pagination.appendChild(pageButton);
    }
}

// Fonction pour rediriger vers WhatsApp pour commander
function redirectToWhatsApp(message) {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/237652257129?text=${encodedMessage}`; // Remplacez par votre numéro WhatsApp
    window.open(whatsappUrl, '_blank');
}

// Fonction d'autocomplétion pour la recherche
function autocompleteSearch(query) {
    return allProducts.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
}

// Fonction pour gérer la recherche et la mise à jour des résultats
function searchProducts() {
    const query = searchInput.value.trim();
    if (query === '') {
        displayProducts(allProducts);
    } else {
        const filteredProducts = autocompleteSearch(query);
        displayProducts(filteredProducts);
    }
}

// Recherche et filtrage de produits
searchInput.addEventListener('input', function() {
    searchProducts();
});

categoryFilter.addEventListener('change', function() {
    loadProducts();
});

// Avis des clients
const reviews = [
    { name: 'Alice', message: 'Excellents produits, je recommande !' },
    { name: 'Bob', message: 'Très bon service et délicieux gâteaux.' }
];

function displayReviews() {
    reviewsContainer.innerHTML = ''; // Clear current reviews
    reviews.forEach(review => {
        const reviewHTML = `
            <div class="bg-gray-100 p-4 mb-4 rounded-lg">
                <p class="font-semibold">${review.name}</p>
                <p>${review.message}</p>
            </div>
        `;
        reviewsContainer.innerHTML += reviewHTML;
    });
}

displayReviews();

reviewForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('review-name').value;
    const message = document.getElementById('review-message').value;
    reviews.push({ name, message });
    displayReviews();
    reviewForm.reset();
});

// Pop-up de confirmation de commande
closePopupButton.addEventListener('click', function() {
    orderPopup.classList.add('hidden');
});

// Ouvrir le pop-up de confirmation après une commande
function openOrderPopup() {
    orderPopup.classList.remove('hidden');
}

// Fonction pour générer les étoiles en fonction de la note moyenne
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating); // Nombre d'étoiles pleines
    const halfStar = rating % 1 >= 0.5; // Si la note est >= 0.5, ajoute une demi-étoile

    // Ajouter les étoiles pleines
    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="text-yellow-500">&#9733;</span>'; // Étoile pleine
    }

    // Ajouter la demi-étoile si nécessaire
    if (halfStar) {
        stars += '<span class="text-yellow-500">&#9733;</span>'; // Demi-étoile
    }

    // Ajouter les étoiles vides pour compléter jusqu'à 5
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<span class="text-gray-300">&#9733;</span>'; // Étoile vide
    }

    return stars;
}

// Charger les produits au démarrage
loadProducts();
