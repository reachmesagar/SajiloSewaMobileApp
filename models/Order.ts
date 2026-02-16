import { Model } from '@nozbe/watermelondb';
import { text, field, } from '@nozbe/watermelondb/decorators';

export default class Order extends Model {
  static table = 'orders';

  @text('order_id') orderId!: string;
  @text('sender_name') senderName!: string;
  @text('recipient_name') recipientName!: string;
  @field('is_delivered') isDelivered!: boolean;
  @text('sender_location') senderLocation!: string;
  @field('is_COD') isCOD!: boolean; // New field for Cash on Delivery

  // Raw coordinate fields
  @field('sender_lat') senderLat!: number;
  @field('sender_lng') senderLng!: number;

  @text('receipt_location') receiptLocation?: string;
  @field('receipt_lat') receiptLat?: number;
  @field('receipt_lng') receiptLng?: number;

  @field('created_at') createdAt!: Date;
  @field('is_synced') isSynced!: boolean;

  // Helper Getter to return a 'Coordinates' object for the Map
  get senderCoords() {
    return { latitude: this.senderLat, longitude: this.senderLng };
  }

  get receiptCoords() {
    if (!this.receiptLat || !this.receiptLng) return null;
    return { latitude: this.receiptLat, longitude: this.receiptLng };
  }
}
