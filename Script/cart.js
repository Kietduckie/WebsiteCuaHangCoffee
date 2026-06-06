// cart.js

function getCart(){

    return JSON.parse(
        localStorage.getItem("cart")
    ) || [];
}

function saveCart(cart){

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}

function addToCart(id,name,price,image){

    let cart = getCart();

    const existing =
    cart.find(item => item.id === id);

    if(existing){

        existing.quantity++;

    }else{

        cart.push({
            id,
            name,
            price,
            image,
            quantity:1
        });
    }

    saveCart(cart);

    alert("Đã thêm vào giỏ hàng");

    renderCart();
}

function renderCart(){

    const cartContainer =
    document.getElementById("cart-items");

    const totalElement =
    document.getElementById("cart-total");

    if(!cartContainer) return;

    let cart = getCart();

    let html = "";

    let total = 0;

    cart.forEach(item=>{

        total +=
        item.price * item.quantity;

        html += `
        <tr>
            <td>${item.name}</td>
            <td>${item.price.toLocaleString()}đ</td>
            <td>${item.quantity}</td>
            <td>
                ${(item.price * item.quantity).toLocaleString()}đ
            </td>
        </tr>
        `;
    });

    cartContainer.innerHTML = html;

    if(totalElement){

        totalElement.innerHTML =
        total.toLocaleString() + "đ";
    }
}

function clearCart(){

    localStorage.removeItem("cart");

    renderCart();
}