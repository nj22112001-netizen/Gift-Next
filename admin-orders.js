import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const ordersContainer = document.getElementById("ordersContainer");

async function loadOrders() {

    ordersContainer.innerHTML = "<h2>Loading Orders...</h2>";

    try {

        const snapshot = await getDocs(collection(db, "orders"));

        if (snapshot.empty) {

            ordersContainer.innerHTML = `
                <h2 style="text-align:center;">
                    No Orders Found 📦
                </h2>
            `;

            return;
        }

        ordersContainer.innerHTML = "";

        snapshot.forEach((docItem) => {

            const order = docItem.data();

            let productsHTML = "";

            if (order.products && order.products.length > 0) {

                order.products.forEach((item) => {

                    productsHTML += `
                        <li>
                            ${item.name} × ${item.qty || 1}
                            - ${item.price}
                        </li>
                    `;

                });

            }

            ordersContainer.innerHTML += `

                <div class="orders-card">

                    <h2>📦 Order</h2>

                    <p><strong>Order ID:</strong> ${docItem.id}</p>

                    <p><strong>Name:</strong> ${order.customerName}</p>

                    <p><strong>Phone:</strong> ${order.phone}</p>
                    <p><strong>Email:</strong> ${order.email || "Not Available"}</p>

                    <p><strong>Address:</strong> ${order.address}</p>

                    <p><strong>City:</strong> ${order.city}</p>

                    <p><strong>Pincode:</strong> ${order.pincode}</p>

                    <p><strong>Payment:</strong> ${order.paymentMethod}</p>

                    <p><strong>Total:</strong> ₹${order.total}</p>

                    <label><strong>Status:</strong></label>

                    <select
                        class="status-select"
                        data-id="${docItem.id}"
                    >

                        <option value="Pending"
                        ${order.status === "Pending" ? "selected" : ""}>
                            Pending
                        </option>

                        <option value="Packed"
                        ${order.status === "Packed" ? "selected" : ""}>
                            Packed
                        </option>

                        <option value="Shipped"
                        ${order.status === "Shipped" ? "selected" : ""}>
                            Shipped
                        </option>

                        <option value="Delivered"
                        ${order.status === "Delivered" ? "selected" : ""}>
                            Delivered
                        </option>

                    </select>

                    <div class="orders-products">

                        <h3>Products</h3>

                        <ul>

                            ${productsHTML}

                        </ul>

                    </div>

                </div>

            `;

        });

        // STATUS UPDATE

        document.querySelectorAll(".status-select").forEach((select) => {

            select.addEventListener("change", async () => {

                try {

                    await updateDoc(
                        doc(db, "orders", select.dataset.id),
                        {
                            status: select.value
                        }
                    );

                    alert("✅ Status Updated Successfully");

                } catch (error) {

                    console.log(error);

                    alert("❌ " + error.message);

                }

            });

        });

    }

    catch (error) {

        console.log(error);

        ordersContainer.innerHTML = `
            <h2 style="color:red;text-align:center;">
                Failed to Load Orders
            </h2>
        `;

    }

}

loadOrders();