import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'orders',
      columns: [
        { name: 'order_id', type: 'string', isIndexed: true },
        { name: 'sender_name', type: 'string' },
        { name: 'recipient_name', type: 'string' },
        { name: 'is_delivered', type: 'boolean' },
        { name: 'sender_location', type: 'string' },
        // Coordinates are stored as individual numbers
        { name: 'sender_lat', type: 'number' },
        { name: 'sender_lng', type: 'number' },
        { name: 'receipt_location', type: 'string', isOptional: true },
        { name: 'receipt_lat', type: 'number', isOptional: true },
        { name: 'receipt_lng', type: 'number', isOptional: true },
        { name: 'is_COD', type: 'boolean' }, // New field for Cash on Delivery,
        { name: 'is_synced', type: 'boolean' },
      ],
    }),
  ],
});
