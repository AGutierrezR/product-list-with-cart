import { $, getAllProducts, currencyFormatter } from './utils.js'

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

  const productListElem = $('[data-selector="product-list"]')
  const cartList = $('[data-selector="cart-list"]')

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
            class="product-item__button button"
            data-button-variant="secondary"
            data-action="add"
            data-alignment="center"
            type="button"
          >
            <svg viewbox="0 0 21 20" class="icon icon--add-to-cart">
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
          <small>${element.category}</small>
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
   * TODO: Something
   */
  function updateProductItemUI(productId) {
    const itemElement = productListElem.find(`[data-product-id="${productId}"]`)
    const addButton = itemElement.find('[data-action="add"]')
    const quantityControlsWrap = itemElement.find('[data-quantity-controls]')
    const quantityDisplay = itemElement.find('[data-quantity]')
    const image = itemElement.find('picture')

    if (cart.has(productId)) {
      addButton.hidden = true
      quantityControlsWrap.hidden = false
      quantityDisplay.innerText = cart.get(productId).quantity
      image.dataset.status = 'selected'
    } else {
      addButton.hidden = false
      quantityControlsWrap.hidden = true
      quantityDisplay.innerText = ''
      image.dataset.status = ''
    }
  }

  function updateCartUI() {
    const cartItemQty = $('[data-selector="cart-items-quantity"]')
    const cartEmpty = $('[data-selector="cart-empty"]')
    const cartList = $('[data-selector="cart-list"]')
    const cartContainer = cartList.closest('[data-selector="cart-content"]')
    const cartTotalElem = $('[data-selector="cart-total"]')
    const cartTotalPrice = cart
      .values()
      .reduce((acc, item) => acc + item.quantity * item.price, 0)
    const cartTotalQty =
      cart.values().reduce((acc, num) => acc + num.quantity, 0) || 0

    cartItemQty.textContent = cartTotalQty

    if (cart.size > 0) {
      cartContainer.hidden = false
      cartEmpty.hidden = true
    } else {
      cartContainer.hidden = true
      cartEmpty.hidden = false
    }

    cartList.innerHTML = ''

    cart.forEach((item) => {
      const elem = document.createElement('li')
      elem.dataset.productId = item.id
      elem.innerHTML = /* HTML */ `
        <div class="cart-item text-sm">
          <h3 class="cart-item__name text-sm">${item.name}</h3>
          <div class="cart-item__price-info cluster">
            <span class="cart-item__quantity text-primary font-600"
              >x${item.quantity}</span
            >
            <span class="cart-item__price"
              >@ ${currencyFormatter(item.price)}
              <span class="font-600"
                >${currencyFormatter(item.price * item.quantity)}</span
              ></span
            >
          </div>
          <button data-action="delete">
            <svg class="icon icon--remove">
              <use href="#:remove" />
            </svg>
          </button>
        </div>
      `

      cartList.appendChild(elem)
    })

    cartTotalElem.textContent = currencyFormatter(cartTotalPrice)
  }

  document.body.addEventListener('cart:add', ({ target }) => {
    const productId = target.dataset.productId
    cart.set(productId, { ...productsMap.get(+productId), quantity: 1 })
    updateProductItemUI(productId)
    updateCartUI()
  })

  document.body.addEventListener('cart:increment', ({ target }) => {
    const productId = target.dataset.productId
    const cartItem = cart.get(productId)
    const currentQuantity = cartItem.quantity
    cart.set(productId, { ...cartItem, quantity: currentQuantity + 1 })
    updateProductItemUI(productId)
    updateCartUI()
  })

  document.body.addEventListener('cart:decrement', ({ target }) => {
    const productId = target.dataset.productId
    const cartItem = cart.get(productId)
    const currentQuantity = cartItem.quantity

    if (currentQuantity > 1) {
      cart.set(productId, { ...cartItem, quantity: currentQuantity - 1 })
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
