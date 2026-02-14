/* 
 * UNCOLONIZED SOCIETY - MAIN JS 
 * Phase 1 MVP
 */

// Product Data
const products = [
    {
        id: 1,
        name: "Rebel Hoodie",
        price: 65,
        category: "hoodies",
        image: "assets/images/hoodie-1.jpg",
        description: "Bold red lettering. 100% cotton. Pre-shrunk. Oversized fit.",
        featured: true
    },
    {
        id: 2,
        name: "Uncolonized Tee",
        price: 35,
        category: "tees",
        image: "assets/images/tshirt-1.jpg",
        description: "Chest print. Oversized fit. Limited run. 100% combed ring-spun cotton.",
        featured: true
    },
    {
        id: 3,
        name: "Black Flag Cap",
        price: 45,
        category: "accessories",
        image: "assets/images/cap-1.jpg",
        description: "Embroidered logo. Adjustable strap. Structured fit. One size.",
        featured: false
    },
    {
        id: 4,
        name: "Fearless Hoodie",
        price: 70,
        category: "hoodies",
        image: "assets/images/hoodie-2.jpg",
        description: "Back print. Heavyweight fleece. Drop shoulder. 400gsm.",
        featured: true
    },
    {
        id: 5,
        name: "Identity Tee",
        price: 32,
        category: "tees",
        image: "assets/images/tshirt-2.jpg",
        description: "Minimal front print. Soft-hand ink. Relaxed fit. Pre-shrunk.",
        featured: false
    },
    {
        id: 6,
        name: "Society Cargos",
        price: 85,
        category: "bottoms",
        image: "assets/images/cargo-1.jpg",
        description: "Drop-crotch. 4 pockets. Black hardware. Adjustable waist.",
        featured: true
    }
];

// Helper: Format Price
const formatPrice = (price) => `$${price.toFixed(2)}`;

// Helper: Get Image URL with fallback
// Using Unsplash placeholders if local assets are missing
const getImageUrl = (imgPath, category) => {
    // For this MVP, we will use Unsplash placeholders to ensure images load
    // In a real scenario, we'd check if the file exists or use the provided path
    // Mapping categories to Unsplash keywords

    /* 
       NOTE: In a production environment with real assets, we would just return imgPath.
       For this demo/MVP without local image files, I'm returning Unsplash URLs 
       that match the description.
    */

    // Uncomment this line to use local assets if they exist:
    // return imgPath; 

    // Fallback/Demo images
    if (imgPath.includes('hoodie')) return 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
    if (imgPath.includes('tshirt')) return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
    if (imgPath.includes('cap')) return 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
    if (imgPath.includes('cargo')) return 'https://images.unsplash.com/photo-1517445312882-b41fa34628ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';

    return 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
};

// Required Functions

function loadFeaturedProducts() {
    const container = document.querySelector('#featured-products');
    if (!container) return;

    const featured = products.filter(p => p.featured).slice(0, 4);

    container.innerHTML = featured.map(product => `
        <div class="product-card">
            <a href="product.html?id=${product.id}">
                <img src="${getImageUrl(product.image, product.category)}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <span class="product-price">${formatPrice(product.price)}</span>
                </div>
            </a>
        </div>
    `).join('');
}

function loadAllProducts() {
    const container = document.querySelector('#all-products');
    if (!container) return;

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <a href="product.html?id=${product.id}">
                <img src="${getImageUrl(product.image, product.category)}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <span class="product-price">${formatPrice(product.price)}</span>
                </div>
                <div class="btn-view">VIEW DETAILS</div>
            </a>
        </div>
    `).join('');
}

function loadProductDetails() {
    const container = document.querySelector('#product-details');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));

    // Find product or default to ID 1
    const product = products.find(p => p.id === id) || products.find(p => p.id === 1);

    // Update Page Title
    document.title = `${product.name} | Uncolonized Society`;

    // Populate DOM
    document.querySelector('#p-image').src = getImageUrl(product.image, product.category);
    document.querySelector('#p-image').alt = product.name;
    document.querySelector('#p-name').textContent = product.name;
    document.querySelector('#p-price').textContent = formatPrice(product.price);
    document.querySelector('#p-description').textContent = product.description;

    // Setup Order Button
    const orderBtn = document.querySelector('#order-btn');
    if (orderBtn) {
        orderBtn.href = `https://instagram.com/direct/t/UNcolonizedSociety`;
        // Optional: Pre-fill message draft if supported or just direct to DM
    }
}

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            hamburger.textContent = navLinks.classList.contains('nav-active') ? '✕' : '☰';
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                hamburger.textContent = '☰';
            });
        });
    }
}

// Init
function init() {
    setupMobileMenu();

    // Page detection
    if (document.querySelector('#featured-products')) {
        loadFeaturedProducts();
    }

    if (document.querySelector('#all-products')) {
        loadAllProducts();
    }

    if (document.querySelector('#product-details')) {
        loadProductDetails();
    }

    // Contact form shim (frontend only)
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Message simulated. In Phase 2 this will connect to a backend.');
            contactForm.reset();
        });
    }
}

// Event Listener
document.addEventListener('DOMContentLoaded', init);
