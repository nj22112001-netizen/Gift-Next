import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const loginLink = document.getElementById("loginLink");

if (loginLink) {

    onAuthStateChanged(auth, (user) => {

        if (user) {

            // Login ke baad
            loginLink.innerHTML = "Logout";
            loginLink.href = "#";

            loginLink.onclick = (e) => {

                e.preventDefault();

                const confirmLogout = confirm("Do you want to logout?");

                if (confirmLogout) {

                    signOut(auth)
                        .then(() => {

                            alert("✅ Logged Out Successfully");

                            window.location.reload();

                        })
                        .catch((error) => {

                            alert(error.message);

                        });

                }

            };

        } else {

            // Login nahi hai
            loginLink.innerHTML = "Login";
            loginLink.href = "login.html";

        }

    });

}