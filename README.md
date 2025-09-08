# RetailRadar - Local Store Item Listing System

A modern web application built with Next.js and MongoDB that helps customers find items in local stores before visiting them physically, and allows store owners to manage their inventory online.

## Features

### For Customers
- 🔍 Search for products across all local stores
- 📍 Filter by locality and categories
- 🏪 Browse stores by location
- 📋 View detailed product information
- 📞 Contact stores directly for purchases

### For Store Owners
- 🏪 Register and manage multiple stores
- 📦 Full CRUD operations for products
- 📊 Dashboard with inventory overview
- 📈 Track low stock items
- 👥 Manage store information

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with custom authentication system
- **UI Components**: Lucide React icons
- **Validation**: Zod schema validation

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running locally (or MongoDB Atlas connection)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd RetailRadar
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/retailradar
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret-here
```

**Important**: Replace the secret keys with your own secure values for production.

### 4. Start MongoDB
Make sure MongoDB is running:
```bash
# For local MongoDB installation
mongod

# Or if using MongoDB service
sudo systemctl start mongod
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'customer' | 'store_owner',
  createdAt: Date,
  updatedAt: Date
}
```

### Store Collection
```javascript
{
  name: String,
  description: String,
  address: String,
  locality: String,
  phone: String,
  email: String,
  owner: ObjectId (ref: User),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Collection
```javascript
{
  name: String,
  description: String,
  category: String,
  price: Number,
  stock: Number,
  imageUrl: String (optional),
  store: ObjectId (ref: Store),
  isAvailable: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Stores
- `GET /api/stores` - Get all stores (with search/filter)
- `POST /api/stores` - Create store (store owners only)
- `GET /api/stores/[id]` - Get store by ID
- `PUT /api/stores/[id]` - Update store (owner only)
- `DELETE /api/stores/[id]` - Delete store (owner only)
- `GET /api/stores/my` - Get current user's stores

### Products
- `GET /api/products` - Get all products (with search/filter)
- `POST /api/products` - Create product (store owners only)
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product (owner only)
- `DELETE /api/products/[id]` - Delete product (owner only)
- `GET /api/products/my` - Get current user's products

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Store owner dashboard
│   ├── products/          # Product pages
│   ├── stores/            # Store pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
├── contexts/              # React contexts
├── lib/                   # Utility functions
├── models/                # Mongoose models
└── types/                 # TypeScript type definitions
```

## Key Features Implementation

### Search & Filtering
- Text search using MongoDB text indexes
- Location-based filtering
- Category filtering
- Pagination support

### Authentication System
- JWT-based authentication
- Role-based access control
- Secure password hashing with bcryptjs
- Protected API routes

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Responsive navigation
- Optimized for all screen sizes

### Data Validation
- Client-side validation with React Hook Form
- Server-side validation with Zod schemas
- Type safety with TypeScript

## Usage Guide

### For Store Owners
1. Register with "Store Owner" role
2. Create your store with details
3. Add products to your store
4. Manage inventory from dashboard

### For Customers
1. Browse stores and products
2. Search for specific items
3. Filter by location or category
4. Contact stores for purchases

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
npm start
```

### Code Quality
```bash
npm run lint        # ESLint
npm run type-check  # TypeScript check
```

## Database Indexes

The application uses several MongoDB indexes for optimal performance:

```javascript
// User collection
{ email: 1 }

// Store collection
{ locality: 1 }
{ owner: 1 }
{ name: "text", description: "text" }

// Product collection
{ store: 1 }
{ category: 1 }
{ name: "text", description: "text", category: "text" }
{ price: 1 }
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- CORS protection
- Environment variable security

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
