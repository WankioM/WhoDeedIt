// src/types/property.ts
export type PropertyFormData = {
    propertyName: string;
    location: string;
    streetAddress: string;
    propertyType: "Residential" | "Commercial" | "Land" | "Special-purpose" | "Vacation/Short-term rentals";
    specificType: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    space: number;
    description: string;
    action: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    images: string[];
  };