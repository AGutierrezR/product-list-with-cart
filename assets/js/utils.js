export function $(selector, context = document) {
  const el = context.querySelector(selector);
  if (!el) return null;

  // Agrega el método .find al elemento retornado
  Object.defineProperty(el, 'find', {
    value(innerSelector) {
      return $(innerSelector, el);
    },
    writable: false,
    enumerable: false, // Oculta .find en console.log()
    configurable: true
  });

  return el;
}

export function currencyFormatter(price) {
  return Intl.NumberFormat('es-us', {
    currency: 'USD',
    style: 'currency'
  }).format(price)
}

export async function getAllProducts() {
  return await fetch('../../data.json').then((res) => res.json())
}
