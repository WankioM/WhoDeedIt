

Start new chat
Projects
Chats
Recents
Troubleshooting MiniKit integration on Vercel
Decentralized Real Estate Platform with Blockchain Verification
Resolving TypeScript Path Alias Issues
💬 I am creating an app "This i...
Fixing PropertyRoutes Errors
Permissive Verification for Property Listing App
Implementing Missing WhoDeedIt Sidebar Component
Untitled
Resolving TypeScript Errors in Login Component
Debugging WhoDeedIt App Architecture
Resolving "require is not defined" error in TypeScript ES Module
WhoDeedIt: Decentralized Identity and Property Verification
Add KYC and Wallet Links to Footer
Resolving npm dependency conflicts for WhoDeedIt
Resolving TypeScript Errors in DAO-Bitat Offer Management
Fixing Authorization Errors in DAO-Bitat Counter-Offer Flow
DAO-Bitat Offer Negotiation Flow
Untitled
Fixing TypeScript Errors in Property Components
Decentralized Property Listing Platform with Blockchain Transactions
Implementing Redux for Order Status Tracking
Resolving Undefined WebSocket Token Error
Distributor Return Request Customization
Enhanced Offer Cards and Payment Confirmation Flow
Resolving Import Conflicts in Payment Routes
Rental Offer Management Controller Endpoints
Decentralized Property Listing Platform DAO-Bitat
Decentralized Property Listing Platform with Blockchain-Powered Transactions
Fetching All Products with Pagination
Untitled
View all
Professional plan

T
tracywankio29@gmail.com
T

All projects


WhoDeedIt
Private






Choose style
WhoDeedIt
No file chosen



Who are you? My name is Tracy. Before I was a Web3 developer, I was an architect. And I got to witness cracks in real estate. But the cracks were not in the buildings ,but in the very foundation of property ownership. If I’m focused on making property ownership provable, Njeri is focused on makin

pasted


Troubleshooting MiniKit integration on Vercel
Last message 3 hours ago 

Decentralized Real Estate Platform with Blockchain Verification
Last message 4 hours ago 

💬 I am creating an app "This i...
Last message 13 hours ago 

Fixing PropertyRoutes Errors
Last message 13 hours ago 

Permissive Verification for Property Listing App
Last message 14 hours ago 

Untitled
Last message 17 hours ago 

Debugging WhoDeedIt App Architecture
Last message 19 hours ago 

Resolving "require is not defined" error in TypeScript ES Module
Last message 20 hours ago 

WhoDeedIt: Decentralized Identity and Property Verification
Last message 22 hours ago 

Add KYC and Wallet Links to Footer
Last message 23 hours ago 

Resolving npm dependency conflicts for WhoDeedIt
Last message 1 day ago 

Project knowledge


Bringing Trust to Digital Property Transactions The Problem: Digital Identity and Property Ownership Are in Crisis The internet has revolutionized how we interact, but it has also introduced unprecedented levels of fraud, misinformation, and identity deception. When it comes to real estate transactions, the problem becomes even more severe: 1. The Digital Identity Crisis People online are not always who they claim to be. Fake profiles, synthetic identities, and bots flood platforms, making it difficult to know who you’re really dealing with. In the real estate sector, this problem leads to: Scammers posing as landlords or agents – Individuals create fake listings and vanish once a deposit is paid. Duplicate and stolen identities – Bad actors reuse or fabricate credentials to commit fraud. Lack of accountability – With no verifiable identity system, fraudsters simply reappear under different names after being caught. 2. Property Ownership Fraud Property transactions are high-stakes, yet in many regions, ownership records are poorly maintained, opaque, or manipulated. This leads to: Fake property listings – Fraudsters list homes they don’t own, pocketing deposits before disappearing. Forgery and document tampering – Paper-based land titles and lease agreements are easily altered or duplicated. Cross-border ownership confusion – Verifying property ownership across jurisdictions is slow, expensive, and unreliable. The result? Mistrust, financial losses, and a broken system where buyers and renters hesitate to engage. The Solution: WhoDeedIt – A Proof-of-Ownership & Identity Verification Microservice WhoDeedIt is a trust engine designed to verify digital identities and property ownership without sacrificing privacy or decentralization. By integrating cutting-edge World ID for identity proofing and blockchain for ownership validation, we create a secure, fraud-resistant verification layer that can be used by any platform dealing with property transactions. How It Works: A Two-Layered Verification System 1. Identity Verification (Proof of Personhood via World ID) WhoDeedIt integrates Worldcoin’s World ID, a privacy-preserving proof-of-humanity system that ensures users are real individuals—not bots or scammers. No More Fake Identities – Users can prove they are unique humans without revealing personal details. Sybil Resistance – Prevents users from creating multiple fraudulent accounts. Decentralized & Privacy-Preserving – Unlike traditional KYC, no central authority controls user data. 2. Property Ownership Verification (On-Chain Proofs & KYC Integration) Once a user is verified as a real person, WhoDeedIt goes a step further by ensuring they actually own the property they claim to list. Users submit title deeds, lease agreements, or official documents for verification. OCR & AI-powered verification cross-checks documents for authenticity. Blockchain-backed proof-of-ownership – Instead of storing sensitive documents centrally, WhoDeedIt stores hashed proofs on-chain, ensuring immutability and security. Verified listings – Once approved, property listings receive a “Verified Owner” badge, boosting confidence for potential buyers and renters. Why WhoDeedIt is a Game-Changer ✅ Trust Without Centralization – Users verify their identity and ownership without handing over personal data to third parties. ✅ Global & Borderless – Works across different jurisdictions, making it easy to verify ownership internationally. ✅ Tamper-Proof & Fraud-Resistant – Blockchain-backed verification ensures records cannot be altered or forged. ✅ Seamless Integration – Platforms like DAO-Bitat, marketplaces, and real estate apps can plug into WhoDeedIt’s API to instantly verify users and property listings. ✅ End-to-End Security – Protects buyers, sellers, and renters from scams while ensuring genuine property owners can list with confidence. WhoDeedIt + DAO-Bitat: A Powerful Ecosystem WhoDeedIt is a standalone service but integrates seamlessly with platforms like DAO-Bitat, enhancing real estate transactions by eliminating fraud and ensuring every property listing is legitimate and every user is real. DAO-Bitat handles property discovery and transactions on-chain. WhoDeedIt ensures only verified users and legitimate properties enter the marketplace. Together, they create a safe, trustless, and efficient digital real estate ecosystem. Call to Action WhoDeedIt isn’t just a tool—it’s a new standard for digital trust. Whether you’re a real estate marketplace, a decentralized property platform, or an individual buyer/seller, WhoDeedIt ensures secure, verifiable transactions without the risks of fraud and identity theft.
Edit
2% of knowledge capacity used
WhoDeedIt Overview
265 lines

