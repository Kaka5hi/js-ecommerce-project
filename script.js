const BASE_URL = 'https://fakestoreapi.com/products'
const container = document.querySelector(".trending-section-items") // -> main product container
const categoryContainer = document.querySelector(".filter-btns") // -> filter button container
const cartItemContainer = document.querySelector('.sidebar-content') // ->cart item container
const cartTotalPrice = document.querySelector('.total-price') // ->cost displayed in cart
const cartItemCount = document.querySelector('.cart-item-count') // -> item count in cart icon by default is 0

// sidebar setup
const cartBtn = document.querySelector('.cart-open-btn') 
const sidebarBtn = document.querySelector('.sidebar-btn')
const sidebar = document.querySelector('.sidebar')

let addToCartBtns; // initally cart is empty
let cartItems=[]; // empty cart
let totalCost; // total cost of cart items

// first fetch data
const fetchData = async() => {
    let resp = await fetch(BASE_URL);
    let data = await resp.json()
    storeProductInfo(data)
    displayProducts(data);
    categoryButtons(data);
}

// dom population based on data
const displayProducts = (productList) => {
    container.innerHTML = productList.map(product =>
        `<div id=${product.id} class="item">
            <div class="item-img">
                <img src=${product.image} alt=${product.title.substring(0, 25)}>
            </div>
            <div class="item-info">
                <h4>${product.title.substring(0, 25)}</h4>
                <span>$ ${Math.round(product.price)}</span>
            </div>
            <div class="item-btns">
                <button class="add-to-cart">add to cart</button>
                <button>wishlist</button>
            </div>
        </div>`
    ).join("")

    addToCartBtns = [...document.querySelectorAll(".add-to-cart")]
    addToCartBtns.forEach(button => {
    button.addEventListener('click', (e) => {
        // checking which item is clicked and will send this data to cart
        let selectedItemId = parseInt(e.target.parentNode.parentNode.id);
        let selectedItem = productList.filter(item => item.id === selectedItemId)
        cartItems.push(...selectedItem)
        storeCartDataLocally(cartItems)
        addToCart();
        })
    })
}

// dynamic categories button and filtering the product accordingly
const categoryButtons = (data) => {
    let allCategories = data.map(item=> item.category)
    let categories = ["All",...allCategories.filter((item, i) => {
        return allCategories.indexOf(item) === i
    })]
    
    categoryContainer.innerHTML = categories.map(item=> 
        `<li class="filterBtns">${item}</li>`
    ).join("")

    categoryContainer.addEventListener('click', (e) =>{
        const btnClicked = e.target.textContent;
        btnClicked === "All"
            ? displayProducts(data)
            : displayProducts(data.filter(item=> item.category === btnClicked));
    })
}


// add to cart fucntionality
const addToCart = () => {
    // retrieve data of cart from local storage
    let items = JSON.parse(getCartLocalData())
    cartItemContainer.innerHTML = items.map(item=>
        `<div class="sidebar-item">
            <div class="sidebar-item-info">
                <div class="sidebar-item-img">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="sidebar-item-detail">
                    <span>${item.title.substring(0,16)}</span>
                    <span>$ ${Math.round(item.price)}</span>
                </div>
            </div>
            <div class="sidebar-price">
                <span>$ ${Math.round(item.price)}</span>
            </div>
        </div>`
    ).join('')

    updateCartPrice()
    updateCartItemNumber()
}


// update cart price
const updateCartPrice = () =>{
    let items = JSON.parse(getCartLocalData())
    let priceArray = items.map(item => item.price)
    totalCost = priceArray.reduce(getSum, 0)
    cartTotalPrice.textContent = `Total Price: $${totalCost}`
}

// calculate cart price
const getSum =(total, num) => {
  return total + Math.round(num);
}

const updateCartItemNumber = () => {
    let items = JSON.parse(getCartLocalData())
    cartItemCount.textContent = items.length
}

// storing all products information
const storeProductInfo = (data) => {
    localStorage.setItem('productList', JSON.stringify(data))
}

// store cart items data 
const storeCartDataLocally = (items) => {
    localStorage.setItem('cartItems', JSON.stringify(items))
}

// retreiving cart data from local storage
const getCartLocalData = () => {
    return localStorage.getItem('cartItems')
}


// call fetchdata as soon as dom content loaded
document.addEventListener('DOMContentLoaded', ()=> {
    fetchData()
})

// toggle sidebar
cartBtn.addEventListener('click', ()=>{
    sidebar.classList.add('show')
})

sidebarBtn.addEventListener('click', ()=>{
    sidebar.classList.remove('show')
})
