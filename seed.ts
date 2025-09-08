import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb+srv://nayaksumaanyu:purupia123@cluster0.5deqr.mongodb.net/retailradar?retryWrites=true&w=majority&appName=Cluster0';

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('retailradar');
    
    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('stores').deleteMany({});
    await db.collection('products').deleteMany({});
    console.log('Cleared existing data');
    
    // Create users
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'store_owner',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        role: 'store_owner',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Customer One',
        email: 'customer@example.com',
        password: hashedPassword,
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const insertedUsers = await db.collection('users').insertMany(users);
    console.log('Users created:', insertedUsers.insertedCount);
    
    const userIds = Object.values(insertedUsers.insertedIds);
    
    // Create stores
  // Create sample stores for college
  const stores = [
    {
      name: "College Grocery Shop",
      description: "Fresh groceries, snacks, beverages and daily essentials for students",
      category: "Groceries",
      address: "Main Campus, Ground Floor",
      phone: "+91-9876543210",
      email: "grocery@college.edu",
      owner: userIds[1]
    },
    {
      name: "College Stationery Shop",
      description: "Books, notebooks, pens, stationery and academic supplies",
      category: "Stationery",
      address: "Academic Block, First Floor",
      phone: "+91-9876543211",
      email: "stationery@college.edu",
      owner: userIds[2]
    },
    {
      name: "College Laundry Shop",
      description: "Professional laundry and dry cleaning services for students",
      category: "Services",
      address: "Hostel Block B, Ground Floor",
      phone: "+91-9876543212",
      email: "laundry@college.edu",
      owner: userIds[0]
    },
    {
      name: "OAC Snacks Shop",
      description: "Quick snacks, beverages, sandwiches and light meals",
      category: "Food & Beverages",
      address: "Student Activity Center",
      phone: "+91-9876543213",
      email: "oac@college.edu",
      owner: userIds[1]
    },
    {
      name: "FC Restaurant",
      description: "Full meals, dining services and catering for college events",
      category: "Restaurant",
      address: "Main Campus, Food Court",
      phone: "+91-9876543214",
      email: "fc@college.edu",
      owner: userIds[2]
    }
  ];    const insertedStores = await db.collection('stores').insertMany(stores);
    console.log('Stores created:', insertedStores.insertedCount);
    
    const storeIds = Object.values(insertedStores.insertedIds);
    
    // Create products for college shops
    const products = [
      // College Grocery Shop Products
      {
        name: 'Maggi Noodles',
        description: '2-minute instant noodles - perfect for hostel students',
        category: 'Instant Food',
        price: 15,
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500',
        store: storeIds[0],
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Parle-G Biscuits',
        description: 'Classic glucose biscuits - student favorite',
        category: 'Snacks',
        price: 10,
        stock: 75,
        imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500',
        store: storeIds[0],
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Amul Milk (500ml)',
        description: 'Fresh toned milk',
        category: 'Dairy',
        price: 28,
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500',
        store: storeIds[0],
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // College Stationery Shop Products
      {
        name: 'Classmate Notebook',
        description: '200 pages ruled notebook for college notes',
        category: 'Notebooks',
        price: 40,
        stock: 100,
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
        store: storeIds[1],
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Cello Ball Pen',
        description: 'Blue ink ball pen - smooth writing',
        category: 'Pens',
        price: 8,
        stock: 200,
        imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500',
        store: storeIds[1],
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Practical File',
        description: 'A4 size practical file for lab records',
        category: 'Files',
        price: 25,
        stock: 60,
        imageUrl: 'https://images.unsplash.com/photo-1586281380923-2f5c2516d9be?w=500',
        store: storeIds[1],
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // College Laundry Shop Services
      {
        name: 'Shirt Washing',
        description: 'Professional shirt washing and pressing service',
        category: 'Laundry',
        price: 25,
        stock: 999,
        imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500',
        store: storeIds[2],
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jeans Washing',
        description: 'Denim washing and care service',
        category: 'Laundry',
        price: 35,
        stock: 999,
        imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500',
        store: storeIds[2],
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dry Cleaning',
        description: 'Professional dry cleaning for delicate clothes',
        category: 'Dry Cleaning',
        price: 80,
        stock: 999,
        imageUrl: 'https://images.unsplash.com/photo-1489274495757-95c7c837b101?w=500',
        store: storeIds[2],
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // OAC Snacks Shop Products
      {
        name: 'Veg Sandwich',
        description: 'Fresh vegetable sandwich with butter and chutney',
        category: 'Sandwiches',
        price: 45,
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=500',
        store: storeIds[3],
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Samosa',
        description: 'Hot and crispy potato samosa',
        category: 'Snacks',
        price: 20,
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd4?w=500',
        store: storeIds[3],
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Cold Coffee',
        description: 'Refreshing iced coffee with cream',
        category: 'Beverages',
        price: 60,
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500',
        store: storeIds[3],
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // FC Restaurant Products
      {
        name: 'Thali Meal',
        description: 'Complete Indian thali with rice, dal, vegetables, roti and dessert',
        category: 'Meals',
        price: 120,
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500',
        store: storeIds[4],
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Chicken Biryani',
        description: 'Aromatic basmati rice with tender chicken and spices',
        category: 'Biryani',
        price: 180,
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=500',
        store: storeIds[4],
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Paneer Butter Masala',
        description: 'Rich and creamy paneer curry with butter naan',
        category: 'North Indian',
        price: 140,
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=500',
        store: storeIds[4],
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const insertedProducts = await db.collection('products').insertMany(products);
    console.log('Products created:', insertedProducts.insertedCount);
    
    // Create text indexes for search functionality
    await db.collection('stores').createIndex({ name: 'text', description: 'text' });
    await db.collection('products').createIndex({ name: 'text', description: 'text', category: 'text' });
    
    console.log('Database seeded successfully!');
    console.log('\nSample credentials for testing:');
    console.log('Store Owner 1: john@example.com / password123');
    console.log('Store Owner 2: jane@example.com / password123');
    console.log('Customer: customer@example.com / password123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();