text



WhoDeedIt Overview

9.49 KB •265 lines
•
Formatting may be inconsistent from source

# WhoDeedIt App Structure & Overview

## Project Mission

WhoDeedIt is a decentralized property verification platform that acts as a trust layer between users and the Daobitat real estate marketplace. The application solves two critical problems in digital property transactions:

1. **Digital Identity Crisis**: Using World ID for proof-of-personhood, ensuring users are real individuals and not bots or scammers.
2. **Property Ownership Fraud**: Providing a robust verification system for property ownership documents and claims.

## Core Architecture
- React application built with Vite + TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Worldcoin's MiniKit for identity verification
- Node.js/Express backend with TypeScript
- MongoDB/Mongoose for database
- Google Cloud Storage for document storage
- JWT for authentication

## Project Structure

The project is organized into a standard Node.js/Express backend with TypeScript and a React frontend, following the Model-View-Controller (MVC) pattern:

```
WhoDeedIt/
├── backend/                  # Backend application
│   ├── src/                  # Source code
│   │   ├── controllers/      # Controller logic
│   │   │   ├── auth/         # Authentication controllers
│   │   │   ├── properties/   # Property management controllers 
│   │   │   └── admin/        # Admin functionality controllers
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # Mongoose data models
│   │   ├── routes/           # Express route definitions
│   │   ├── services/         # Business logic and third-party services
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Utility functions
│   ├── index.ts              # Application entry point
│   ├── tsconfig.json         # TypeScript configuration
│   └── package.json          # Backend dependencies
└── frontend/                 # Frontend React application
    ├── src/                  # Source code
    │   ├── App.tsx           # Main routing component
    │   ├── minikit-provider.tsx # Worldcoin identity provider
    │   ├── index.css         # Tailwind directives
    │   ├── components/       # Reusable UI components
    │   │   ├── common/       # Shared UI elements
    │   │   ├── property/     # Property-related components
    │   │   └── auth/         # Authentication components
    │   ├── pages/            # Page components
    │   │   ├── auth/         # Authentication pages
    │   │   │   ├── Login.tsx # World ID authentication
    │   │   │   └── SignUp.tsx # New user registration
    │   │   ├── home/         # Landing and home pages
    │   │   │   ├── Header.tsx # Navigation bar
    │   │   │   ├── Footer.tsx # Page footer
    │   │   │   ├── Hero.tsx  # Landing page banner
    │   │   │   └── Home.tsx  # Main landing page
    │   │   ├── kyc/          # Identity verification flow
    │   │   │   └── Kyc.tsx   # Identity verification process
    │   │   └── wallet/       # Property portfolio management
    │   │       └── Wallet.tsx # Property management dashboard
    │   ├── services/         # API services
    │   ├── store/            # State management
    │   └── utils/            # Utility functions
    ├── index.html            # HTML entry point
    ├── vite.config.ts        # Vite configuration
    └── package.json          # Frontend dependencies
```

## Key Features

