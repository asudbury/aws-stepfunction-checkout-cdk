exports.handler = async (
  event: { itemNo: number },
  context: any,
  callback: (arg0: null, arg1: Price) => void
) => {
  const itemNo = event.itemNo;
  console.log(`fetchPrice itemNo: ${itemNo}`);

  // TODO fetch price from database

  const price: Price = {
    itemNo: itemNo,
    price: '123.45',
    lastUpdated: '2022-06-12',
  };

  callback(null, price);
};
