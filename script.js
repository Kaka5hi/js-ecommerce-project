const BASE_URL = 'https://fakestoreapi.com/products'
const container = document.querySelector(".trending-section-items") // -> main product container
const categoryContainer = document.querySelector(".filter-btns") // -> filter button container

const cartBtn = document.querySelector('.cart-open-btn') 
const sidebarBtn = document.querySelector('.sidebar-btn')
const sidebar = document.querySelector('.sidebar')

// first fetch data
const fetchData = async() => {
    let resp = await fetch(BASE_URL);
    let data = await resp.json()
    displayProducts(data);
    categoryButtons(data);
}

// data is send to a fucntion where is will be used to fill the DOM
const displayProducts = (productList) => {
    container.innerHTML = productList.map(product =>
        `<div class="item">
            <div class="item-img">
                <img src=${product.image} alt=${product.title.substring(0, 25)}>
            </div>
            <div class="item-info">
                <h4>${product.title.substring(0, 25)}</h4>
                <span>$ ${product.price}</span>
            </div>
            <div class="item-btns">
                <button>add to cart</button>
                <button>wishlist</button>
            </div>
        </div>`
    ).join("")
}

// dynamic categories button
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
