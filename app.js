const menu = [
  { name: "Veg Burger", price: 120 },
  { name: "Paneer Wrap", price: 150 },
  { name: "Cold Coffee", price: 80 },
  { name: "French Fries", price: 100 },
  { name: "Choco Shake", price: 130 }
];

const cart = {};
let total = 0;
let userEmail = "";

function renderMenu() {
  const menuDiv = document.getElementById("menu");
  menu.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.innerHTML = `
      <h3>${item.name}</h3>
      <p>₹${item.price}</p>
      <button onclick="addToCart(${index})">Add to Cart</button>
    `;
    menuDiv.appendChild(div);
  });
}

function addToCart(index) {
  const item = menu[index];
  if (cart[item.name]) {
    cart[item.name].quantity += 1;
  } else {
    cart[item.name] = { ...item, quantity: 1 };
  }
  total += item.price;
  document.getElementById("total").innerText = total;
  renderCart();
}

function renderCart() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = "";
  for (let itemName in cart) {
    const item = cart[itemName];
    const li = document.createElement("li");
    li.innerText = `${item.name} - ₹${item.price} x ${item.quantity}`;
    cartList.appendChild(li);
  }
}

function placeOrder() {
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;

  if (!name || !address || Object.keys(cart).length === 0 || !userEmail) {
    alert("Please sign in, fill all fields, and add items to cart.");
    return;
  }

  const order = {
    name,
    address,
    email: userEmail,
    items: cart,
    total,
    timestamp: new Date().toISOString()
  };

  localStorage.setItem("lastOrder", JSON.stringify(order));
  alert("Opening Razorpay payment...");

  const options = {
    key: "rzp_test_YourKeyHere", // Replace with your Razorpay Test Key
    amount: total * 100,
    currency: "INR",
    name: "Pre Junks",
    description: "Food Order Payment",
    handler: function (response) {
      alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
    },
    prefill: {
      name: name,
      email: userEmail,
      contact: ""
    },
    notes: {
      address: address
    },
    theme: {
      color: "#f44336"
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

function onSignIn(response) {
  const userObject = jwt_decode(response.credential);
  userEmail = userObject.email;
  document.getElementById("user-email").innerText = `Logged in as: ${userEmail}`;
  localStorage.setItem("userEmail", userEmail);
}

// Manual login fallback
function manualLogin() {
  const name = document.getElementById("reg-name").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  if (!name || !email || !password) {
    alert("Please fill in all login fields.");
    return;
  }

  userEmail = email;
  document.getElementById("user-email").innerText = `Logged in as: ${userEmail}`;
  localStorage.setItem("userEmail", userEmail);
}

window.onload = () => {
  renderMenu();
  const savedEmail = localStorage.getItem("userEmail");
  if (savedEmail) {
    userEmail = savedEmail;
    document.getElementById("user-email").innerText = `Logged in as: ${userEmail}`;
  }
};
