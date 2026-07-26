import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


// Elements

const form = document.getElementById("checkoutForm");

const orderItems = document.getElementById("orderItems");

const subtotal = document.getElementById("subtotal");

const grandTotal = document.getElementById("grandTotal");

const qrBox = document.getElementById("qrBox");


// Cart

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let total = 0;


// Check Login

onAuthStateChanged(auth, (user)=>{


    console.log("Checkout User:", user);


    if(!user){

        alert("⚠ Please Login First");

        window.location.href="index.html";

        return;

    }


    loadOrderSummary();


});



// Load Cart Summary

function loadOrderSummary(){


    total = 0;


    orderItems.innerHTML="";


    if(cart.length===0){


        orderItems.innerHTML="<p>Your cart is empty 🛒</p>";

        subtotal.innerHTML="₹0";

        grandTotal.innerHTML="₹0";

        return;

    }



    cart.forEach((item)=>{


        const price = Number(
            item.price.replace(/[^\d]/g,"")
        );


        const qty = item.qty || 1;


        const itemTotal = price * qty;


        total += itemTotal;



        orderItems.innerHTML += `

        <div class="summary-row">

            <span>
            ${item.name} × ${qty}
            </span>

            <span>
            ₹${itemTotal}
            </span>

        </div>

        `;


    });



    subtotal.innerHTML = "₹"+total;

    grandTotal.innerHTML = "₹"+total;


}



// Payment QR

document.querySelectorAll(
'input[name="payment"]'
)
.forEach((radio)=>{


    radio.addEventListener("change",()=>{


        if(
            radio.value==="UPI" &&
            radio.checked
        ){

            qrBox.style.display="block";

        }

        else{

            qrBox.style.display="none";

        }


    });


});




// Place Order

form.addEventListener("submit",(e)=>{


    e.preventDefault();



    const user = auth.currentUser;



    if(!user){

        alert("Please Login First");

        return;

    }



    const order = {


        customerName:
        document.getElementById("customerName").value,


        email:
        user.email,


        phone:
        document.getElementById("phone").value,


        address:
        document.getElementById("address").value,


        city:
        document.getElementById("city").value,


        pincode:
        document.getElementById("pincode").value,


        paymentMethod:
        document.querySelector(
        'input[name="payment"]:checked'
        ).value,


        products:cart,


        total:total,


        status:"Pending",


        orderDate:
        new Date().toLocaleString()


    };



    console.log("Final Order:",order);



    localStorage.setItem(
        "lastOrder",
        JSON.stringify(order)
    );



    window.location.href="payment.html";


});