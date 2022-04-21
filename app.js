const menuBtn = document.querySelector(".menu-icon");
const closeBtn = document.querySelector(".close");
const sideNav = document.querySelector("#side-nav");
const cart = document.querySelector(".cart");
const cartContainer = document.querySelector(".cart-container");
const cartContent = document.querySelector(".cart-content");
const addCart = document.querySelector(".add-cart");
const cartCount   = document.querySelector(".cart-count");
const noOfItemBtn = document.querySelectorAll(".product-amount button");
const productNumber = document.querySelector(".product-number");
const productPrice = document.querySelector(".price");
const cartCountInfo = document.querySelector(".cart-count");
const productCarousel = document.querySelector(".product-carousel")
const productImage = document.querySelector(".product-img")



// lightbox overlay
const backgroundOverlay = document.createElement("div");
backgroundOverlay.id = "overlay";
document.body.appendChild(backgroundOverlay);

// product
products = [
    {
        "title": "Fall Limited edition Sneakers",
        "category": "sneakers",
        "price": "125.00",
        "percent": "50",
        "lastPrice": "250.00",
        "imgSrc": "images/image-product-1.jpg",
        "desc": "These low-profile sneakers are your perfect casual wear companion. Featuring a durable rubber outer sole, they’ll withstand everything the weather can offer."
    }
]
// eventlisteners
let cartItemID = 1;
window.addEventListener("DOMContentLoaded", () => {
    loadCart();
})

// show nav
menuBtn.addEventListener("click", () =>{
    backgroundOverlay.classList.add("active")
    sideNav.classList.add("show-links");

    // const body = document.querySelector("body")
    
})

// close nav
closeBtn.addEventListener("click", () => {
    backgroundOverlay.classList.remove("active")
    sideNav.classList.remove("show-links");
})
// show/hide cart
cart.addEventListener("click", () => {
    cartContainer.classList.toggle("show-cart-content")
})

// delete product in cart
cartContainer.addEventListener("click", deleteProduct)

// purchase product and disallow purchase of zero number of items
addCart.addEventListener("click", () => {
    let countInfo = productNumber.textContent;
    if (parseInt(countInfo)  === 0){
        addCart.style.disabled
    }else{
        purchaseProducts(addCart);
    }
})

// end eventlisteners

// product image change with next and back button
// lightbox mobile view change with next button
const nextBtn = document.querySelector(".next")
let nextpix = 1
nextBtn.addEventListener("click", () => {
    nextpix++;
    if (nextpix === 5){
        nextpix = 1;
    }
    
    productImage.src = `images/image-product-${nextpix}.jpg`
        
})
// lightbox mobile view change with back button
const backBtn = document.querySelector(".back")
backBtn.addEventListener("click", () => {
    nextpix--;
    if(nextpix === 0){
        nextpix = 4;
    }
    productImage.src = `images/image-product-${nextpix}.jpg`
})

// lightbox popImage
productCarousel.addEventListener("click", () => {
    if (window.innerWidth >= 1000){               
        backgroundOverlay.classList.add("active");
        const newNode = productCarousel.cloneNode(true);
        const closeBtn = document.createElement("img");
        closeBtn.className = "close-btn"
        closeBtn.src = "images/icon-close.svg"
        newNode.style.width = "400px";
        // remove duplicate image
        while(backgroundOverlay.firstChild){
            backgroundOverlay.removeChild(backgroundOverlay.firstChild)
        }
        backgroundOverlay.appendChild(newNode);
        backgroundOverlay.appendChild(closeBtn);
        // overlay closebtn
        closeBtn.addEventListener("click", () => {
        backgroundOverlay.classList.remove("active")
        })
        
        // lightbox overly-image change
        const thumbnailImages = backgroundOverlay.querySelectorAll(".thumbnail");
        const overlayImages = backgroundOverlay.querySelector(".product-img");
        thumbnailImages.forEach(thumbnailImage => {
            thumbnailImage.addEventListener("click", () => {
                overlayImages.src = thumbnailImage.src.replace("-thumbnail", "")
            })
            // lightbox overlay-image change with next button
            const nextBtn = backgroundOverlay.querySelector(".next")
            let nextpix = 1
            nextBtn.addEventListener("click", () => {
                nextpix++;
                if (nextpix === 5){
                    nextpix = 1;
                }      
                overlayImages.src = `images/image-product-${nextpix}.jpg`  
            })
            // lightbox overlay-image change with back button
            const backBtn = backgroundOverlay.querySelector(".back")
            backBtn.addEventListener("click", () => {
                nextpix--;
                if(nextpix === 0){
                    nextpix = 4;
                }
                overlayImages.src = `images/image-product-${nextpix}.jpg`
            })
        })

        
    }
    
    
})

