/**
 * Utility functions for DOM manipulation and data formatting.
 * @param {string} selector - The CSS selector to match.
 * @param {HTMLElement} [context=document] - The context in which to search for the selector.
 * @returns {HTMLElement|null} The first element matching the selector, or null if not found.
 */
export function $(selector, context = document) {
  const el = context.querySelector(selector)
  if (!el) return null

  // Add the .find method to the returned element
  Object.defineProperty(el, 'find', {
    value(innerSelector) {
      return $(innerSelector, el)
    },
    writable: false,
    enumerable: false, // Hide .find in console.log()
    configurable: true,
  })

  return el
}

/**
 * Formats a price as a currency string.
 * @param {number} price - The price to format.
 * @returns {string} The formatted price string.
 */
export function currencyFormatter(price) {
  return Intl.NumberFormat('es-us', {
    currency: 'USD',
    style: 'currency',
  }).format(price)
}

/**
 * @typedef {Object} ProductImage
 * @property {string} thumbnail - Path to thumbnail image
 * @property {string} mobile - Path to mobile-sized image
 * @property {string} tablet - Path to tablet-sized image
 * @property {string} desktop - Path to desktop-sized image
 */

/**
 * @typedef {Object} Product
 * @property {number} id - Unique identifier for the product
 * @property {ProductImage} image - Object containing various image sizes
 * @property {string} name - Name of the product
 * @property {string} category - Product category
 * @property {number} price - Product price
 */

/**
 * Fetches all products from the server.
 * * @returns {Promise<Product[]>} A promise that resolves to an array of product objects.
 */
export async function getAllProducts() {
  return await fetch('../../data.json').then((res) => res.json())
}
