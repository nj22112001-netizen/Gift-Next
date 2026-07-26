import { db } from "./firebase.js";


import {
    doc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";



const productDetails = document.getElementById("productDetails");



const params = new URLSearchParams(
    window.location.search
);


const productId = params.get("id");



if(!productId){

    productDetails.innerHTML = `
    <h2>
    Product Not Found
    </h2>
    `;

}



async function loadProduct(){


const productRef = doc(
    db,
    "products",
    productId
);



const productSnap = await getDoc(productRef);



if(productSnap.exists()){


const product = productSnap.data();



productDetails.innerHTML = `


<div class="details-card">


<img src="${product.image}"
class="details-image">



<h1>
${product.name}
</h1>


<h2>
₹${product.price}
</h2>


<p>
Category:
${product.category}
</p>


<p>
Stock:
${product.stock}
</p>



<p class="description">

Premium gift item from Gift Next.
Perfect for your loved ones 🎁

</p>



<button id="addDetailsCart">

🛒 Add To Cart

</button>


</div>


`;



document
.getElementById("addDetailsCart")
.onclick=()=>{


let cart =
JSON.parse(localStorage.getItem("cart"))
|| [];



cart.push({

id:productId,

image:product.image,

name:product.name,

price:"₹"+product.price,

qty:1

});



localStorage.setItem(
"cart",
JSON.stringify(cart)
);



alert("Added to Cart 🛒");


};



}

else{


productDetails.innerHTML =
"<h2>Product Not Found</h2>";


}


}



loadProduct();