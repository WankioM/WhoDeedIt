import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  walletAddress: string; // Primary identifier from World ID
  role?: 'lister' | 'agent' | 'buyer' | 'renter' | 'admin' | 'superadmin';
  profileImage?: string;
  verified?: {
    email?: boolean;
    phone?: boolean;
    wallet: boolean;
  };
  worldIdVerified: boolean;
  worldIdVerifiedAt?: Date;
  properties: Types.ObjectId[];
  wishlist?: Types.ObjectId[];
  loans?: Types.ObjectId[];
  rating?: number;
  reviews?: Types.ObjectId[];
  isBanned?: boolean;
  bannedReason?: string;
  bannedBy?: Types.ObjectId;
  bannedAt?: Date;
  isVerified?: boolean;
  verifiedAt?: Date;
  verifiedBy?: Types.ObjectId;
  isSuperAdmin?: boolean;
  adminPermissions?: {
    canFeatureProperty?: boolean;
    canBanUser?: boolean;
    canVerifyProperty?: boolean;
    canRemoveProperty?: boolean;
    canEditProperty?: boolean;
    canResolveDisputes?: boolean;
    canManageAdmins?: boolean;
    canViewReports?: boolean;
    canManageNotifications?: boolean;
    canSetPolicies?: boolean;
    canViewLogs?: boolean;
    canManageCategories?: boolean;
    canAddPropertyForUsers?: boolean;
  };
  lastLogin?: Date;
  lastPasswordChange?: Date;
  activityLog?: Array<{
    action: string;
    timestamp: Date;
    details?: any;
    ipAddress?: string;
  }>;
  notifications?: Array<{
    title: string;
    message: string;
    type: string;
    sentBy: Types.ObjectId;
    sentAt: Date;
    read: boolean;
  }>;
  searchHistory?: Array<{
    query: any;
    timestamp: Date;
  }>;
  searchPreferences?: {
    preferredLocations?: string[];
    preferredTypes?: string[];
    priceRange?: {
      min: number;
      max: number;
    };
    preferredAmenities?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    sparse: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    select: false // Won't be included in query results by default
  },
  phone: {
    type: String,
    sparse: true,
    trim: true
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['lister', 'agent', 'buyer', 'renter', 'admin', 'superadmin'],
    default: 'lister'
  },
  profileImage: String,
  verified: {
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    wallet: { type: Boolean, default: false }
  },
  worldIdVerified: {
    type: Boolean,
    default: false
  },
  worldIdVerifiedAt: Date,
  properties: [{
    type: Schema.Types.ObjectId,
    ref: 'Property'
  }],
  wishlist: [{
    type: Schema.Types.ObjectId,
    ref: 'Property',
    default: []
  }],
  loans: [{
    type: Schema.Types.ObjectId,
    ref: 'Loan'
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }],
  isBanned: {
    type: Boolean,
    default: false
  },
  bannedReason: String,
  bannedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  bannedAt: Date,
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  verifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  isSuperAdmin: {
    type: Boolean,
    default: false
  },
  adminPermissions: {
    canFeatureProperty: { type: Boolean, default: false },
    canBanUser: { type: Boolean, default: false },
    canVerifyProperty: { type: Boolean, default: false },
    canRemoveProperty: { type: Boolean, default: false },
    canEditProperty: { type: Boolean, default: false },
    canResolveDisputes: { type: Boolean, default: false },
    canManageAdmins: { type: Boolean, default: false },
    canViewReports: { type: Boolean, default: false },
    canManageNotifications: { type: Boolean, default: false },
    canSetPolicies: { type: Boolean, default: false },
    canViewLogs: { type: Boolean, default: false },
    canManageCategories: { type: Boolean, default: false },
    canAddPropertyForUsers: { type: Boolean, default: false }
  },
  lastLogin: Date,
  lastPasswordChange: Date,
  activityLog: [{
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    details: Schema.Types.Mixed,
    ipAddress: String
  }],
  notifications: [{
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'success', 'warning', 'error', 'system'], default: 'info' },
    sentBy: { type: Schema.Types.ObjectId, ref: 'User' },
    sentAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }],
  searchHistory: [{
    query: { type: Schema.Types.Mixed, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  searchPreferences: {
    preferredLocations: [String],
    preferredTypes: [String],
    priceRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 }
    },
    preferredAmenities: [String]
  }
}, {
  timestamps: true
});

// Create index on walletAddress for efficient lookups
userSchema.index({ walletAddress: 1 });

export const User = mongoose.model<IUser>('User', userSchema);