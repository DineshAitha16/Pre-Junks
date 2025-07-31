const menu = [
  { name: "Veg Burger", price: 120 },
  { name: "Paneer Wrap", price: 150 },
  { name: "Cold Coffee", price: 80 }
];

const cart = [];
let total = 0;

function renderMenu() {
  const menuDiv = document.getElementById("menu");
  menu.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.innerHTML = `<strong>${item.name}</strong><br>₹${item.price}<br><button onclick="addToCart(${index})">Add to Cart</button>`;
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

  if (!name || !address || cart.length === 0) {
    alert("Please fill all fields and add items to cart.");
    return;
  }

  const order = {
    name,
    address,
    items: cart,
    total,
    timestamp: new Date().toISOString()
  };

  localStorage.setItem("lastOrder", JSON.stringify(order));
  alert("Order placed! Now opening payment...");

  var options = {
    key: "rzp_test_YourKeyHere", // Replace with your Razorpay test key
    amount: total * 100,
    currency: "INR",
    name: "Your Hotel",
    description: "Food Order",
    handler: function (response) {
      alert("Payment Successful: " + response.razorpay_payment_id);
    }
  };
  var rzp = new Razorpay(options);
  rzp.open();
}

window.onload = renderMenu;
