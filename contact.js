const toggle = document.getElementById("contactToggle");
const menu = document.querySelector(".contact-options");

toggle.onclick = () => {
    menu.classList.toggle("show");
};