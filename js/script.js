// Import external functions
import { onDisplayOrder } from './modal.js';

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
const orderSection = document.querySelector(".item__cfn");
let cartForItems = [];
let retrievedData = [];

const onAddItemBtn = (id_item) => {

    const btn = document.getElementById(`btn-${id_item}`);

    // Remove child elements if exits
    onCleanChild(btn);

    const plusParent = document.createElement("div");
    const plusBtn = document.createElement("div");
    const minParent = document.createElement("div");
    const minBtn = document.createElement("div");
    const textBtn = document.createElement("p");

    const validate = document.getElementById(`btn-id.${id_item}`);

    // Outline selected item
    btn.parentNode.classList.add("item__selected");

    if (!validate) {

        // Add classes attributes
        btn.classList.add('item__button-click')
        plusParent.classList.add("parent-btns");
        minParent.classList.add("parent-btns");
        plusBtn.classList.add("increment-btn");
        minBtn.classList.add("decrement-btn");

        // Append childs elements
        plusParent.appendChild(plusBtn);
        minParent.appendChild(minBtn);
        btn.appendChild(minParent)
        btn.appendChild(textBtn)
        btn.appendChild(plusParent);

        btn.id = `btn-${id_item}`
        plusBtn.style.backgroundImage = 'url("./assets/images/icon-increment-quantity.svg")';
        minBtn.style.backgroundImage = 'url("./assets/images/icon-decrement-quantity.svg")'
        textBtn.innerText = 1;

        // Add click event
        plusParent.onclick = () => {
            onFilterItems(id_item);
        };

        minParent.onclick = (e) => {
            onDecreaseItem(e, id_item)
        }

        btn.onclick = false;

        onFilterItems(id_item);

    }
}

const onRemoveItem = (id) => {

    const btnValue = document.getElementById(`btn-${id}`);
    const logoBtn = document.createElement("div");
    const text = document.createElement("p");

    onCleanChild(btnValue);

    text.innerText = "Add to Cart"
    logoBtn.classList.add("item__addCart");
    logoBtn.style.backgroundImage = 'url("./assets/images/icon-add-to-cart.svg")';
    btnValue.classList.remove("item__button-click");
    btnValue.parentNode.classList.remove("item__selected");
    btnValue.appendChild(logoBtn);
    btnValue.appendChild(text);

    btnValue.onclick = () => {
        onAddItemBtn(id);
    };

    cartForItems = cartForItems.filter((item) => item.id_Item !== id);
    onDisplayItem(cartForItems);

}


const onCreateElement = ({ image, name, category, price, id_Item }) => {

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
    if (window.innerWidth >= 1440) {
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
    cardContainer.id = `card-id-${id_Item}`
    cardBtn.id = `btn-${id_Item}`


    // Add class atribute
    cardContainer.classList.add("card__item");
    cardImage.classList.add("item__image");
    cardBtn.classList.add("item__button");
    articleSpan.classList.add("item__price");
    logoBtn.classList.add("item__addCart");

    cardBtn.onclick = () => {
        onAddItemBtn(id_Item)
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
async function onGetData() {

    try {
        const response = await fetch("../data.json");
        const data = await response.json();
        return data.map((i) => {
            i.id_Item = Math.random();
            i.quantity = 1;
            i.total = i.price;
            return i;
        });
    } catch (error) {
        console.log(error);
    }

}

const onDisplay = async () => {
    retrievedData = await onGetData();

    for (let i = 0; i < retrievedData.length; i++) {
        cardContent.appendChild(onCreateElement(retrievedData[i]));
    }
}

const onHandleImageSize = () => {

    const imgSize = document.getElementsByClassName("item__image");

    if (window.innerWidth >= 1440 && imgSize[0].classList.contains("mobile")) {

        retrievedData.forEach(({ image }, i) => {
            arryHTML[i].style.backgroundImage = `url(${image.desktop})`;
            imgSize[i].classList.remove("mobile");
            imgSize[i].classList.add("desktop");
        });

    } else if (window.innerWidth <= 1439 && imgSize[0].classList.contains("desktop")) {

        retrievedData.forEach(({ image }, i) => {
            arryHTML[i].style.backgroundImage = `url(${image.mobile})`;
            imgSize[i].classList.remove("desktop");
            imgSize[i].classList.add("mobile");
        });

    }
}

const onDecreaseItem = (e, id) => {
    e.stopPropagation();

    const btnValue = document.getElementById(`btn-${id}`);
    const value = btnValue.childNodes[1];

    if (btnValue.innerText === "1") {
        onRemoveItem(id)
        return;
    }

    cartForItems = cartForItems.map(i => {
        if (i.id_Item === id) {
            i.quantity--;
            i.total -= i.price;
            value.innerText = i.quantity;
        }

        return i;
    })

    onDisplayItem(cartForItems);
}

const onFilterItems = (id_item) => {

    const btnValue = document.getElementById(`btn-${id_item}`).childNodes[1];
    const filteredItem = retrievedData.filter(i => i.id_Item === id_item)[0];
    const newItem = { ...filteredItem };

    if (cartForItems.length === 0) {
        cartForItems.push(newItem);
    } else {
        const existItem = cartForItems.some(item => item.id_Item === id_item);

        if (!existItem) {
            cartForItems = [newItem, ...cartForItems];
        } else {
            cartForItems = cartForItems.map(item => {

                if (item.id_Item === id_item) {
                    item.quantity++;
                    item.total += item.price;
                    btnValue.innerText = item.quantity;
                }

                return item;
            })
        }
    }

    onDisplayItem(cartForItems);

}

const onDisplayOrderItems = () => {
    orderSection.classList.add("confirm__active");
    document.body.style.overflow = "hidden";
    onDisplayOrder(cartForItems);
}

const onDisplayConfirm = () => {

    // Clean containers
    onCleanChild(totalContainer);
    onCleanChild(confirmContainer);

    emptyCart.style.display = "none"

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
    confirmIconText.innerHTML = "<p>This is a <b>Carbon-neutral</b> delivery</p>";
    confirmBtn.innerText = "Confirm Order";
    confirmBtn.onclick = onDisplayOrderItems;

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

const onCleanChild = (parent) => {
    while(parent.lastChild){
        parent.removeChild(parent.lastChild);
    }
}

const onDisplayItem = (items) => {

    let totalItems = 0;
    let quantity = 0;

    onCleanChild(itemsContainer);

    if(!totalContainer.classList.contains("item__active")){
        onDisplayConfirm();
    }

    if(items.length === 0){
        totalContainer.classList.remove("item__active");
        emptyCart.style.display = "block";
        totalContainer.style.display = "none";
        confirmContainer.style.display = "none";
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

        itemRemove.onclick = () => {
            onRemoveItem(item.id_Item)
        }

        itemsContainer.appendChild(list);

    })

    cartNumber.innerText = `(${quantity})`;
    totalValue.innerText = `$${totalItems.toFixed(2)}`;

}

window.addEventListener('resize', onHandleImageSize);

onDisplay();


