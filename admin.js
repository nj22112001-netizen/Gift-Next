import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const ADMIN_EMAIL = "admingiftnext1@gmail.com";

onAuthStateChanged(auth, (user) => {

    if (!user) {

        alert("⚠ Please Login First");

        window.location.href = "index.html";

        return;

    }

    if (user.email !== ADMIN_EMAIL) {

        alert("⛔ Access Denied");

        window.location.href = "index.html";

        return;

    }

    console.log("✅ Admin Verified");
    loadProducts();
    loadDashboard();

});

const addBtn = document.getElementById("addProduct");

addBtn.addEventListener("click", async () => {

    const name = document.getElementById("name").value;
    const price = Number(document.getElementById("price").value);
    const image = document.getElementById("image").value;
    const category = document.getElementById("category").value;
    const stock = Number(document.getElementById("stock").value);

    if (!name || !price || !image || !category || !stock) {
        alert("Please fill all fields");
        return;
    }

    try {

        await addDoc(collection(db, "products"), {

            name,
            price,
            image,
            category,
            stock

        });

        alert("✅ Product Added Successfully");
        loadProducts();

        document.getElementById("name").value = "";
        document.getElementById("price").value = "";
        document.getElementById("image").value = "";
        document.getElementById("category").value = "";
        document.getElementById("stock").value = "";

    } catch (error) {

        alert(error.message);

    }

});
const productList = document.getElementById("productList");
async function loadProducts() {

    if (!productList) return;

    productList.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "products"));

    querySnapshot.forEach((item) => {

        const product = item.data();

        productList.innerHTML += `

       <div class="admin-product" data-category="${product.category.toLowerCase()}">

            <img src="${product.image}" width="80">

            <h3>${product.name}</h3>

            <p>₹${product.price}</p>

            <p>Category : ${product.category}</p>

            <p>Stock : ${product.stock}</p>


            <button class="editBtn" data-id="${item.id}">
            ✏️ Edit
            </button>


            <button class="deleteBtn" data-id="${item.id}">
            🗑 Delete
            </button>

        </div>

        `;

    });


    // DELETE FUNCTION

    document.querySelectorAll(".deleteBtn").forEach(btn=>{


        btn.onclick = async()=>{


            if(confirm("Delete this product?")){


                await deleteDoc(
                    doc(db,"products",btn.dataset.id)
                );


                alert("Product Deleted ✅");


                loadProducts();

            }

        }


    });



    // EDIT FUNCTION

    document.querySelectorAll(".editBtn").forEach(btn=>{


        btn.onclick = async()=>{


            let id = btn.dataset.id;


            let newName = prompt("Enter New Product Name");


            let newPrice = prompt("Enter New Price");



            if(newName && newPrice){


                await updateDoc(

                    doc(db,"products",id),

                    {

                    name:newName,

                    price:Number(newPrice)

                    }

                );


                alert("Product Updated ✅");


                loadProducts();

            }


        }


    });


}

// SEARCH PRODUCT

const searchInput = document.getElementById("searchInput");


if(searchInput){

searchInput.addEventListener("keyup",()=>{


let value = searchInput.value.toLowerCase();


document.querySelectorAll(".admin-product")
.forEach(card=>{


let name = card.querySelector("h3")
.innerText
.toLowerCase();


if(name.includes(value)){

card.style.display="block";

}
else{

card.style.display="none";

}


});


});

}


// CATEGORY FILTER

const categoryFilter = document.getElementById("categoryFilter");


if(categoryFilter){

categoryFilter.addEventListener("change",()=>{


let selected = categoryFilter.value;


document.querySelectorAll(".admin-product")
.forEach(card=>{


let category = card.dataset.category;


if(selected=="all" || category==selected){

card.style.display="block";

}

else{

card.style.display="none";

}


});


});

}
// ---------------- Dashboard ----------------

async function loadDashboard() {

    // Total Products

    const productSnapshot = await getDocs(
        collection(db, "products")
    );

    document.getElementById("totalProducts").innerText =
        productSnapshot.size;

    // Total Orders

    const orderSnapshot = await getDocs(
        collection(db, "orders")
    );

    document.getElementById("totalOrders").innerText =
        orderSnapshot.size;

    let revenue = 0;

    let pending = 0;

    orderSnapshot.forEach((docItem) => {

        const order = docItem.data();

        revenue += Number(order.total || 0);

        if (order.status === "Pending") {

            pending++;

        }

    });

    document.getElementById("pendingOrders").innerText =
        pending;

    document.getElementById("totalRevenue").innerText =
        "₹" + revenue;

}
