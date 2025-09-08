import mongoose, { Document, Schema } from 'mongoose';

export interface IStore extends Document {
  _id: string;
  name: string;
  description: string;
  address: string;
  locality: string;
  phone: string;
  email: string;
  owner: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StoreSchema = new Schema<IStore>({
  name: {
    type: String,
    required: [true, 'Store name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  locality: {
    type: String,
    required: [true, 'Locality is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

StoreSchema.index({ locality: 1 });
StoreSchema.index({ owner: 1 });
StoreSchema.index({ name: 'text', description: 'text' });

export default mongoose.models.Store || mongoose.model<IStore>('Store', StoreSchema);
