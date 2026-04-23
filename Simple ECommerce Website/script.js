// script.js | Experiment 7 - E-Commerce Website

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    saveCart();
    renderCart();
}

function renderCart() {
    const cartDiv = document.getElementById('cart-items');
    const totalEl = document.getElementById('total');
    const countEl = document.getElementById('cart-count');
    if (!cartDiv) return;

    if (cart.length === 0) {
        cartDiv.innerHTML = '<p>Cart is empty.</p>';
        if (totalEl) totalEl.textContent = '0';
        if (countEl) countEl.textContent = '0';
        return;
    }

    let html = '<ul>';
    let total = 0;
    let count = 0;
    cart.forEach((item, i) => {
        html += `<li>${item.name} x${item.qty} = ₹${item.price * item.qty} 
            <button onclick="removeFromCart(${i})">Remove</button></li>`;
        total += item.price * item.qty;
        count += item.qty;
    });
    html += '</ul>';
    cartDiv.innerHTML = html;
    if (totalEl) totalEl.textContent = total;
    if (countEl) countEl.textContent = count;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

function loadCheckout() {
    const div = document.getElementById('checkout-items');
    const totalEl = document.getElementById('checkout-total');
    if (!div) return;

    if (cart.length === 0) {
        div.innerHTML = '<p>No items in cart.</p>';
        return;
    }

    let html = '<ul>';
    let total = 0;
    cart.forEach(item => {
        html += `<li>${item.name} x${item.qty} = ₹${item.price * item.qty}</li>`;
        total += item.price * item.qty;
    });
    html += '</ul>';
    div.innerHTML = html;
    if (totalEl) totalEl.textContent = total;
}

function placeOrder() {
    cart = [];
    saveCart();
    document.getElementById('checkout-items').innerHTML = '';
    document.getElementById('checkout-total').textContent = '0';
    document.getElementById('place-order-btn').style.display = 'none';
    document.getElementById('confirmation').style.display = 'block';
}

// Auto-render cart on page load
renderCart();