let crossBtn = document.getElementById("cancel-btn");
let menuBtn = document.getElementById("menu-btn");
let navElements = document.getElementById("links-container");

const showCross = () => {
    
    menuBtn.style.display = "none";
    crossBtn.style.display = "block";
    navElements.classList.remove('hidden');
    // navElements.classList.add('visible');
    navElements.style.display = "block";
    navElements.classList.add('animation-reveal');

    
}
const showMenu = () => {
    
    menuBtn.style.display = "block";
    crossBtn.style.display = "none";
    navElements.style.display = "none";
    
}


// document.addEventListener('DOMContentLoaded', hideCross)
menuBtn.addEventListener('click', showCross);
crossBtn.addEventListener('click', showMenu);



// initializing and getting product data from the json app
let productList = [];

const initApp = () => {
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        productList = data;
        generateProducts();
    })
    
}

initApp();

let productBox = document.getElementById("items-container");

// function to generate the products from object declared
const generateProducts = (product = productList) => {
    if (product.length > 0) {
        product.forEach(prod => {
    
        let productDiv = document.createElement("div");
        productDiv.classList.add("box");
        productDiv.dataset.id = prod.id;

        productDiv.innerHTML = `
            
            <i class='bx  bx-heart'></i>
            <img class="product-img" src="./food-img/${prod.img}" alt="product-image" loading="lazy">
            <h2 class="box-title">${prod.productName}</h2>
            <p class="product-info">${prod.prodDescript}</p>

            <div class="buttons-container">
                <div class="buttons-wrapper">
                    <p class="price">${prod.price.toLocaleString()}</p>
                    
                    <button class="product-btn cart-btn"><i class='bx  bx-cart-plus'></i> </button>
                </div>
                <i class='bx  bx-share'></i>
            </div>
        `;
        productBox.appendChild(productDiv);
    });
}
}

// variables and function to filter products according to selected categories

let filterButtons = document.querySelectorAll(".filter-btn");


// code to filter products according to category
filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
        const category = e.currentTarget.dataset.id;
        
        // comparing the category in the object to the data-id declared in the html
        const productCategory = productList.filter( function (menuItem){
            if (menuItem.category === category) {
                return menuItem;
            }
        
        });

        productBox.innerHTML = "";
        if (category === "all") {
            generateProducts(productList);
        } else {
            generateProducts(productCategory);
        }

        
    });
});

// load products into the html
// document.addEventListener('DOMContentLoaded', generateProducts(productList));




// code to initialize cart and add items to a cart container
let cartAddBtn = document.querySelectorAll(".cart-btn");
let cartCounter = document.getElementById("cart-count");
let cartButton = document.getElementsByClassName("bx-cart");[0];
let cartItemsWrapper = document.getElementById("cart-items-wrapper");

let count = 0;


// initializing the cart counter to increment anytime cart button is clicked
productBox.addEventListener("click", (e) => {
    let btnPosition = e.target.closest(".cart-btn");
    if (btnPosition) {
        count++;
        cartCounter.textContent = count;
        
    }
    
});

// toggle-cart on and off 
let cartContainerBtn = document.getElementsByClassName("cart-container")[0];
let cartItemsContainer = document.getElementById('cart-items-container');
let body = document.getElementsByTagName('body');


const toggleCartContainer = () => {
    cartItemsContainer.classList.toggle("cart-show");
}

// const removeCart = () => {
//     cartItemsContainer.classList.remove("cart-show");
// }

cartContainerBtn.addEventListener("click", toggleCartContainer);
// body.addEventListener("click", removeCart);

// scans through each product and selects the add to cart button


productBox.addEventListener("click", (e) => {
    let clickPosition = e.target;

    if (clickPosition.closest(".cart-btn") ) {
        // making use of closest since the button is nexted, with an unnested element, parentElement is called directly
        let product_cont = clickPosition.closest(".box");
        product_id = product_cont.dataset.id;
        addItemsToCart(product_id);
    }
    
});

// // defines cart as being empty
let cart = [];

// initializing adding items to the empty cart array by targetting the product id whenever the add to cart button is clicked
const addItemsToCart = (product_id) => {

    let productPositionCart = cart.findIndex((value => value.product_id == product_id));
    if (cart.length <= 0) {
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if (productPositionCart < 0) {
        cart.push({
            product_id: product_id,
            quantity: 1
        })
    } else {
        cart[productPositionCart].quantity = cart[productPositionCart].quantity+1;
    }
    cartDisplayToPage();


}

// display the items loaded in the cart array to the cart container in the page



const cartDisplayToPage = () => {
    // Clear previous cart items before rendering
    cartItemsWrapper.innerHTML = "";

    cart.forEach(cart_obj => {
        let presentPosition = productList.findIndex((value) => value.id == cart_obj.product_id);
        let itemsInfo = productList[presentPosition];
        if (itemsInfo) {
            let cartItems = document.createElement("div");
            cartItems.classList.add("cart-items");
            cartItems.innerHTML = `
                <img src="./food-img/${itemsInfo.img}" alt="cart-img" class="cart-img">
                <p>${itemsInfo.productName}</p>
                <div class="cart-buttons-container">
                    <button class="cart-btns-left">&lt;</button>
                    <span>${cart_obj.quantity}</span>
                    <button class="cart-btns-right">&gt;</button>
                </div>
            `;
            cartItemsWrapper.appendChild(cartItems);
        }
    });

    // this handles the increment/decrement of the quantity when left/ right button is clicked.
    // it was moved here so that the event listeners trigger continuously on request
        const cartItems = cartItemsWrapper.querySelectorAll(".cart-items");
        cartItems.forEach((item, idx) => {
        const leftBtn = item.querySelector(".cart-btns-left");
        const rightBtn = item.querySelector(".cart-btns-right");

        leftBtn.addEventListener("click", () => {
            if (cart[idx].quantity > 1) {
                cart[idx].quantity--;
                cartCounter.textContent--;
            } else {
                cart.splice(idx, 1);
            }
            cartDisplayToPage();
        });

        rightBtn.addEventListener("click", () => {
            cart[idx].quantity++;
            cartCounter.textContent++;
            cartDisplayToPage();
        });
    });
    
}


// setting up the cart close button to close the cart whenever it is clicked
let closeCartBtn = document.querySelector(".cart-btn-close")

closeCartBtn.addEventListener("click", () => {
    cartItemsContainer.classList.remove("cart-show");
})

let clearCartBtn = document.querySelector(".cart-btn-clear")

clearCartBtn.addEventListener("click", () => {
    cart = [];
    cartCounter.textContent = 0;
    count = 0;
    cartDisplayToPage();
    
})