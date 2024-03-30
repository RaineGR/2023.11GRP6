async function renderPurchasedProducts() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/purchases', {
      headers: {
        'Authorization': token,
      },
    });

    if (response.ok) {
      const orders = await response.json();
      const purchasedProducts = document.getElementById('purchasedProducts');

      if (orders.length === 0) {
        purchasedProducts.innerHTML = '<p>No hay productos comprados</p>';
        return;
      }

      const latestOrder = orders[orders.length - 1];
      purchasedProducts.innerHTML = `
        <h3>Productos Comprados:</h3>
        <ul>
          ${latestOrder.products.map(product => `<li>${product.title} - $${product.price / 100}</li>`).join('')}
        </ul>
      `;
    } else {
      alert('Error al obtener las órdenes de compra');
    }
  } catch (error) {
    console.error('Error al obtener las órdenes de compra:', error);
  }
}  

document.addEventListener('DOMContentLoaded', () => {
  renderPurchasedProducts();
});