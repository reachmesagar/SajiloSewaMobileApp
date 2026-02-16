interface Coordinates {
  lat: number;
  lng: number;
}

interface Order {
  order_id: string;
  sender_name: string;
  recipient_name: string;
  is_delivered: boolean;
  sender_location: string;
  sender_coords: Coordinates;
  receipt_location?: string;
  receipt_coords?: Coordinates;
}

export const MOCK_ORDERS: Order[] = [
  {
    order_id: 'ORD-7721-X',
    sender_name: 'Aarav Sharma',
    recipient_name: 'Suman Gurung',
    sender_location: 'Koteshwor',
    sender_coords: { lat: 27.6756, lng: 85.3458 },
    is_delivered: true,
    receipt_location: 'Jhamsikhel',
    receipt_coords: { lat: 27.6791, lng: 85.3050 }
  },
  {
    order_id: 'ORD-4409-B',
    sender_name: 'Sita Thapa',
    recipient_name: 'Binod Adhikari',
    sender_location: 'Kalanki',
    sender_coords: { lat: 27.6938, lng: 85.2815 },
    is_delivered: false
  },
  {
    order_id: 'ORD-1256-Z',
    sender_name: 'Rohan Shrestha',
    recipient_name: 'Pema Lama',
    sender_location: 'Chabahil',
    sender_coords: { lat: 27.7174, lng: 85.3444 },
    is_delivered: false
  },
  {
    order_id: 'ORD-8832-M',
    sender_name: 'Kathmandu Crafts',
    recipient_name: 'Anjali Rai',
    sender_location: 'Thamel',
    sender_coords: { lat: 27.7149, lng: 85.3123 },
    is_delivered: false
  },
  {
    order_id: 'ORD-3310-L',
    sender_name: 'Patan Arts',
    recipient_name: 'Ishwar Shrestha',
    sender_location: 'Mangalbazar',
    sender_coords: { lat: 27.6732, lng: 85.3253 },
    is_delivered: true,
    receipt_location: 'Balkhu',
    receipt_coords: { lat: 27.6845, lng: 85.2910 }
  },
  {
    order_id: 'ORD-9004-Q',
    sender_name: 'Green Valley Organics',
    recipient_name: 'Dipendra Shah',
    sender_location: 'Budhanilkantha',
    sender_coords: { lat: 27.7667, lng: 85.3667 },
    is_delivered: false
  },
  {
    order_id: 'ORD-5567-P',
    sender_name: 'Samantha Joshi',
    recipient_name: 'Bibek Poudel',
    sender_location: 'Bhaktapur Durbar Square',
    sender_coords: { lat: 27.6722, lng: 85.4281 },
    is_delivered: true,
    receipt_location: 'Tinkune',
    receipt_coords: { lat: 27.6842, lng: 85.3435 }
  },
  {
    order_id: 'ORD-2218-W',
    sender_name: 'Bina Rai',
    recipient_name: 'Sandeep KC',
    sender_location: 'Lazimpat',
    sender_coords: { lat: 27.7222, lng: 85.3206 },
    is_delivered: false
  },
  {
    order_id: 'ORD-6641-K',
    sender_name: 'Victor Gurung',
    recipient_name: 'Maya Tamang',
    sender_location: 'Boudha',
    sender_coords: { lat: 27.7215, lng: 85.3620 },
    is_delivered: false
  },
  {
    order_id: 'ORD-1099-S',
    sender_name: 'Michael Scott',
    recipient_name: 'Rajesh Hamal',
    sender_location: 'New Baneshwor',
    sender_coords: { lat: 27.6915, lng: 85.3331 },
    is_delivered: false
  }
];