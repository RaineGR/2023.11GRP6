import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }

    if (cart.products.includes(productId)) {
      return res.status(400).json({ message: 'El producto ya está en el carrito' });
    }

    cart.products.push(productId);
    await cart.save();

    res.json({ message: 'Producto agregado al carrito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el producto al carrito' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    cart.products = cart.products.filter(
      (productInCartId) => productInCartId.toString() !== productId
    );

    await cart.save();

    res.json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto del carrito' });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId }).populate('products');

    if (!cart) {
      return res.json([]);
    }

    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos del carrito' });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    cart.products = [];
    await cart.save();

    res.json({ message: 'Carrito vaciado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al vaciar el carrito' });
  }
};