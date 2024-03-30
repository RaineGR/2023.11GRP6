async function processPayment() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/cart/products', {
      headers: {
        'Authorization': token,
      },
    });

    if (response.ok) {
      const products = await response.json();
      const total = products.reduce((sum, product) => sum + product.price, 0);

      const paypalOrderData = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: (total / 100).toFixed(2),
            },
          },
        ],
        application_context: {
          return_url: `${window.location.origin}/success.html`,
          cancel_url: `${window.location.origin}/cancel.html`,
        },
      };

      const paypalResponse = await fetch('http://localhost:3000/api/checkout/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify(paypalOrderData),
      });

      if (paypalResponse.ok) {
        const { orderId } = await paypalResponse.json();
        window.location.href = `https://www.paypal.com/checkoutnow?token=${orderId}`;
      } else {
        alert('Error al crear la orden de pago en PayPal');
      }
    } else {
      alert('Error al obtener los productos del carrito');
    }
  } catch (error) {
    console.error('Error al procesar el pago:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', processPayment);
  }
});