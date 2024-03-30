import Product from '../models/productModel.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;

    console.log('Datos recibidos del cliente:', req.body);

    // Crear un nuevo precio en Stripe
    const priceData = await stripe.prices.create({
      unit_amount: price * 100, 
      currency: 'usd',
      product_data: {
        name: title,
        metadata: {
          description, 
        },
      },
    });

    console.log('Datos del precio creado en Stripe:', priceData);

    const product = new Product({
      title,
      description,
      price,
      category,
      stripeId: priceData.id,
    });

    console.log('Objeto de producto antes de guardar:', product);

    await product.save();
    res.status(201).json({ message: 'Producto creado exitosamente' });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ message: 'Error al crear el producto' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { title, description, price, category } = req.body;

    // Actualizar el precio en Stripe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const priceData = await stripe.prices.update(
      product.stripeId,
      {
        unit_amount: price * 100,
        product_data: {
          name: title,
          description,
        },
      }
    );

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { title, description, price, category, stripeId: priceData.id },
      { new: true }
    );

    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Eliminar el precio en Stripe
    await stripe.prices.del(product.stripeId);

    await Product.findByIdAndDelete(productId);
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
};