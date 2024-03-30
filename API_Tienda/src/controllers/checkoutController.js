import paypal from '@paypal/checkout-server-sdk';
import Order from '../models/orderModel.js';
import {
  PAYPAL_API_CLIENT,
  PAYPAL_API_SECRET,
} from '../config.js';

const environment = new paypal.core.SandboxEnvironment(
  PAYPAL_API_CLIENT,
  PAYPAL_API_SECRET
);

const client = new paypal.core.PayPalHttpClient(environment);

export const createPaypalOrder = async (req, res) => {
  try {
    const { purchase_units, application_context } = req.body;
    console.log('Datos recibidos en createPaypalOrder:', req.body);

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units,
      application_context,
    });

    console.log('Solicitud a PayPal:', request);

    const order = await client.execute(request);

    console.log('Respuesta de PayPal:', order.result);

    res.json({ orderId: order.result.id });
  } catch (error) {
    console.error('Error al crear la orden de pago en PayPal:', error);
    res.status(500).json({ message: 'Error al crear la orden de pago en PayPal' });
  }
};

export const capturePaypalOrder = async (req, res) => {
  try {
    const { orderId } = req.query;

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.prefer('return=representation');

    const capture = await client.execute(request);

    const { purchase_units } = capture.result;

    const order = new Order({
      user: req.user.userId,
      products: [], // Aquí deberías agregar los productos comprados
      total: purchase_units[0].amount.value * 100, // Convertir a centavos
      status: 'Pagado',
    });

    await order.save();

    res.json({ message: 'Pago procesado exitosamente' });
  } catch (error) {
    console.error('Error al capturar la orden de pago en PayPal:', error);
    res.status(500).json({ message: 'Error al procesar el pago' });
  }
};