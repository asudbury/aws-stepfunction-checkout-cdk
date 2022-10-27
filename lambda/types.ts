interface CustomerDetails {
  customerId: any;
  customerName: string;
  paymentPref: string;
  email: string;
  mobile: string;
}

interface Price {
  itemNo: number;
  price: string;
  lastUpdated: string;
}

interface Order {
  orderNo: number;
  total: string;
  lastUpdated: string;
}

interface Payment {
  paymentNo: number;
  total: string;
  lastUpdated: string;
}
