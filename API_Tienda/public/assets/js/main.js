// Función para obtener los cursos desde el backend
async function getProducts() {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
  }
}

function renderProducts(products) {
  const productList = document.getElementById('productList');
  if (productList) {
    productList.innerHTML = '';

    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'col-md-4 mb-4';
      productCard.innerHTML = `
        <div class="card">
          <img src="${product.image}" class="card-img-top" alt="${product.title}">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">Precio: $${product.price}</p>
            <button class="btn btn-primary btn-add-to-cart" data-product-id="${product._id}">Agregar al carrito</button>
          </div>
        </div>
      `;
      productList.appendChild(productCard);
    });

    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        addProductToCart(productId);
      });
    });
  }
}

// Función para manejar el inicio de sesión
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      window.location.href = 'index.html'; // Redirige al index después de iniciar sesión
    } else {
      alert('Credenciales inválidas');
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
  }
}

// Función para manejar el registro
async function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    if (response.ok) {
      alert('Registro exitoso. Por favor, inicia sesión.');
      window.location.href = 'login.html';
    } else {
      alert('Error al registrar usuario');
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error);
  }
}

// Función para manejar el cierre de sesión
function handleLogout() {
  localStorage.removeItem('token');
  updateAuthState();
  clearCart();
}

async function clearCart() {
  const token = localStorage.getItem('token');
  if (!token) {
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/cart/clear', {
      method: 'DELETE',
      headers: {
        'Authorization': token,
      },
    });

    if (response.ok) {
      await getCartCount();
    }
  } catch (error) {
    console.error('Error al vaciar el carrito:', error);
  }
}
// Función para obtener el nombre de usuario
function getUserName() {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = decodeToken(token);
    return decodedToken.name;
  }
  return '';
}

// Función para decodificar el token JWT
function decodeToken(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

async function addProductToCart(productId) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Debes iniciar sesión para agregar productos al carrito');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/cart/add/${productId}`, {
      method: 'POST',
      headers: {
        'Authorization': token,
      },
    });

    if (response.ok) {
      await getCartCount();
      alert('Producto agregado al carrito');
    } else if (response.status === 400) {
      alert('El producto ya está en el carrito');
    } else {
      alert('Error al agregar el producto al carrito');
    }
  } catch (error) {
    console.error('Error al agregar el producto al carrito:', error);
  }
}

async function getCartCount() {
  const token = localStorage.getItem('token');
  if (!token) {
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
      const cartCount = document.getElementById('cartCount');
      if (cartCount) {
        cartCount.textContent = products.length;
      }
    }
  } catch (error) {
    console.error('Error al obtener el conteo del carrito:', error);
  }
}

async function renderCartProducts() {
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
      const cartProducts = document.getElementById('cartProducts');
      const cartTotal = document.getElementById('cartTotal');
      let total = 0;

      cartProducts.innerHTML = '';

      if (products.length === 0) {
        window.location.href = 'index.html';
        return;
      }

      products.forEach((product) => {
        total += product.price;

        const productElement = document.createElement('div');
        productElement.innerHTML = `
          <h5>${product.title}</h5>
          <p>Precio: $${product.price}</p>
          <button class="btn btn-danger btn-remove-from-cart" data-product-id="${product._id}">Eliminar</button>
          <hr>
        `;
        cartProducts.appendChild(productElement);
      });

      cartTotal.textContent = total;
    } else {
      alert('Error al obtener los productos del carrito');
    }
  } catch (error) {
    console.error('Error al obtener los productos del carrito:', error);
  }

  const removeFromCartButtons = document.querySelectorAll('.btn-remove-from-cart');
  removeFromCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      removeProductFromCart(productId);
    });
  });
}

async function removeProductFromCart(productId) {
  const token = localStorage.getItem('token');
  if (!token) {
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token,
      },
    });

    if (response.ok) {
      await getCartCount();
      await renderCartProducts();
    } else {
      alert('Error al eliminar el producto del carrito');
    }
  } catch (error) {
    console.error('Error al eliminar el producto del carrito:', error);
  }
}
// Función para mostrar u ocultar elementos según el estado de autenticación
function updateAuthState() {
  const token = localStorage.getItem('token');
  const userLink = document.getElementById('userLink');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginLink = document.getElementById('loginLink');

  if (token) {
    const decodedToken = decodeToken(token);
    if (userLink) {
      userLink.querySelector('#username').textContent = decodedToken.name;
      userLink.style.display = 'block';
    }
    if (logoutBtn) {
      logoutBtn.style.display = 'block';
    }
    if (loginLink) {
      loginLink.style.display = 'none';
    }
  } else {
    if (userLink) {
      userLink.style.display = 'none';
    }
    if (logoutBtn) {
      logoutBtn.style.display = 'none';
    }
    if (loginLink) {
      loginLink.style.display = 'block';
    }
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const userLink = document.getElementById('userLink');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  updateAuthState(); // Llamar a la función para actualizar el estado de autenticación al cargar la página

  getCartCount();
 

  const productList = document.getElementById('productList');
  if (productList) {
    getProducts();
  }

  const cartProducts = document.getElementById('cartProducts');
  if (cartProducts) {
    renderCartProducts();
  }

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      alert('Pago realizado con éxito');
      // Aquí puedes agregar la lógica para procesar el pago
    });
  }

});

// Escuchar el evento 'storage' para detectar cambios en el localStorage
window.addEventListener('storage', () => {
  updateAuthState(); // Llamar a la función para actualizar el estado de autenticación cuando hay cambios en el localStorage
});
