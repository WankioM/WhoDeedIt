import { Request, Response } from 'express';
import { Property, IProperty } from '../../models/property';
import { User, IUser } from '../../models/user';
import mongoose, { HydratedDocument } from 'mongoose';
import axios from 'axios';

// Define a type that includes populated user fields
interface PropertyWithPopulatedOwner extends Omit<IProperty, 'owner'> {
  owner: {
    _id: mongoose.Types.ObjectId;
    name?: string;
    walletAddress: string;
    profileImage?: string;
    worldIdVerified: boolean;
  }
}

// Daobitat API details would come from environment variables in production
const DAOBITAT_API_URL = process.env.DAOBITAT_API_URL || 'https://api.daobitat.com';
const DAOBITAT_API_KEY = process.env.DAOBITAT_API_KEY || 'dev-api-key';

export class PropertyController {
  /**
   * Get a single property by ID
   * @param req Express request
   * @param res Express response
   */
  async getProperty(req: Request, res: Response) {
    try {
      const propertyId = req.params.id;
      
      // Find the property and populate owner details
      const property = await Property.findById(propertyId)
        .populate<PropertyWithPopulatedOwner>({
          path: 'owner',
          select: 'name walletAddress profileImage worldIdVerified'
        });
      
      if (!property) {
        return res.status(404).json({ 
          status: 'error', 
          message: 'Property not found' 
        });
      }
      
      res.status(200).json({ 
        status: 'success', 
        data: property
      });
    } catch (error) {
      console.error('Error in getProperty:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ 
        status: 'error', 
        message: errorMessage 
      });
    }
  }

  /**
   * Create a new property
   * @param req Express request
   * @param res Express response
   */
  async createProperty(req: Request, res: Response) {
    try {
      // Check if user is authenticated
      if (!req.user?._id) {
        return res.status(401).json({ 
          status: 'error', 
          message: 'User not authenticated' 
        });
      }
      
      // Create new property with user as owner
      const newProperty = new Property({
        ...req.body,
        owner: req.user._id
      });
      
      await newProperty.save();
      
      res.status(201).json({ 
        status: 'success', 
        message: 'Property created successfully',
        data: newProperty
      });
    } catch (error) {
      console.error('Error in createProperty:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ 
        status: 'error', 
        message: errorMessage 
      });
    }
  }

  /**
   * Update a property
   * @param req Express request
   * @param res Express response
   */
  async updateProperty(req: Request, res: Response) {
    try {
      // Check if user is authenticated
      if (!req.user?._id) {
        return res.status(401).json({ 
          status: 'error', 
          message: 'User not authenticated' 
        });
      }
      
      const propertyId = req.params.id;
      
      // Find the property and verify ownership
      const property = await Property.findOne({
        _id: propertyId,
        owner: req.user._id
      });
      
      if (!property) {
        return res.status(404).json({ 
          status: 'error', 
          message: 'Property not found or you do not have permission to update it' 
        });
      }
      
      // Don't allow updating certain fields
      const protectedFields = ['owner', 'verificationStatus', 'verificationNotes', 'listedOnDaobitat', 'daobitatListingId'];
      const updateData = { ...req.body };
      
      protectedFields.forEach(field => {
        delete updateData[field];
      });
      
      // Update the property
      Object.assign(property, updateData);
      await property.save();
      
      res.status(200).json({ 
        status: 'success', 
        message: 'Property updated successfully',
        data: property
      });
    } catch (error) {
      console.error('Error in updateProperty:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ 
        status: 'error', 
        message: errorMessage 
      });
    }
  }

  /**
   * Get all properties belonging to the current user
   * @param req Express request
   * @param res Express response
   */
  async getUserProperties(req: Request, res: Response) {
    try {
      // Check if user is authenticated
      if (!req.user?._id) {
        return res.status(401).json({ 
          status: 'error', 
          message: 'User not authenticated' 
        });
      }
      
      // Find all properties owned by the user
      const properties = await Property.find({
        owner: req.user._id
      }).sort({ createdAt: -1 });
      
      res.status(200).json({ 
        status: 'success', 
        data: properties
      });
    } catch (error) {
      console.error('Error in getUserProperties:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ 
        status: 'error', 
        message: errorMessage 
      });
    }
  }

  /**
   * Add a document to a property
   * @param req Express request
   * @param res Express response
   */
  async addPropertyDocument(req: Request, res: Response) {
    try {
      // Check if user is authenticated
      if (!req.user?._id) {
        return res.status(401).json({ 
          status: 'error', 
          message: 'User not authenticated' 
        });
      }
      
      const propertyId = req.params.id;
      const { name, url } = req.body;
      
      if (!name || !url) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'Document name and URL are required' 
        });
      }
      
      // Find the property and verify ownership
      const property = await Property.findOne({
        _id: propertyId,
        owner: req.user._id
      });
      
      if (!property) {
        return res.status(404).json({ 
          status: 'error', 
          message: 'Property not found or you do not have permission to add documents' 
        });
      }
      
      // Add the document to the property
      property.documents.push({
        name,
        url,
        verified: false
      });
      
      await property.save();
      
      res.status(200).json({ 
        status: 'success', 
        message: 'Document added successfully',
        data: property
      });
    } catch (error) {
      console.error('Error in addPropertyDocument:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ 
        status: 'error', 
        message: errorMessage 
      });
    }
  }

  /**
   * Get verification status for a property
   * @param req Express request
   * @param res Express response
   */
  async getVerificationStatus(req: Request, res: Response) {
    try {
      // Check if user is authenticated
      if (!req.user?._id) {
        return res.status(401).json({ 
          status: 'error', 
          message: 'User not authenticated' 
        });
      }
      
      const propertyId = req.params.id;
      
      // Find the property and verify ownership
      const property = await Property.findOne({
        _id: propertyId,
        owner: req.user._id
      });
      
      if (!property) {
        return res.status(404).json({ 
          status: 'error', 
          message: 'Property not found or you do not have permission to view it' 
        });
      }
      
      res.status(200).json({ 
        status: 'success', 
        data: {
          propertyId: property._id,
          verificationStatus: property.verificationStatus,
          verificationNotes: property.verificationNotes,
          documents: property.documents.map(doc => ({
            // Safely access _id using type assertion
            id: (doc as any)._id?.toString(),
            name: doc.name,
            verified: doc.verified,
            verifiedAt: doc.verifiedAt
          })),
          listedOnDaobitat: property.listedOnDaobitat,
          daobitatListingId: property.daobitatListingId
        }
      });
    } catch (error) {
      console.error('Error in getVerificationStatus:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ 
        status: 'error', 
        message: errorMessage 
      });
    }
  }

  /**
   * Submit verified property to Daobitat
   * @param req Express request
   * @param res Express response
   */
  async submitToDaobitat(req: Request, res: Response) {
    try {
      // Check if user is authenticated
      if (!req.user?._id) {
        return res.status(401).json({ 
          status: 'error', 
          message: 'User not authenticated' 
        });
      }
      
      const propertyId = req.params.id;
      
      // Find the property and verify ownership
      // Explicitly populate the owner field with the required fields
      const property = await Property.findOne({
        _id: propertyId,
        owner: req.user._id
      }).populate<PropertyWithPopulatedOwner>({
        path: 'owner',
        select: 'name walletAddress profileImage worldIdVerified'
      });
      
      if (!property) {
        return res.status(404).json({ 
          status: 'error', 
          message: 'Property not found or you do not have permission to submit it' 
        });
      }
      
      // Check if property is verified
      if (property.verificationStatus !== 'verified') {
        return res.status(403).json({ 
          status: 'error', 
          message: 'Property must be verified before submitting to Daobitat' 
        });
      }
      
      // Check if property is already listed
      if (property.listedOnDaobitat) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'Property is already listed on Daobitat' 
        });
      }
      
      // Prepare property data for Daobitat
      const daobitatProperty = {
        propertyName: property.propertyName,
        location: property.location,
        streetAddress: property.streetAddress,
        coordinates: property.coordinates,
        propertyType: property.propertyType,
        specificType: property.specificType,
        price: property.price,
        space: property.space,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        images: property.images,
        // Now properly access these optional fields
        amenities: (property as any).amenities || {},
        features: (property as any).features || [],
        // Now properly access the owner's walletAddress
        owner: property.owner.walletAddress,
        verified: true,
        verificationMethod: 'WhoDeedIt',
        verificationDocuments: property.documents
          .filter(doc => doc.verified)
          .map(doc => ({
            name: doc.name,
            url: doc.url
          }))
      };
      
      try {
        // Make API call to Daobitat
        const response = await axios.post(
          `${DAOBITAT_API_URL}/properties`, 
          daobitatProperty,
          {
            headers: {
              'Authorization': `Bearer ${DAOBITAT_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Update property with Daobitat listing ID
        property.listedOnDaobitat = true;
        property.daobitatListingId = response.data.propertyId;
        await property.save();
        
        res.status(200).json({ 
          status: 'success', 
          message: 'Property successfully listed on Daobitat',
          data: {
            property,
            daobitatListingId: response.data.propertyId
          }
        });
      } catch (apiError) {
        console.error('Error submitting to Daobitat API:', apiError);
        res.status(500).json({ 
          status: 'error', 
          message: 'Failed to submit property to Daobitat API. Please try again later.'
        });
      }
    } catch (error) {
      console.error('Error in submitToDaobitat:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ 
        status: 'error', 
        message: errorMessage 
      });
    }
  }
}

// Export a singleton instance
export default new PropertyController();