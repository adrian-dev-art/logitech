const User = require('../models/User');

async function createDefaultAdmin() {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ username: 'admin' });

    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@logistic.com',
        password: 'admin123',
        fullName: 'System Administrator',
        role: 'ADMIN',
        phone: '08123456789'
      });
      console.log('✅ Default admin user created');
      console.log('   Username: admin');
      console.log('   Password: admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  }
}

module.exports = createDefaultAdmin;
