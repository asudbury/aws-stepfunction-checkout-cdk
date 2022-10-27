exports.handler = (
  event: any,
  context: any,
  callback: (arg0: null, arg1: Order) => void
) => {
  console.log('completeOrder');

  // TODO complete order

  const order: Order = {
    orderNo: 1111,
    total: '123.45',
    lastUpdated: '2022-06-12',
  };

  callback(null, order);
};
