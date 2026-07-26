console.log("Script Loaded");
import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartCount = cart.length;

document.getElementById("cartLink").innerHTML = `Cart 🛒 (${cartCount})`;


// Wishlist
const wishlistButtons = document.querySelectorAll(".wishlist");

wishlistButtons.forEach(button => {
    button.addEventListener("click", () => {

        if (button.innerHTML.includes("🤍")) {
            button.innerHTML = "❤️ Wishlist";
        } else {
            button.innerHTML = "🤍 Wishlist";
        }

    });
});

// Search
const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("keyup", () => {

        const value = searchInput.value.toLowerCase();

        document.querySelectorAll(".product-card").forEach((card) => {

            const name = card.querySelector("h3").innerText.toLowerCase();

            if (name.includes(value)) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    });

}
const minus = document.getElementById("minus");
const plus = document.getElementById("plus");
const qty = document.getElementById("qty");

if (minus && plus && qty) {
    let count = 1;

    plus.addEventListener("click", () => {
        count++;
        qty.textContent = count;
    });

    minus.addEventListener("click", () => {
        if (count > 1) {
            count--;
            qty.textContent = count;
        }
    });
}

const loginLink = document.getElementById("loginLink");
const loginModal = document.getElementById("loginModal");
const closeModal = document.getElementById("closeModal");

if(loginLink && loginModal && closeModal){

    loginLink.addEventListener("click", function(e){
        e.preventDefault();
        loginModal.style.display = "flex";
    });

    closeModal.addEventListener("click", function(){
        loginModal.style.display = "none";
    });

}
// Signup
const signupBtn = document.getElementById("signupBtn");

if(signupBtn){

signupBtn.onclick = () => {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth,email,password)
    .then(()=>{
        alert("✅ Account Created Successfully");
        loginModal.style.display="none";
    })
    .catch(error=>{
        alert(error.message);
    });

};

}

// Login

document.getElementById("loginUserBtn").onclick = () => {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {

            alert("🎉 Login Successful");

            loginModal.style.display = "none";

            window.location.reload();

        })
        .catch((error) => {
            alert(error.message);
        });

};

// Check User Login Status



const productGrid = document.getElementById("productGrid");

async function loadProducts() {

    if (!productGrid) return;

    productGrid.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "products"));

    querySnapshot.forEach((doc) => {

        const product = doc.data();

        productGrid.innerHTML += `

        <div class="product-card">

            <img src="${product.image}" alt="${product.name}">

            <h3>${product.name}</h3>

            <p>⭐⭐⭐⭐⭐ (4.9)</p>

            <p>₹${product.price}</p>

            <div class="buttons">

                <button class="wishlist">🤍 Wishlist</button>

               <button class="add-cart" data-id="${doc.id}">
    🛒 Add to Cart
</button>

            </div>

        </div>

        `;

    });

    // Add to Cart
    document.querySelectorAll(".add-cart").forEach((button) => {

        button.onclick = () => {

            const card = button.closest(".product-card");

            const product = {

    id: button.dataset.id,

    image: card.querySelector("img").src,

    name: card.querySelector("h3").innerText,

    price: card.querySelectorAll("p")[1].innerText,

    qty: 1

};

const existing = cart.find(item => item.id === product.id);

if (existing) {

    existing.qty++;

} else {

    cart.push(product);

}

            localStorage.setItem("cart", JSON.stringify(cart));

            cartCount = cart.length;

            document.getElementById("cartLink").innerHTML =
                `Cart 🛒 (${cartCount})`;

            alert("✅ Product Added");

        };

    });

    // Wishlist
    document.querySelectorAll(".wishlist").forEach((button) => {

        button.onclick = () => {

            if (button.innerHTML.includes("🤍")) {

                button.innerHTML = "❤️ Wishlist";

            } else {

                button.innerHTML = "🤍 Wishlist";

            }

        };

    });

}
loadProducts();
const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");

if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
        navbar.classList.toggle("active");
    });
}