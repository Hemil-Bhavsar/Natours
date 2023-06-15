import axios from 'axios';
import { showAlert } from './alerts';
import { loadStripe } from '@stripe/stripe-js';

const Stripe = require('stripe');

// const stripe = Stripe('pk_test_5*********************************');

export const bookTour = async (tourId) => {
  const stripe = await loadStripe(
    'pk_test_51NI8yISGJMQnUI1iSvLnOEwZDqsHvLEqjsrL2ML6xhpZFIUBsTrbI1YcDUUUUvFLVnXGPZvkjYvY3kD2g9KW15Aa00sYgyZ911'
  );

  try {
    //1) Get Checkout session
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    //2) Stripe object to create checkout form + charge credit card for us

    // console.log(session);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
