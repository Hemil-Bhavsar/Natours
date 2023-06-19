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
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // window.location.replace(session.data.session.url)
    //2) Stripe object to create checkout form + charge credit card for us

    console.log('session ====>', session);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
