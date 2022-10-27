exports.handler = async (
  event: { customerId: number },
  context: any,
  callback: (arg0: null, arg1: CustomerDetails) => void
) => {
  console.log(`fetchCustomerDetails customerId: ${event.customerId}`);

  // TODO fetch from database

  const customerDetails: CustomerDetails = {
    customerId: event.customerId,
    customerName: 'John Doe',
    paymentPref: 'Credit Card',
    email: 'john.doe@yahoo.com',
    mobile: '677896678',
  };

  callback(null, customerDetails);
};
