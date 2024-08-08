// Global variables
const cardContent = document.querySelector(".card__items");
const cart = document.querySelector(".cart");
const cartNumber = document.querySelector(".cart__quantity-number");
const cartFullyContainer = document.querySelector(".cart__fully");
const totalContainer = document.querySelector(".item__total");
const totalValue = document.createElement("p");
const confirmContainer = document.querySelector(".item__confirm");
const cartContainer = document.querySelector(".item__fully-cart");
const cartParent = document.querySelector(".cart");
const arryHTML = document.getElementsByClassName("item__image");
const itemsContainer = document.querySelector(".item__fully-cart");
const emptyCart = document.querySelector(".cart__empty");
let cartForItems = [];



const onCreateElement = ({ image, name, category, price }) => {
    
    const cardContainer = document.createElement("div");
    const cardImage = document.createElement("div");
    const cardBtn = document.createElement("button");
    const pBtn = document.createElement("p");
    const logoBtn = document.createElement("div");
    const article = document.createElement("article");
    const articleP = document.createElement("p");
    const articleH2 = document.createElement("h2");
    const articleSpan = document.createElement("span");

    // Condition to change background
    if(window.innerWidth >= 1440){
        cardImage.style.backgroundImage = `url(${image.desktop})`;
        cardImage.classList.add("desktop");
    } else {
        cardImage.style.backgroundImage = `url(${image.mobile})`;
        cardImage.classList.add("mobile");
    }

    pBtn.innerText = "Add to Cart";
    articleP.innerText = category;
    articleH2.innerText = name;
    articleSpan.innerText = `$${price}`;
    logoBtn.style.backgroundImage = 'url("./assets/images/icon-add-to-cart.svg")';

    // Add class atribute
    cardContainer.classList.add("card__item");
    cardImage.classList.add("item__image");
    cardBtn.classList.add("item__button");
    articleSpan.classList.add("item__price");
    logoBtn.classList.add("item__addCart");

    //Add an ID atribute
    const idItem = `item${Math.random() * 1}`;
    cardContainer.id = idItem;

    // Store an object data structure all item data
    const objItem = {
        id: idItem,
        name,
        price,
        thumbnail: image.thumbnail
    }

    // Remeber add an event listener over
    cardBtn.onclick = (e) => {
        cardBtn.removeChild(logoBtn);

        const plusBtn = document.createElement("div");
        const minParent = document.createElement("div");
        const minBtn = document.createElement("div"); 
        const plusParent = document.createElement("div");
        const validate = document.getElementById(`btn-id.${idItem}`);

        if(!validate){
            
            // Add classes attributes
            cardBtn.classList.add('item__button-click')
            plusParent.classList.add("parent-btns");
            minParent.classList.add("parent-btns");
            plusBtn.classList.add("increment-btn");
            minBtn.classList.add("decrement-btn");

            cardBtn.id = `btn-id.${idItem}`
            
            // Append childs elements
            plusParent.appendChild(plusBtn);
            minParent.appendChild(minBtn);
            cardBtn.appendChild(minParent)
            cardBtn.appendChild(pBtn)
            cardBtn.appendChild(plusParent);
            
            
            plusBtn.style.backgroundImage = 'url("./assets/images/icon-increment-quantity.svg")';
            minBtn.style.backgroundImage = 'url("./assets/images/icon-decrement-quantity.svg")'
            pBtn.innerText = 1;

            // Add click event
            plusParent.onclick = () => {
                onFilterItems(objItem);
            };

            
            onFilterItems(objItem);

            cardBtn.onclick = false;

        }

        
    };

    // Append HTMl elements
    cardImage.appendChild(cardBtn);
    cardBtn.appendChild(logoBtn);
    cardBtn.appendChild(pBtn);
    article.appendChild(articleP);
    article.appendChild(articleH2);
    article.appendChild(articleSpan);
    cardContainer.appendChild(cardImage);
    cardContainer.appendChild(article);

    return cardContainer;
    

}

// Fetch - Format JSON
async function onGetData () {

    try {
        const response = await fetch("../data.json");
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }

}

const onDisplay = async () => {
    const data = await onGetData();

    for(let i = 0; i < data.length; i++){
        cardContent.appendChild(onCreateElement(data[i]));
    }
}

