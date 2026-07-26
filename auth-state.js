import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


const userMenu = document.getElementById("userMenu");


onAuthStateChanged(auth,(user)=>{


    if(!user){

        userMenu.innerHTML = `

        <a href="login.html">
        Login
        </a>

        `;

        return;

    }



    userMenu.innerHTML = `

    <a href="my-orders.html">
    📦 My Orders
    </a>


    <button id="logoutBtn">
    Logout
    </button>


    `;



    document
    .getElementById("logoutBtn")
    .addEventListener("click",()=>{


        signOut(auth)
        .then(()=>{


            alert("Logged Out Successfully");


            window.location.reload();


        });


    });



});