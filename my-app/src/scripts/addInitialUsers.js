const { db } = require('./firebase-admin');
const { collection, addDoc, getDocs, query, where } = require('firebase/firestore');
const bcrypt = require('bcryptjs');

const addInitialUsers = async () => {
  try {
    const usersCollection = collection(db, 'users');

    // Check if users already exist - check both usernames and emails
    const q = query(usersCollection, where("username", "in", [
      "dinesh", 
      "karthik", 
      "nithin@example.com"
    ]));
    
    const emailQuery = query(usersCollection, where("email", "in", [
      "nithin@example.com"
    ]));

    const [existingUsers, existingEmails] = await Promise.all([
      getDocs(q),
      getDocs(emailQuery)
    ]);
    
    if (!existingUsers.empty || !existingEmails.empty) {
      console.log("Users or emails already exist!");
      return;
    }

    // Initial users data
    const users = [
      {
        username: "dinesh",
        email: null,
        password: await bcrypt.hash("dinesh123", 10),
        role: "superadmin",
        createdAt: new Date().toISOString(),
        lastLogin: null,
        permissions: ["all"]
      },
      {
        username: "karthik",
        email: null,
        password: await bcrypt.hash("karthik123", 10),
        role: "admin",
        createdAt: new Date().toISOString(),
        lastLogin: null,
        permissions: ["create", "read", "update"]
      },
      {
        username: "nithin@example.com",
        email: "nithin@example.com",
        password: await bcrypt.hash("nithin123", 10),
        role: "registeredUser",
        createdAt: new Date().toISOString(),
        lastLogin: null,
        permissions: ["read"],
        profile: {
          name: "Nithin",
          phone: "9876543210"
        }
      }
    ];

    // Add users to Firestore with validation
    for (const user of users) {
      if (user.role === 'registeredUser' && (!user.email || user.username !== user.email)) {
        throw new Error(`Registered user ${user.username} must have matching email and username`);
      }

      await addDoc(usersCollection, user);
      console.log(`Added user: ${user.username}`);
    }

    console.log("Initial users added successfully!");

  } catch (error) {
    console.error("Error adding initial users:", error);
    process.exit(1);
  }
};

// Run the function
addInitialUsers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 