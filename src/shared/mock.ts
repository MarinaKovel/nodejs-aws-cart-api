export const cart = [
  {
    product: {
      id: '0e121f52-0864-4365-9fae-8ec39506f421',
      title: 'Easel Studio A Frame La Palma',
      description:
        'Tripod easel model Pine, an economical A-shaped easel, foldable with 3 legs.',
      price: 60,
    },
    count: 2,
  },
  {
    product: {
      id: '0a199426-2bbf-4f57-93bf-0921ae620287',
      title: 'Canvas Slim Elite 30x30cm',
      description:
        'Professional Quality 100% cotton, 300gm weight, acrylic primed and suitable for oil, acrylic and alkyd painters.',
      price: 10,
    },
    count: 2,
  },
  {
    product: {
      id: '3413f39e-2a78-459f-870b-1fd33c080da0',
      title: 'Georgian Set 22ml Starter 6pk',
      description:
        'A set of six 22ml tubes. An ideal colour range to get started in oil painting.',
      price: 21,
    },
    count: 2,
  },
];

export const order = [
  {
    id: '50eebc99-9c0b-4ef8-bb6d-6bb9bd380aa2',
    userId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    cartId: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
    address: {
      address: '456 Oak St',
      firstName: 'John',
      lastName: 'Doe',
      comment: 'Evening',
    },
    statusHistory: [],
    items: [
      {
        count: 5,
        productId: '0e121f52-0864-4365-9fae-8ec39506f421',
      },
    ],
  },
  {
    id: '40eebc99-9c0b-4ef8-bb6d-6bb9bd380aa1',
    userId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    cartId: 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
    address: {
      address: '456 Oak St',
      firstName: 'John',
      lastName: 'Doe',
      comment: 'Evening',
    },
    statusHistory: [],
    items: [
      {
        count: 4,
        productId: '9c537713-2ca8-4dce-b3ca-21af2530c286',
      },
    ],
  },
];
