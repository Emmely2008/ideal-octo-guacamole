require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const statusCode = 200;
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
};

exports.handler = async function (event) {
  // We only care to do anything if this is our POST request.
  if (event.httpMethod !== "POST") {
    return {
      statusCode,
      headers,
      body: "This was not a POST request!",
    };
  }

  // Parse the body contents into an object.
  const data = JSON.parse(event.body);

  // Make sure we have all required data. Otherwise, get outta here.
  if (!data.description || !data.amount || !data.id || !data.description) {
    const message = "Required information is missing!";

    console.error(message);

    return {
      statusCode,
      headers,
      body: JSON.stringify({
        status: "failed",
        message,
      }),
    };
  }

  let { amount, currency, description, id } = data;
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
      payment_method: id,
    });
    console.log("Payment", payment);
    res.json({ payment });
    return {
      statusCode,
      headers,
      body: JSON.stringify({
        payment,
      }),
    };
  } catch (e) {
    console.error(e.message);

    return {
      statusCode: 424,
      headers,
      body: JSON.stringify({
        status: "failed",
        message: e.message,
      }),
    };
  }
};
