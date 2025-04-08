import { getAllProducts, currencyFormatter } from './utils.js'

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

document.addEventListener('DOMContentLoaded', async () => {
  const products = await getAllProducts()
  const productsMap = new Map(products.map((item) => [item.id, item]))
  const cart = new Map()

  function observeCart(callback) {
    const originalSet = cart.set.bind(cart)
    const originalDelete = cart.delete.bind(cart)

    cart.set = (key, value) => {
      const result = originalSet(key, value)
      callback()
      return result
    }

    cart.delete = (key) => {
      const result = originalDelete(key)
      callback()
      return result
    }

    return cart
  }

  const productListElem = document.querySelector(
    '[data-selector="product-list"]',
  )
  const cartList = document.querySelector('[data-selector="cart-list"]')

  productsMap.forEach((element) => {
    const elem = document.createElement('li')
    elem.dataset.productId = element.id
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
            data-action="add"
            data-alignment="center"
            class="product-item__button button button--secondary with-icon"
          >
            <svg class="icon icon--add-to-cart">
              <use href="#:add-to-cart" />
            </svg>
            <span>Add to Cart</span>
          </button>

          <div
            class="product-item__quantity-controls"
            data-quantity-controls
            hidden
          >
            <button data-action="decrement">
              <svg class="icon icon--quantity-control">
                <use href="#:decrement-quantity" />
              </svg>
            </button>
            <span class="product-item__quantity" data-quantity></span>
            <button data-action="increment">
              <svg class="icon icon--quantity-control">
                <use href="#:increment-quantity" />
              </svg>
            </button>
          </div>
        </div>

        <div class="product-item__info">
          <div class="text-sm product-item__category">${element.category}</div>
          <h3 class="product-item__name">${element.name}</h3>
          <p class="product-item__price text-primary">
            ${currencyFormatter(+element.price)}
          </p>
        </div>
      </div>
    `

    productListElem.appendChild(elem)
  })

  // Add event listener for click on product list
  productListElem.addEventListener('click', (ev) => {
    const button = ev.target.closest('button')

    if (!button) return

    const { action } = button.dataset

    if (!action) return

    const itemElement = button.closest('[data-product-id]')

    itemElement.dispatchEvent(
      new CustomEvent(`cart:${action}`, {
        bubbles: true,
      }),
    )
  })

  cartList.addEventListener('click', (ev) => {
    const button = ev.target.closest('button')
    const { action } = button.dataset

    if (!action) return

    const itemElement = button.closest('[data-product-id]')

    itemElement.dispatchEvent(
      new CustomEvent(`cart:${action}`, {
        bubbles: true,
      }),
    )
  })

  /**
   * @param {HTMLElement} element
   */
  function updateProductItemUI(productId) {
    const itemElement = productListElem.querySelector(
      `[data-product-id="${productId}"]`,
    )
    const addButton = itemElement.querySelector('[data-action="add"]')
    const quantityControlsWrap = itemElement.querySelector(
      '[data-quantity-controls]',
    )
    const quantityDisplay = itemElement.querySelector('[data-quantity]')
    const image = itemElement.querySelector('picture')

    if (cart.has(productId)) {
      addButton.hidden = true
      quantityControlsWrap.hidden = false
      quantityDisplay.innerText = cart.get(productId)
      image.dataset.status = 'selected'
    } else {
      addButton.hidden = false
      quantityControlsWrap.hidden = true
      quantityDisplay.innerText = ''
      image.dataset.status = ''
    }
  }

  function updateCartUI() {
    const cartEmpty = document.querySelector('[data-selector="cart-empty"]')
    const cartList = document.querySelector('[data-selector="cart-list"]')
    const cartContainer = cartList.closest('.cart-content')

    if (cart.size > 0) {
      cartContainer.hidden = false
      cartEmpty.hidden = true
    } else {
      cartContainer.hidden = true
      cartEmpty.hidden = false
    }

    cartList.innerHTML = ''

    cart.forEach((quantity, productId) => {
      const product = productsMap.get(+productId)
      const elem = document.createElement('li')
      elem.dataset.productId = productId
      elem.innerHTML = /* HTML */ `
        <h5 class="cart-item__name">${product.name}</h5>
        <div class="cart-item__price-info">
          <span class="cart-item__quantity">x${quantity}</span>
          <span class="cart-item__price"
            >@ ${currencyFormatter(product.price)}
            <span>${currencyFormatter(product.price * quantity)}</span></span
          >
        </div>
        <button data-action="delete" class="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            fill="none"
            viewBox="0 0 10 10"
          >
            <path
              fill="currentColor"
              d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"
            ></path>
          </svg>
        </button>
      `

      cartList.appendChild(elem)
    })
  }

  document.body.addEventListener('cart:add', ({ target }) => {
    const productId = target.dataset.productId
    cart.set(productId, 1)
    updateProductItemUI(productId)
    updateCartUI()
  })

  document.body.addEventListener('cart:increment', ({ target }) => {
    const productId = target.dataset.productId
    const currentQuantity = cart.get(productId)
    cart.set(productId, currentQuantity + 1)
    updateProductItemUI(productId)
    updateCartUI()
  })

  document.body.addEventListener('cart:decrement', ({ target }) => {
    const productId = target.dataset.productId
    const currentQuantity = cart.get(productId)

    if (currentQuantity > 1) {
      cart.set(productId, currentQuantity - 1)
    } else {
      cart.delete(productId)
    }
    updateProductItemUI(productId)
    updateCartUI()
  })

  document.body.addEventListener('cart:delete', ({ target }) => {
    const productId = target.dataset.productId
    cart.delete(productId)

    updateProductItemUI(productId)
    updateCartUI()
  })
})
