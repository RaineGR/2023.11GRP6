import Order from '../models/orderModel.js';

export const getPurchases = async (req, res) => {
  try {
    const { userId } = req.user;
    const orders = await Order.find({ user: userId }).populate('products');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las compras' });
  }
};

export const getPurchaseStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Orden de compra no encontrada' });
    }
    res.json({ status: order.status });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el estado de la compra' });
  }
};