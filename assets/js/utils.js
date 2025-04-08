
export function currencyFormatter(price) {
  return Intl.NumberFormat('es-us', {
    currency: 'USD',
    style: 'currency'
  }).format(price)
}

export async function getAllProducts() {
  return await fetch('../../data.json').then((res) => res.json())
}
