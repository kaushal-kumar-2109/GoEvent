require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../db/models/user.model.js");

const MONGO_URI = process.env.MONGO_DB_URL || process.env.MONGO_DB_SRV_URL;  // databse url
const nUser = 500 // number user to create

// random first name list
const firstNames = [
    "Aarav", "Vivaan", "Aditya", "Krishna", "Rohan",
    "Rahul", "Karan", "Priya", "Ananya", "Sneha",
    "Pooja", "Neha", "Ritika", "Arjun", "Kabir",
    "Yash", "Ishita", "Aditi", "Meera", "Nikhil"
];
// random last name list
const lastNames = [
    "Sharma", "Verma", "Singh", "Kumar", "Gupta",
    "Patel", "Yadav", "Mishra", "Agarwal", "Jain",
    "Pandey", "Chauhan", "Reddy", "Nair", "Joshi"
];
// random organisation list
const organizations = [
    "Google",
    "Microsoft",
    "Amazon",
    "Infosys",
    "TCS",
    "Wipro",
    "Accenture",
    "Cognizant",
    "Capgemini",
    "Tech Mahindra",
    null
];

// to return any random item fron the array give
function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// genreate randome phone number
function generatePhone(index) {
    return `9${String(100000000 + index).padStart(9, "0")}`;
}

// seed function to create random users
async function seedUsers() {
    console.log(`✅ Initialising User Creating seed for create ${nUser} users`);
    try {
        await mongoose.connect(MONGO_URI);

        console.log("Connected to MongoDB");

        await User.deleteMany({});
        console.log("🧹 Existing users deleted");

        const hashedPassword = await bcrypt.hash("password123", 10);

        const users = [];

        for (let i = 1; i <= nUser; i++) {
            const firstName = randomItem(firstNames);
            const lastName = randomItem(lastNames);

            users.push({
                name: `${firstName} ${lastName}`,
                email: `user${i}@gmail.com`,
                password: hashedPassword,
                phone: generatePhone(i),
                role: "USER",
                organisation: randomItem(organizations),
                status: "ACTIVE",
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        await User.insertMany(users);

        console.log(`${nUser} users created successfully`);
        console.log(`✅ Terminated User Creating seed`);
        process.exit(0);
    } catch (error) {
        console.log(`❌ Terminating User Creating seed`);
        console.error(error);
        process.exit(1);
    }
}

seedUsers();