import { auth, db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


const myOrders = document.getElementById("myOrders");



onAuthStateChanged(auth, async (user)=>{


    if(!user){

        alert("Please Login First");

        window.location.href="index.html";

        return;

    }



    loadMyOrders(user.uid);


});





async function loadMyOrders(uid){


    myOrders.innerHTML = "Loading Orders...";



    const q = query(

        collection(db,"orders"),

        where("uid","==",uid)

    );



    const snapshot = await getDocs(q);



    if(snapshot.empty){


        myOrders.innerHTML = `

        <h2>
        No Orders Found 📦
        </h2>

        `;

        return;

    }



    myOrders.innerHTML = "";



    snapshot.forEach((doc)=>{


        const order = doc.data();



        let products = "";



        order.products.forEach((item)=>{


            products += `

            <p>
            ${item.name} × ${item.qty || 1}
            </p>

            `;


        });





        myOrders.innerHTML += `

<div class="my-order-card">


    <div class="order-header">

        <h2>
        📦 My Order
        </h2>

        <span class="status">
        ${order.status || "Pending"}
        </span>

    </div>


    <p>
    <b>Order ID:</b> ${doc.id}
    </p>


    <div class="order-products">

        <h3>Products</h3>

        ${products}

    </div>



    <div class="order-footer">

        <h3>
        Total: ₹${order.total}
        </h3>


        <p>
        💳 ${order.paymentMethod}
        </p>


    </div>


</div>

`;


    });



}