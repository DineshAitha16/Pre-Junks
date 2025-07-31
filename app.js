const menu = [
  { name: "Veg Burger", price: 120 },
  { name: "Paneer Wrap", price: 150 },
  { name: "Cold Coffee", price: 80 },
  { name: "French Fries", price: 100 },
  { name: "Choco Shake", price: 130 }
];

const cart = [];
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
  cart.push(menu[index]);
  total += menu[index].price;
  document.getElementById("total").innerText = total;
  const li = document.createElement("li");
  li.innerText = `${menu[index].name} - ₹${menu[index].price}`;
  document.getElementById("cart-list").appendChild(li);
}

function placeOrder() {
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;

  if (!name || !address || cart.length === 0 || !userEmail) {
    alert("Please sign in with Google, fill all fields, and add items to cart.");
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
}

window.onload = renderMenu;
