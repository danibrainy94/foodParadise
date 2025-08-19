let crossBtn = document.getElementById('cancel-btn')
let menuBtn = document.getElementById('menu-btn')
let navElements = document.getElementById('links-container')

const showCross = () => {
  menuBtn.style.display = 'none'
  crossBtn.style.display = 'block'
  navElements.classList.remove('hidden')
  // navElements.classList.add('visible');
  navElements.style.display = 'block'
  navElements.classList.add('animation-reveal')
}
const showMenu = () => {
  menuBtn.style.display = 'block'
  crossBtn.style.display = 'none'
  navElements.style.display = 'none'
}

// document.addEventListener('DOMContentLoaded', hideCross)
menuBtn.addEventListener('click', showCross)
crossBtn.addEventListener('click', showMenu)



    // Slideshow functionality
    const slides = document.querySelectorAll('.slide-images');
    const dotsContainer = document.getElementById('dots-container');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    

    // Update slide position
    function updateSlide() {
      document.querySelector('.slideshow-wrapper').style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    // Change slide
    function changeSlide(step) {
      currentIndex = (currentIndex + step + slides.length) % slides.length;
      updateSlide();
      resetAutoPlay();
    }

    // Go to specific slide
    function goToSlide(index) {
      currentIndex = index;
      updateSlide();
      resetAutoPlay();
    }

    // Auto-play
    let autoPlayInterval;

    function startAutoPlay() {
      autoPlayInterval = setInterval(() => {
        changeSlide(1);
      }, 5000);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }

    // Start auto-play
    startAutoPlay();



// initializing and getting product data from the json app
let productList = []

const initApp = () => {
  fetch('products.json')
    .then(response => response.json())
    .then(data => {
      productList = data
      generateProducts()
    })
}

initApp()

let productBox = document.getElementById('items-container')

// function to generate the products from object declared
const generateProducts = (product = productList) => {
  if (product.length > 0) {
    product.forEach(prod => {
      let productDiv = document.createElement('div')
      productDiv.classList.add('box')
      productDiv.dataset.id = prod.id

      productDiv.innerHTML = `
            
            <i class='bx  bx-heart'></i>
            <img class="product-img" src="./food-img/${
              prod.img
            }" alt="product-image">
            <h2 class="box-title">${prod.productName}</h2>
            <p class="product-info">${prod.prodDescript}</p>

            <div class="buttons-container">
                <div class="buttons-wrapper">
                    <p class="price">${prod.price.toLocaleString()}</p>
                    
                    <button class="product-btn cart-btn"><i class='bx  bx-cart-plus'></i> </button>
                </div>
                <i class='bx  bx-share'></i>
            </div>
        `
      productBox.appendChild(productDiv)
    })
  }
}

// variables and function to filter products according to selected categories

let filterButtons = document.querySelectorAll('.filter-btn')

// code to filter products according to category
filterButtons.forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    const category = e.currentTarget.dataset.id

    // comparing the category in the object to the data-id declared in the html
    const productCategory = productList.filter(function (menuItem) {
      if (menuItem.category === category) {
        return menuItem
      }
    })

    productBox.innerHTML = ''
    if (category === 'all') {
      generateProducts(productList)
    } else {
      generateProducts(productCategory)
    }
  })
})

// load products into the html
// document.addEventListener('DOMContentLoaded', generateProducts(productList));

// code to initialize cart and add items to a cart container
let cartAddBtn = document.querySelectorAll('.cart-btn')
let cartCounter = document.getElementById('cart-count')
let cartButton = document.getElementsByClassName('bx-cart')
;[0]
let cartItemsWrapper = document.getElementById('cart-items-wrapper')

let count = 0

// initializing the cart counter to increment anytime cart button is clicked
productBox.addEventListener('click', e => {
  let btnPosition = e.target.closest('.cart-btn')
  if (btnPosition) {
    count++
    cartCounter.textContent = count
  }
})

// toggle-cart on and off
let cartContainerBtn = document.getElementsByClassName('cart-container')[0]
let cartItemsContainer = document.getElementById('cart-items-container')
let body = document.getElementsByTagName('body')

const toggleCartContainer = () => {
  cartItemsContainer.classList.toggle('cart-show')
}

// const removeCart = () => {
//     cartItemsContainer.classList.remove("cart-show");
// }

