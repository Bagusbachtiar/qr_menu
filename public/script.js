let menuItems = [];
let cart = [];

async function loadMenu(){
    const response = await fetch('/api/menu');
    menuItems = await response.json();

    const menuList = document.getElementById('menu-list');
    menuList.innerHTML = menuItems.map(item => `
        <div>
        ${item.name} - $${item.price}
        <button onclick="addToCart(${item.id})"> add</button>
        </div>
    `).join('');
}

function addToCart(id) {
    const item = menuItems.find(m => m.id === id);
    const existing = cart.find(c => c.id === id);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...item, qty:1});
    }

    renderCart();
}

function renderCart() {
  const cartList = document.getElementById('cart-list');
  cartList.innerHTML = cart.map(c => `
    <div>
      ${c.name} x${c.qty} - $${(c.price * c.qty).toFixed(2)}
      <button onclick="removeFromCart(${c.id})">Remove</button>
    </div>
  `).join('');

    const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  document.getElementById('cart-total').textContent = total.toFixed(2);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  renderCart();
}

async function checkout() {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: cart.map(c => ({ menuItemId: c.id, quantity: c.qty })),
    }),
  });

  const data = await response.json();
  window.location.href = data.checkoutUrl;
}

loadMenu();