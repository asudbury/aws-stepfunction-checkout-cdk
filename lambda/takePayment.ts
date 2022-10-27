exports.handler = (
  event: any,
  context: any,
  callback: (arg0: null, arg1: Payment) => void
) => {
  console.log('takePayment');

  // TODO take payment

  const payment: Payment = {
    paymentNo: 1111,
    total: '123.45',
    lastUpdated: '2022-06-12',
  };

  callback(null, payment);
};
