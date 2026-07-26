import { auth, db } from "./firebase.js";


import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


// Elements

const paymentTotal = document.getElementById("paymentTotal");

const upiSection = document.getElementById("upiSection");

const confirmPayment = document.getElementById("confirmPayment");


// Get Order

let order = JSON.parse(
    localStorage.getItem("lastOrder")
);



if (!order) {

    alert("❌ No Order Found!");

    window.location.href = "cart.html";

}


// Show Amount

paymentTotal.textContent = "₹" + order.total;



// Payment Method

const paymentMethods = document.querySelectorAll(
    'input[name="paymentMethod"]'
);


paymentMethods.forEach((radio)=>{


    radio.addEventListener("change",()=>{


        if(
            radio.value === "UPI" &&
            radio.checked
        ){

            upiSection.style.display = "block";

        }
        else{

            upiSection.style.display = "none";

        }


    });


});



// Confirm Payment

confirmPayment.addEventListener(
"click",
async ()=>{


    try {


        const selectedPayment =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );



        if(!selectedPayment){

            alert("Please Select Payment Method");

            return;

        }



        order.paymentMethod =
        selectedPayment.value;
        order.uid = auth.currentUser ? auth.currentUser.uid : "";



        order.status = "Pending";


        order.createdAt =
        serverTimestamp();



        // Save Order

        await addDoc(
            collection(db,"orders"),
            order
        );



        // Save Completed Order

        localStorage.setItem(
            "completedOrder",
            JSON.stringify(order)
        );



        // Clear Cart

        localStorage.removeItem("cart");

        localStorage.removeItem("lastOrder");



        alert(
            "🎉 Order Placed Successfully!"
        );



        window.location.href =
        "index.html";



    }


    catch(error){


        console.error(
            "Order Error:",
            error
        );


        alert(
            "❌ " + error.message
        );


    }


});