cartContainerBtn.addEventListener('click', toggleCartContainer)
// body.addEventListener("click", removeCart);

// scans through each product and selects the add to cart button

productBox.addEventListener('click', e => {
  let clickPosition = e.target

  if (clickPosition.closest('.cart-btn')) {
    // making use of closest since the button is nexted, with an unnested element, parentElement is called directly
    let product_cont = clickPosition.closest('.box')
    product_id = product_cont.dataset.id
    addItemsToCart(product_id)
  }
})

// // defines cart as being empty
let cart = []

// initializing adding items to the empty cart array by targetting the product id whenever the add to cart button is clicked
const addItemsToCart = product_id => {
  let productPositionCart = cart.findIndex(
    value => value.product_id == product_id
  )
  if (cart.length <= 0) {
    cart = [
      {
        product_id: product_id,
        quantity: 1
      }
    ]
  } else if (productPositionCart < 0) {
    cart.push({
      product_id: product_id,
      quantity: 1
    })
  } else {
    cart[productPositionCart].quantity = cart[productPositionCart].quantity + 1
  }
  cartDisplayToPage()
}

// display the items loaded in the cart array to the cart container in the page

const cartDisplayToPage = () => {
  // Clear previous cart items before rendering
  cartItemsWrapper.innerHTML = ''

  cart.forEach(cart_obj => {
    let presentPosition = productList.findIndex(
      value => value.id == cart_obj.product_id
    )
    let itemsInfo = productList[presentPosition]
    if (itemsInfo) {
      let cartItems = document.createElement('div')
      cartItems.classList.add('cart-items')
      cartItems.innerHTML = `
                <img src="./food-img/${itemsInfo.img}" alt="cart-img" class="cart-img">
                <p>${itemsInfo.productName}</p>
                <div class="cart-buttons-container">
                    <button class="cart-btns-left"><i class='bx  bx-minus'  ></i> </button>
                    <span>${cart_obj.quantity}</span>
                    <button class="cart-btns-right"><i class='bx  bx-plus'  ></i> </button>
                </div>
            `
      cartItemsWrapper.appendChild(cartItems)
    }
  })

  // this handles the increment/decrement of the quantity when left/ right button is clicked.
  // it was moved here so that the event listeners trigger continuously on request
  const cartItems = cartItemsWrapper.querySelectorAll('.cart-items')
  cartItems.forEach((item, idx) => {
    const leftBtn = item.querySelector('.cart-btns-left')
    const rightBtn = item.querySelector('.cart-btns-right')

    leftBtn.addEventListener('click', () => {
      if (cart[idx].quantity > 1) {
        cart[idx].quantity--
        cartCounter.textContent--
      } else {
        cart.splice(idx, 1)
      }
      cartDisplayToPage()
    })

    rightBtn.addEventListener('click', () => {
      cart[idx].quantity++
      cartCounter.textContent++
      cartDisplayToPage()
    })
  })
}

// setting up the cart close button to close the cart whenever it is clicked
let closeCartBtn = document.querySelector('.cart-btn-close')

closeCartBtn.addEventListener('click', () => {
  cartItemsContainer.classList.remove('cart-show')
})

let clearCartBtn = document.querySelector('.cart-btn-clear')

clearCartBtn.addEventListener('click', () => {
  cart = []
  cartCounter.textContent = 0
  count = 0
  cartDisplayToPage()
})

/* setting up some cool cart animtions */

// adding a shake effect to the cart icon whenever the add to cart button is clicked
function shakeCartIcon () {
  if (!cartIcon) return
  cartIcon.classList.add('shake')
  setTimeout(() => {
    cartIcon.classList.remove('shake')
  }, 500) // duration matches the shake animation
}

// Add shake effect when flyToCart is executed
function flyToCart (itemElement, cartElement) {
  const img = itemElement.querySelector('.product-img').cloneNode()
  const itemRect = itemElement.getBoundingClientRect()
  const cartRect = cartElement.getBoundingClientRect()

  img.style.position = 'fixed'
  img.style.left = itemRect.left + 'px'
  img.style.top = itemRect.top + 'px'
  img.style.width = itemRect.width + 'px'
  img.style.height = itemRect.height + 'px'
  img.style.transition = 'all 0.3s cubic-bezier(.55,-0.04,.91,.94)'
  img.style.zIndex = 1000
  document.body.appendChild(img)

  setTimeout(() => {
    img.style.left = cartRect.left + 'px'
    img.style.top = cartRect.top + 'px'
    img.style.width = '30px'
    img.style.height = '5px'
    img.style.opacity = '0.6'
  }, 10)

  img.addEventListener('transitionend', () => img.remove())

  shakeCartIcon()
}

