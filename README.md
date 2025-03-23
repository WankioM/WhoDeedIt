# WhoDeedIt


## Bringing Trust to Digital Property Transactions

WhoDeedIt is a decentralized property verification platform that acts as a trust layer between users and the Daobitat real estate marketplace. Our mission is to solve two critical problems in digital property transactions:

1. **Digital Identity Crisis**: Using World ID for proof-of-personhood, ensuring users are real individuals and not bots or scammers.
2. **Property Ownership Fraud**: Providing a robust verification system for property ownership documents and claims.

## The Problem We're Solving

Real estate fraud is a global issue, with nearly one in four consumers targeted during property transactions. Without a trusted digital ID for real-world assets, property markets suffer from:

- **Scammers posing as landlords or agents** – Fake listings that vanish once deposits are paid
- **Duplicate and stolen identities** – Bad actors using fabricated credentials to commit fraud
- **Forged documents** – Paper-based land titles and lease agreements easily altered or duplicated
- **Cross-border confusion** – Verification across jurisdictions that is slow, expensive, and unreliable

## Our Solution: A Two-Layered Verification System

### 1. Identity Verification (Proof of Personhood via World ID)

WhoDeedIt integrates Worldcoin's World ID, a privacy-preserving proof-of-humanity system that ensures users are real individuals:

- **No More Fake Identities** – Users prove they are unique humans without revealing personal details
- **Sybil Resistance** – Prevents creation of multiple fraudulent accounts
- **Privacy-Preserving** – Unlike traditional KYC, no central authority controls user data

### 2. Property Ownership Verification

Once a user is verified as a real person, WhoDeedIt ensures they actually own the property they claim to list:

- **Document Verification** – Users submit title deeds, lease agreements, or official documents
- **AI-Powered Authentication** – OCR & AI-powered verification cross-checks documents for authenticity
- **Blockchain-Backed Proof** – Hashed proofs stored on-chain, ensuring immutability and security
- **Verified Listings** – Property listings receive a "Verified Owner" badge once approved

## Key Features

- ✅ **Trust Without Centralization** – Verification without handing over personal data to third parties
- ✅ **Global & Borderless** – Works across different jurisdictions for international verification
- ✅ **Tamper-Proof & Fraud-Resistant** – Blockchain-backed verification prevents records from being altered
- ✅ **Seamless Integration** – API access for platforms like DAO-Bitat, marketplaces, and real estate apps
- ✅ **End-to-End Security** – Protection for all parties in property transactions

## Tech Stack

### Backend
- **Node.js** – Runtime environment
- **Express** – Web framework
- **TypeScript** – Type-safe JavaScript
- **MongoDB/Mongoose** – Database and ODM
- **JWT** – Authentication tokens
- **World ID SDK** – Identity verification
- **Google Cloud Storage** – Document storage

### Frontend
- **React** – UI library
- **Vite** – Build tool
- **TypeScript** – Type-safe JavaScript
- **Tailwind CSS** – Styling
- **React Router** – Navigation
- **Worldcoin's MiniKit** – World ID integration

## Project Structure

```
WhoDeedIt/
├── backend/                  # Backend application
│   ├── src/                  # Source code
│   │   ├── controllers/      # Controller logic
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
    │   ├── pages/            # Page components
    │   ├── services/         # API services
    │   ├── store/            # State management
    │   └── utils/            # Utility functions
    ├── index.html            # HTML entry point
    ├── vite.config.ts        # Vite configuration
    └── package.json          # Frontend dependencies
```

## Routes

- `/` - Home page with service overview
- `/login` - User authentication
- `/signup` - New user registration
- `/kyc` - Identity verification process
- `/wallet` - Property management dashboard

## Installation and Setup

### Prerequisites
- Node.js (v14 or later)
- MongoDB
- Google Cloud Storage account
- World ID API credentials

### Backend Setup
1. Clone the repository
   ```
   git clone https://github.com/yourusername/whodeedit.git
   cd whodeedit/backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   WORLD_ID_APP_ID=your_world_id_app_id
   WORLD_ID_ACTION_ID=your_world_id_action_id
   GOOGLE_CLOUD_PROJECT_ID=your_gcp_project_id
   GOOGLE_CLOUD_BUCKET_NAME=your_gcs_bucket_name
   ```

4. Start the development server
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory
   ```
   cd ../frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the frontend directory with the following variables:
   ```
   VITE_API_URL=http://localhost:3000/api
   VITE_WORLD_ID_APP_ID=your_world_id_app_id
   VITE_WORLD_ID_ACTION_ID=your_world_id_action_id
   ```

4. Start the development server
   ```
   npm run dev
   ```


WhoDeedIt is a standalone service but integrates seamlessly with platforms like DAO-Bitat:

- DAO-Bitat handles property discovery and transactions on-chain
- WhoDeedIt ensures only verified users and legitimate properties enter the marketplace

Together, they create a safe, trustless, and efficient digital real estate ecosystem.

## Security & Compliance

- **Identity Verification** – World ID for Sybil-resistant identity verification
- **Document Security** – Encrypted document storage and signed URLs for secure uploads
- **API Security** – JWT token authentication and role-based access control
- **Data Protection** – GDPR-compliant data handling and secure storage

## Contributing

We welcome contributions to WhoDeedIt! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Team

- **Tracy** – Lead Developer & Architect
- **Njeri** – Product Expert

