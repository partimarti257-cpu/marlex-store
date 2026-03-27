let cart = [];

function changeImage(src) {
document.getElementById("mainImage").src = src;
}

function addToCart() {
const size = document.getElementById("size").value;

cart.push({
name: "Marlex Limitless Tee",
price: 15,
size
});

renderCart();
}

function renderCart() {
const list = document.getElementById("cartItems");
list.innerHTML = "";

let total = 0;

cart.forEach((item, index) => {
total += item.price;

const li = document.createElement("li");
li.innerHTML = `${item.name} (${item.size}) - ${item.price}€ <button onclick="removeItem(${index})">X</button>`;
list.appendChild(li);
});

document.getElementById("total").innerText = "Общо: " + total + "€";
}

function removeItem(index) {
cart.splice(index, 1);
renderCart();
}

function submitOrder() {
const name = document.getElementById("name").value;
const phone = document.getElementById("phone").value;
const address = document.getElementById("address").value;

if (!name || !phone || !address) {
alert("Попълни всички полета!");
return;
}

let orderText = "Поръчка:\n";

cart.forEach(item => {
orderText += `${item.name} (${item.size}) - ${item.price}€\n`;
});

orderText += `\nИме: ${name}`;
orderText += `\nТелефон: ${phone}`;
orderText += `\nАдрес: ${address}`;

alert(orderText);
}

function scrollToProduct() {
document.getElementById("product").scrollIntoView({ behavior: "smooth" });
}
