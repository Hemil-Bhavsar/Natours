const Stripe = require('stripe');
const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // console.log(req);
  //2)Create Checkout Session
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // mode: ['card'],
    //
    success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        // name: `${tour.name} Tour`,
        // description: tour.summary,
        // images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        // amount: tour.price * 100,
        // currency: 'usd',
        price_data: {
          currency: 'INR',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${
                tour.imageCover
              }`,
            ],
          },
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  });

  //3)Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout=catchAsync( async(req,res,next)=>{
  const {tour,user,price}=req.query;

  if(!tour && !user && !price) return next();
  await Booking.create({tour,user,price})

  res.redirect(req.originalUrl.split('?')[0])
})

exports.createBooking=factory.createOne(Booking)
exports.getBooking=factory.getOne(Booking)
exports.getAllBookings=factory.getAll(Booking)
exports.updateBooking=factory.updateOne(Booking)
exports.deleteBooking=factory.deleteOne(Booking)