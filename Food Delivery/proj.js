let cart = [];
let total = 0;
let discount = 0;

function toggleCart() {
    document.getElementById("cartPanel").classList.toggle("active");
}

function addToCart(name, price) {

    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }

    updateCart();
}

function updateCart() {

    let cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";

    total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.qty;

        cartItems.innerHTML += `
            <div class="cart-item">
                ${item.name} (x${item.qty})
                <div>
                    <button onclick="changeQty(${index},-1)">-</button>
                    <button onclick="changeQty(${index},1)">+</button>
                    <button onclick="removeItem(${index})">X</button>
                </div>
            </div>
        `;
    });

    document.getElementById("cart-count").innerText = cart.length;
    document.getElementById("total").innerText = total - discount;
}

function changeQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) cart.splice(index,1);
    updateCart();
}

function removeItem(index) {
    cart.splice(index,1);
    updateCart();
}

function applyDiscount() {
    let coupon = document.getElementById("coupon").value;

    if (coupon === "SAVE10") {
        discount = total * 0.10;
        alert("10% Discount Applied!");
    } else {
        discount = 0;
        alert("Invalid Coupon");
    }

    updateCart();
}

function showCheckout() {
    document.getElementById("checkoutSection").style.display = "block";
}

function placeOrder() {

    let address = document.getElementById("address").value;
    let payment = document.querySelector('input[name="payment"]:checked');

    if (!address) {
        alert("Enter Address");
        return;
    }

    if (!payment) {
        alert("Select Payment Method");
        return;
    }

    alert("Order Placed Successfully 🎉");

    cart = [];
    total = 0;
    discount = 0;

    updateCart();
    document.getElementById("checkoutSection").style.display = "none";
}
