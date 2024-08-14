const orderContainer = document.querySelector(".item__cfn-list");
const totalValue = document.querySelector(".item__cfn-total");

const onDisplayOrder = (items) => {
    let total = 0;
    items.forEach(i => {
        total += i.total;
        orderContainer.appendChild(onCreateItem(i));
    });
    totalValue.innerText = `$${Number(total).toFixed(2)}`
}

const onCreateItem = (item) => {
    const itemList = document.createElement("div");
    const itemImage = document.createElement("div");
    const itemImageChild = document.createElement("div");
    const itemTitle = document.createElement("p");
    const itemQuantity = document.createElement("p");
    const itemPrice = document.createElement("p");
    const itemTotal = document.createElement("p");

    itemImageChild.style.backgroundImage = `url(${item.image.thumbnail})`;
    itemTitle.innerText = item.name;
    itemQuantity.innerText = `${item.quantity}x`;
    itemPrice.innerText = `@${Number(item.price).toFixed(2)}`;
    itemTotal.innerText = `$${Number(item.total).toFixed(2)}`;

    itemTitle.classList.add("item__list-title");
    itemQuantity.classList.add("item__list-q");
    itemPrice.classList.add("item__list-p");
    itemTotal.classList.add("item__list-t");
    itemImageChild.classList.add("item__list-img-i");
    itemImage.classList.add("item__list-img-c");
    itemList.classList.add("item__list");

    itemImage.appendChild(itemImageChild);
    itemList.append(itemImage);
    itemList.appendChild(itemTitle);
    itemList.appendChild(itemQuantity);
    itemList.appendChild(itemPrice);
    itemList.appendChild(itemTotal);

    return itemList;
}

export {
    onDisplayOrder
}