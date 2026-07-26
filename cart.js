import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function displayCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <h2 style="text-align:center;">
                Your Cart is Empty 🛒
            </h2>
        `;

        if (totalPrice) totalPrice.textContent = "0";

        return;
    }

    let total = 0;

    cart.forEach((item, index) => {

        const price = Number(item.price.replace(/[^\d]/g, ""));

        const qty = item.qty || 1;

        total += price * qty;

        cartItems.innerHTML += `

        <div class="cart-card">

            <img src="${item.image}" class="cart-img">

            <div class="cart-info">

                <h3>${item.name}</h3>

                <p>Price : ${item.price}</p>

                <div class="qty-box">

                    <button onclick="decreaseQty(${index})">−</button>

                    <span>${qty}</span>

                    <button onclick="increaseQty(${index})">+</button>

                </div>

                <p><strong>Subtotal :</strong> ₹${price * qty}</p>

                <button onclick="removeItem(${index})">
                    🗑 Remove
                </button>

            </div>

        </div>

        `;

    });

    if (totalPrice) {
        totalPrice.textContent = total;
    }

}

window.increaseQty = function(index){

    cart[index].qty++;

    saveCart();

    displayCart();

}

window.decreaseQty = function(index){

    if(cart[index].qty > 1){

        cart[index].qty--;

    }else{

        cart.splice(index,1);

    }

    saveCart();

    displayCart();

}

window.removeItem = function(index){

    cart.splice(index,1);

    saveCart();

    displayCart();

}

displayCart();

const checkoutBtn = document.getElementById("checkoutBtn");

if(checkoutBtn){

    checkoutBtn.addEventListener("click", () => {

    onAuthStateChanged(auth, (user) => {

        if (!user) {

            alert("⚠ Please Login First");

            document.getElementById("loginLink")?.click();

            return;

        }

        window.location.href = "checkout.html";

    });

});

}