// increase or decrease number of items
let num = 0
noOfItemBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        if(btn.classList.contains("plus")){
            num += 1 
            productNumber.innerHTML = num;
        }
        else{
            // disable minus button if num = 0
            if(num === 0){
                btn.style.disabled;
                // productNumber.style.disabled;
                
            }else{
                num-=1;
                productNumber.innerHTML = num;
            }
            
        }
    })
   
})
    
// update cart info
function updateCartInfo(){
    let cartinfo = findCartInfo();
    cartCountInfo.classList.add("show-cart-num");
    cartCountInfo.textContent = cartinfo;    
}
// purchase products
function purchaseProducts(e){    
    if(e.classList.contains("add-cart")){
        let product = e.parentElement.parentElement.parentElement.parentElement;
        getProductsInfo(product);
    }
}

// getproduct info
function getProductsInfo(product){
    let productInfo = {
    id: cartItemID,
    title: product.querySelector(".product-title").textContent,
    price: product.querySelector(".price").textContent,
    percent: product.querySelector(".percent").textContent,
    lastPrice: product.querySelector(".last-price").textContent,
    noOfItem: product.querySelector(".product-number").textContent,
    imgSrc: product.querySelector(".product-img").src,
    desc: product.querySelector(".product-desc").textContent
    }
    cartItemID++;
    addToCartList(productInfo);
    saveProductInfo(productInfo);
}

// add the selected product to cartlist
function addToCartList(product){
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-content");
    cartItem.setAttribute("data-id", `${product.id}`);
    product.imgSrc = "images/image-product-1-thumbnail.jpg";
    // get the total amount of item
    totalOfItem = parseFloat(product.price.substr(1)) * parseFloat(product.noOfItem)
    // console.log(totalOfItem)
    cartItem.innerHTML = `
        <div class="cart-item">
            <img src="${product.imgSrc}" class="cart-item-img" alt="">
            <p>${product.title}<br>
            ${product.price} x ${product.noOfItem} <span>$${totalOfItem}.00</span></p>
            <button class="delete-btn type="button"><img src="images/icon-delete.svg" class="delete-item" alt=""></button>
        </div>
        <a class="cart-checkout">Checkout</a>`
    cartContainer.appendChild(cartItem)
    updateCartInfo()
    


}
// save the product in the local storage
function saveProductInfo(item){
    let products  = getProductsFromStorage();
    products.push(item);
    localStorage.setItem('products', JSON.stringify(products))
    updateCartInfo()
}

// get products from local storage if there is any
function getProductsFromStorage(){
    return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
    // returns an empty array if there is no product info
}

// load carts from storage
function loadCart(){
    let products  = getProductsFromStorage();
    if(products.length < 1){
        cartItemID = 1; // if there is no product in the local storage
    }
    else{
        cartItemID = products[products.length - 1].id;
        cartItemID++;
        // else get the id of the last product and increase by 1
    }
    products.forEach((product) => {
        addToCartList(product);
    })
}

// return the number of products in storage
function findCartInfo(){
    let products  = getProductsFromStorage();
    return products.length
}

// delete product
function deleteProduct(e){
    let cartItem;
    if( e.target.className === "delete-item"){
        cartItem = e.target.parentElement.parentElement.parentElement;
        cartItem.remove()  
    }
    let products = getProductsFromStorage();
    let updatedProducts = products.filter((product) => {
        return product.id !== parseInt(cartItem.dataset.id);
    })
    localStorage.setItem("products", JSON.stringify(updatedProducts)) 
    updateCartInfo()
   

}