// selecting the cart icon element
const cartIcon = document.querySelector('.bx-cart')

// Add fly-to-cart animation when cart button is clicked
productBox.addEventListener('click', e => {
  let btn = e.target.closest('.cart-btn')
  if (btn && cartIcon) {
    let productDiv = btn.closest('.box')
    if (productDiv) {
      flyToCart(productDiv, cartIcon)
    }
  }
})

/* code to change the contents of the chef cards at the click of a button */

const chefData = [
  {
    img: './food-img/chef1.png',
    chefname: 'Luca Moretti',
    description:
      'Mastery in modern Mediterranean and Italian cuisine, blending tradition with innovation using seasonal, high-quality ingredients',
    nationality: 'Italian',
    speed: 'fast',
    price: 'Expensive'
  },
  {
    img: './food-img/chef3.jpeg',
    chefname: 'Marie Dubois',
    description:
      'Specializes in French and contemporary fusion cuisine using seasonal, locally sourced ingredients to create refined, flavor-rich dishes.',
    nationality: 'French',
    speed: 'optimum',
    price: 'Moderate'
  },
  {
    img: './food-img/chef2.png',
    chefname: 'Carlos Mendez',
    description:
      'Carlos Mendez specializes in blending bold Latin flavors with modern culinary techniques. Carlos brings a global perspective to authentic, ingredient-driven cuisine.',
    nationality: 'Mexican',
    speed: 'fast',
    price: 'Affordable'
  }
]

let chefElement = document.querySelectorAll('.chef-element')
let chefImage = document.getElementById('chef-img')
let chefName = document.getElementById('chef-name')
let chefDescription = document.getElementById('chef-description')
let chefNationality = document.getElementsByClassName('extra-info')[0]
let chefSpeed = document.getElementsByClassName('extra-info')[1]
let chefPrice = document.getElementsByClassName('extra-info')[2]
let extraInfo = document.querySelector('.extra-info')

// selecting through chef cards
let chefBtnRight = document.querySelector('.bx-chevron-right-circle')
let chefBtnLeft = document.querySelector('.bx-chevron-left-circle')

let cardIndex = 0

// function to facilitate the display of elements for the chef card
const displayChefCard = () => {
  
  chefImage.src = chefData[cardIndex].img
  chefName.textContent = chefData[cardIndex].chefname
  chefDescription.textContent = chefData[cardIndex].description
  extraInfo.innerHTML = ` 
  <p><i class='bx  bx-building-house'></i>${chefData[cardIndex].nationality}</p>
  <p><i class='bx  bx-timer'></i>${chefData[cardIndex].speed}</p>
  <p><i class='bx  bx-currency-notes'></i>${chefData[cardIndex].price}</p> `;
  
}

// function to disable buttons when at the last element in the list
const updateButtonState = () => {
  chefBtnLeft.disabled = cardIndex === 0
  chefBtnRight.disabled = cardIndex === chefData.length - 1
}

// load first element once the page loads
document.addEventListener('DOMContentLoaded', () => {
  displayChefCard()
  updateButtonState()
})

// display next chef element once the right button is clicked
chefBtnRight.addEventListener('click', () => {
  if (cardIndex < chefData.length - 1) {
    cardIndex++
    displayChefCard()
    updateButtonState()
  }

  chefElement.forEach(item => {
    item.classList.add('chef-element-right')

    item.addEventListener(
      'animationend',
      () => {
        item.classList.remove('chef-element-right')
      },
      { once: true }
    )
  })
})

// display previous chef element once the left button is clicked
chefBtnLeft.addEventListener('click', () => {
  if (cardIndex > 0) {
    cardIndex--
    displayChefCard()
    updateButtonState()
  }

  chefElement.forEach(item => {
    item.classList.add('chef-element-left')

    item.addEventListener(
      'animationend',
      () => {
        item.classList.remove('chef-element-left')
      },
      { once: true }
    )
  })
})