1. **Identity Verification**: World ID integration for proof of personhood
   - Sybil-resistant identity verification
   - Privacy-preserving proof of humanity
   - Prevents users from creating multiple fraudulent accounts

2. **Property Ownership Verification**:
   - Secure document upload and verification
   - OCR & AI-powered document authenticity checks
   - Blockchain-backed proof-of-ownership

3. **Secure Transactions**:
   - Trust layer for digital property transfers
   - Verified listings with "Verified Owner" badge
   - Tamper-proof & fraud-resistant verification

4. **Responsive Design**:
   - Mobile-friendly interface using Tailwind
   - Component reuse (Header and Footer shared across pages)
   - Enhanced mobile compatibility

5. **Daobitat Integration**:
   - Property submission to Daobitat marketplace
   - Verification status checks before submission
   - Tracking for Daobitat listing IDs

## Key Components

### Backend Components

#### Models

1. **User Model** (`models/user.ts`)
   - Represents users with identity verification status
   - Tracks World ID verification
   - Manages user roles and permissions
   - Stores profile information

2. **Property Model** (`models/property.ts`)
   - Represents real estate properties
   - Manages verification status
   - Tracks ownership documents
   - Handles Daobitat integration

#### Controllers

1. **World ID Authentication Controller** (`controllers/auth/WorldIDAuthenticationController.ts`)
   - Handles World ID credential verification
   - Manages user authentication and sessions
   - Processes profile updates

2. **Property Controller** (`controllers/properties/PropertyController.ts`)
   - CRUD operations for properties
   - Property search and filtering
   - Owner-specific property operations

3. **Verification Controller** (`controllers/properties/VerificationController.ts`)
   - Document verification workflows
   - Property status updates
   - Verification history tracking

4. **Document Upload Controller** (`controllers/DocumentUploadController.ts`)
   - Secure document upload URLs
   - Google Cloud Storage integration
   - Document type validation

#### Routes

1. **Property Routes** (`routes/propertyRoutes.ts`)
   - Property creation and management endpoints
   - Property search and retrieval
   - Owner-specific property operations

2. **Upload Routes** (`routes/uploadRoutes.ts`)
   - Document upload endpoints
   - Document verification status
   - Daobitat submission endpoints

3. **User Routes** (`routes/userRoutes.ts`)
   - User authentication endpoints
   - Profile management
   - World ID verification

### Frontend Components

#### Authentication

1. **World ID Integration** (`pages/auth/Login.tsx`)
   - World ID credential verification
   - Proof of personhood validation
   - User authentication flow

2. **User Registration** (`pages/auth/SignUp.tsx`)
   - New user registration
   - Account creation workflow

#### Property Management

1. **Property Wallet** (`pages/wallet/Wallet.tsx`)
   - Property portfolio management
   - Document upload interface
   - Verification status tracking

2. **KYC Process** (`pages/kyc/Kyc.tsx`)
   - Identity verification flow
   - Document submission
   - Verification status tracking

#### Home Pages

1. **Main Landing Page** (`pages/home/Home.tsx`)
   - Service overview
   - Feature highlights
   - Call to action elements

2. **Navigation Components**
   - Header (`pages/home/Header.tsx`) - Navigation bar
   - Footer (`pages/home/Footer.tsx`) - Page footer
   - Hero (`pages/home/Hero.tsx`) - Landing page banner

## Routes

- `/` - Home page with service overview
- `/login` - User authentication
- `/signup` - New user registration
- `/kyc` - Identity verification process
- `/wallet` - Property management dashboard

## Technology Stack

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB/Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **World ID SDK** - Identity verification
- **Google Cloud Storage** - Document storage

### Frontend

- **React** - UI library
- **Vite** - Build tool
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Worldcoin's MiniKit** - World ID integration

## Security & Compliance

1. **Identity Verification**
   - World ID for Sybil-resistant identity verification
   - Privacy-preserving proof of personhood
   - No unnecessary personal data collection

2. **Document Security**
   - Encrypted document storage
   - Signed URLs for secure uploads
   - Access control for document retrieval

3. **API Security**
   - JWT token authentication
   - Role-based access control
   - Request validation and sanitization

4. **Data Protection**
   - GDPR-compliant data handling
   - Data minimization principles
   - Secure data storage and transmission

## Recent Improvements

1. **TypeScript Error Resolution**
   - Fixed Express route handler type issues
   - Implemented a custom `asyncHandler` wrapper for proper async/await handling
   - Added proper type definitions for route handlers

2. **Enhanced Document Handling**
   - Integrated Google Cloud Storage for secure document storage
   - Added signed URLs for secure uploads
   - Implemented document categorization and verification tracking

3. **Improved Error Handling**
   - Added global error middleware
   - Implemented consistent error response format
   - Enhanced logging for debugging

4. **Responsive UI Improvements**
   - Enhanced mobile compatibility
   - Improved form validation and user feedback
   - Added loading states and error handling

