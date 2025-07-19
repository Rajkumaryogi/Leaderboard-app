const User = require('../models/User');
require('dotenv').config();

const connectDB = require('../config/db');

// Database connection
connectDB();


const initialUsers = [
  'Rahul', 'Kamal', 'Sanak', 'Priya', 'Amit', 
  'Neha', 'Vikram', 'Sonia', 'Ravi', 'Anjali'
];

async function seedUsers() {
  try {
    await User.deleteMany({});

  console.log('Existing data cleared');
    
    const users = await User.insertMany(
      initialUsers.map(name => ({ name }))
    );
    
    console.log('Database seeded with initial users');
    return users;
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

// Uncomment to run seeder
seedUsers().then(() => process.exit());

module.exports = seedUsers;