import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProperty extends Document {
  owner: Types.ObjectId;
  propertyName: string;
  location: string;
  streetAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  propertyType: 'Residential' | 'Commercial' | 'Land' | 'Special-purpose' | 'Vacation/Short-term rentals';
  specificType: string;
  price: number;
  space: number;
  bedrooms?: number;
  bathrooms?: number;
  images: string[];
  documents: Array<{
    name: string;
    url: string;
    verified: boolean;
    verifiedAt?: Date;
  }>;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationNotes?: string;
  listedOnDaobitat: boolean;
  daobitatListingId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema({
  owner: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  propertyName: { 
    type: String, 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  streetAddress: { 
    type: String, 
    required: true 
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  propertyType: { 
    type: String, 
    required: true,
    enum: ['Residential', 'Commercial', 'Land', 'Special-purpose', 'Vacation/Short-term rentals']
  },
  specificType: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  space: { 
    type: Number, 
    required: true 
  },
  bedrooms: Number,
  bathrooms: Number,
  images: [String],
  documents: [{
    name: { type: String, required: true },
    url: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verifiedAt: Date
  }],
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'], 
    default: 'pending' 
  },
  verificationNotes: String,
  listedOnDaobitat: { 
    type: Boolean, 
    default: false 
  },
  daobitatListingId: String
}, {
  timestamps: true
});

// Add indexes for common query patterns
PropertySchema.index({ owner: 1 });
PropertySchema.index({ verificationStatus: 1 });
PropertySchema.index({ listedOnDaobitat: 1 });

export const Property = mongoose.model<IProperty>('Property', PropertySchema);