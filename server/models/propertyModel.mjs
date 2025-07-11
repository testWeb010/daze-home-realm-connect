
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
    index: true, // Add index for faster location-based queries
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['apartment', 'pg', 'singleroom'],
  },
  totalRooms: {
    type: Number,
    required: true,
  },
  totalRent: {
    type: Number,
    required: true,
  },
  preferedGender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other', 'any'],
  },
  images: [{
    type: String,
    required: true,
  }],
  amenities: [{
    type: String,
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  contactCount: {
    type: Number,
    default: 0,
  },
  rejectionReason: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
});

// Add indexes for frequently queried fields
propertySchema.index({ propertyType: 1 });
propertySchema.index({ totalRent: 1 });
propertySchema.index({ preferedGender: 1 });
propertySchema.index({ isActive: 1 });
propertySchema.index({ isVerified: 1 });
propertySchema.index({ featured: 1 });

// Add a compound index for common filter combinations
propertySchema.index({ 
  location: 1, 
  propertyType: 1, 
  totalRent: 1, 
  isActive: 1 
});

// Add text index for search functionality
propertySchema.index({
  title: 'text',
  description: 'text',
  location: 'text'
});

// Add instance method to get property details
propertySchema.methods.getPublicDetails = function() {
  return {
    id: this._id,
    title: this.title,
    location: this.location,
    propertyType: this.propertyType,
    totalRooms: this.totalRooms,
    totalRent: this.totalRent,
    preferedGender: this.preferedGender,
    images: this.images,
    amenities: this.amenities,
    views: this.views,
    featured: this.featured,
    isVerified: this.isVerified,
    createdAt: this.createdAt
  };
};

// Add method to increment views
propertySchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Add method to increment contact count
propertySchema.methods.incrementContactCount = function() {
  this.contactCount += 1;
  return this.save();
};

const Property = mongoose.model('Property', propertySchema);

export default Property;