const onHandleImageSize = async () => {

    const imgSize = document.querySelector(".item__image");

    const data = await onGetData();

    if(window.innerWidth >= 1440 && imgSize.classList.contains("mobile")){

        data.forEach(({ image }, i) => {
            arryHTML[i].style.backgroundImage = `url(${image.desktop})`;
        });

        imgSize.classList.remove("mobile");
        imgSize.classList.add("desktop");

    } else if(window.innerWidth <= 1439 && imgSize.classList.contains("desktop")){

        data.forEach(({ image }, i) => {
            arryHTML[i].style.backgroundImage = `url(${image.mobile})`;
        });

        imgSize.classList.remove("desktop");
        imgSize.classList.add("mobile");
    }
}

const onFilterItems = ({id, name, price, thumbnail}) => {

    const newItem = {
        id, 
        name, 
        price, 
        thumbnail, 
        quantity: 1,
        total: price
    }

    if(cartForItems.length === 0){
        cartForItems.push(newItem);
    } else {
        const existItem = cartForItems.some(item => item.id === id)
        
        if(!existItem){
            cartForItems = [newItem, ...cartForItems];
        } else {
            cartForItems = cartForItems.map(item => {
                if(item.id === id){
                    item.quantity++;
                    item.total += item.price;
                }

                return item;
            })
        }
    }

    onDisplayItem(cartForItems);

}

const onDisplayConfirm = () => {

        // Total elements
        const totalText = document.createElement("p");

        // Confirm elements
        const confirmText = document.createElement("div");
        const confirmIcon = document.createElement("div");
        const confirmIconText = document.createElement("p");
        const confirmBtn = document.createElement("button");
    
        // Display Total section 
        totalValue.classList.add("item__total-text");
    
        // Display Confirm section
        confirmText.classList.add("item__confirm-text");
        confirmIcon.classList.add("item__confirm-icon");
        confirmBtn.classList.add("item__confirm-btn");
        totalContainer.classList.add("item__active");
    
        // Add values
        totalText.innerText = "Order Total";
        confirmIconText.innerHTML = "p>This is a <b>Carbon-neutral</b> delivery</p>";
        confirmBtn.innerText = "Confirm Order";
    
        // Append elements
        totalContainer.appendChild(totalText);
        totalContainer.appendChild(totalValue);
    
        confirmText.appendChild(confirmIcon);
        confirmText.appendChild(confirmIconText);
        confirmContainer.appendChild(confirmText);
        confirmContainer.appendChild(confirmBtn);
    
        cartFullyContainer.appendChild(totalContainer);
        cartFullyContainer.appendChild(confirmContainer);
    
        totalContainer.style.display = "flex";
        confirmContainer.style.display = "flex";
    
}

const onDisplayItem = (items) => {

    let totalItems = 0;
    let quantity = 0;

    if(!totalContainer.classList.contains("item__active")){
        emptyCart.style.display = "none"
        cart.style.height = "600px"
        onDisplayConfirm();
    };

    while(itemsContainer.lastChild){
        itemsContainer.removeChild(itemsContainer.lastChild);
    }

    items.forEach((item) => {

        totalItems += item.total;
        quantity += item.quantity

        // Access DOM's Elements by document element(root)
        const list = document.createElement("div");
        const itemName = document.createElement("p");
        const itemQuantity = document.createElement("p");
        const itemPrice = document.createElement("p");
        const itemTotal = document.createElement("p");
        const itemRemove = document.createElement("button");
    
        // Add classes to each Node elements
        itemName.classList.add("item__cart-dt");
        itemQuantity.classList.add("item__cart-dq");
        itemPrice.classList.add("item__cart-dp");
        itemTotal.classList.add("item__cart-dtl");
        itemRemove.classList.add("item__cart-btn");
        list.classList.add("item__cart-container");

        // Add values to each node element
        itemName.innerText = item.name;
        itemQuantity.innerText = `${item.quantity}x`;
        itemPrice.innerText = `@${Number(item.price).toFixed(2)}`;
        itemTotal.innerText = `$${Number(item.total).toFixed(2)}`;
    
        // Append elements to each other
        list.appendChild(itemName);
        list.appendChild(itemQuantity);
        list.appendChild(itemPrice);
        list.appendChild(itemTotal);
        list.appendChild(itemRemove);

        itemsContainer.appendChild(list);

    })
    
    cartNumber.innerText = `(${quantity})`;
    totalValue.innerText = `$${totalItems.toFixed(2)}`;
    
}

window.addEventListener('resize', onHandleImageSize);

onDisplay();


