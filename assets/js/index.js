document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("../../data.json");
  const data = await res.json();

  const productList = document.querySelector('[data-selector="product-list"]');

  data.forEach((element) => {
    const elem = document.createElement("li");
    elem.innerHTML = `
      <div class="product-item">
        <picture class="product-item__image">
          <source srcset="${element.image.tablet}" media="(min-width: 640px)"/>
          <source srcset="${element.image.desktop}" media="(min-width: 900px)"/>
          <img src="${element.image.mobile}"/>
        </picture>

        <div class="product-item__actions">
          <button data-action="add" class="btn-add">
            <svg class="icon icon--add-to-cart">
              <use href="#:add-to-cart"/>
            </svg>
            <span>Add to Cart</span>
          </button>

          <!--<div class="product-item__quantity-controls">-->
          <!--  <button data-action="decrement">-->
          <!--    <svg class="icon icon--quantity-control">-->
          <!--      <use href="#:decrement-quantity"/>-->
          <!--    </svg>-->
          <!--  </button>-->
          <!--  <span class="product-item__quantity">4</span>-->
          <!--  <button data-action="increment">-->
          <!--    <svg class="icon icon--quantity-control">-->
          <!--      <use href="#:increment-quantity"/>-->
          <!--    </svg>-->
          <!--  </button>-->
          <!--</div>-->
        </div>

        <div class="product-item__info">
          <div class="product-item__category">${element.category}</div>
          <h3 class="product-item__name">${element.name}</h3>
          <p class="product-item__price">${(+element.price).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}</p>
        </div>
      </div>
      `;

    productList.appendChild(elem);
  });



  // Add event listener for click on product list
  productList.addEventListener("click", (ev) => {
    const target = ev.target;

    if (!target.dataset.action) {
      return;
    }

    console.log("test");
  });
});
