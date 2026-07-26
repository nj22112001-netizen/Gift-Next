import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const productContainer = document.getElementById("productGrid");

async function loadProducts() {

    if (!productContainer) return;

    productContainer.innerHTML = "";

    const snapshot = await getDocs(collection(db, "products"));

    snapshot.forEach((item) => {

        const product = item.data();

        productContainer.innerHTML += `

        <div class="product-card">

            <img src="${product.image}" alt="${product.name}">

            <h3>${product.name}</h3>

            <p class="price">₹${product.price}</p>

            <p>${product.category}</p>

            <button class="cartBtn" data-id="${item.id}">
                🛒 Add To Cart
            </button>

        </div>

        `;

    });

    // ADD TO CART

    const cartButtons = document.querySelectorAll(".cartBtn");

    cartButtons.forEach((btn) => {

        btn.addEventListener("click", () => {

            const card = btn.closest(".product-card");

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            const product = {
                id: btn.dataset.id,
                name: card.querySelector("h3").innerText,
                price: card.querySelector(".price").innerText,
                image: card.querySelector("img").src
            };

            const existing = cart.find(item => item.id === product.id);

            if (existing) {
                existing.qty += 1;
            } else {
                product.qty = 1;
                cart.push(product);
            }

            localStorage.setItem("cart", JSON.stringify(cart));

            alert("✅ Product Added To Cart");

        });

    });

}

loadProducts();