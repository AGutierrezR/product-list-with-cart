/**
 * @typedef {Object} ProductImage
 * @property {string} thumbnail - Path to the thumbnail image.
 * @property {string} mobile - Path to the mobile version of the image.
 * @property {string} tablet - Path to the tablet version of the image.
 * @property {string} desktop - Path to the desktop version of the image.
 */

/**
 * @typedef {Object} Product
 * @property {number} id - Unique identifier for the product.
 * @property {ProductImage} image - Object containing different image versions.
 * @property {string} name - Name of the product.
 * @property {string} category - Category the product belongs to.
 * @property {number} price - Price of the product.
 */

/**
 * Fetches all products from the server.
 *
 * @returns {Promise<Product[]>} A promise that resolves to an array of product objects.
 */
async function getAllProducts() {
  return await fetch('../../data.json').then((res) => res.json())
}

document.addEventListener('DOMContentLoaded', async () => {
  const products = await getAllProducts()
  const productsMap = new Map(products.map((item) => [item.id, item]))
  const cart = new Map()


  const productListElem = document.querySelector(
    '[data-selector="product-list"]',
  )

  productsMap.forEach((element) => {
    const elem = document.createElement('li')
    elem.innerHTML = /* HTML */ `
      <div class="product-item">
        <picture class="product-item__image">
          <source srcset="${element.image.tablet}" media="(min-width: 640px)" />
          <source
            srcset="${element.image.desktop}"
            media="(min-width: 900px)"
          />
          <img src="${element.image.mobile}" />
        </picture>

        <div class="product-item__actions">
          <button
            data-product-id="${element.id}"
            data-action="add"
            data-alignment="center"
            class="product-item__button button button--secondary with-icon"
          >
            <svg class="icon icon--add-to-cart">
              <use href="#:add-to-cart" />
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
          <div class="text-sm product-item__category">${element.category}</div>
          <h3 class="product-item__name">${element.name}</h3>
          <p class="product-item__price">
            ${(+element.price).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </p>
        </div>
      </div>
    `

    productListElem.appendChild(elem)
  })

  // Add event listener for click on product list
  productListElem.addEventListener('click', (ev) => {
    // event logic
  })
})
