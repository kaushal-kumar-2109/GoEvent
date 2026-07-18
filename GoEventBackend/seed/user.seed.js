require("dotenv").config();
require("../config/db.connect.js");
const bcrypt = require("bcrypt");
const User = require("../src/models/user.model.js");

const n_user = 500;

// random first name list
const Names = [
    "Aarav Sharma", "Vivaan Sharma", "Aditya Sharma", "Krishna Sharma", "Rohan Sharma", "Rahul Sharma", "Karan Sharma", "Priya Sharma", "Ananya Sharma", "Sneha Sharma", "Pooja Sharma", "Neha Sharma", "Ritika Sharma", "Arjun Sharma", "Kabir Sharma", "Yash Sharma", "Ishita Sharma", "Aditi Sharma", "Meera Sharma", "Nikhil Sharma",
    "Aarav Verma", "Vivaan Verma", "Aditya Verma", "Krishna Verma", "Rohan Verma", "Rahul Verma", "Karan Verma", "Priya Verma", "Ananya Verma", "Sneha Verma", "Pooja Verma", "Neha Verma", "Ritika Verma", "Arjun Verma", "Kabir Verma", "Yash Verma", "Ishita Verma", "Aditi Verma", "Meera Verma", "Nikhil Verma",
    "Aarav Singh", "Vivaan Singh", "Aditya Singh", "Krishna Singh", "Rohan Singh", "Rahul Singh", "Karan Singh", "Priya Singh", "Ananya Singh", "Sneha Singh", "Pooja Singh", "Neha Singh", "Ritika Singh", "Arjun Singh", "Kabir Singh", "Yash Singh", "Ishita Singh", "Aditi Singh", "Meera Singh", "Nikhil Singh",
    "Aarav Kumar", "Vivaan Kumar", "Aditya Kumar", "Krishna Kumar", "Rohan Kumar", "Rahul Kumar", "Karan Kumar", "Priya Kumar", "Ananya Kumar", "Sneha Kumar", "Pooja Kumar", "Neha Kumar", "Ritika Kumar", "Arjun Kumar", "Kabir Kumar", "Yash Kumar", "Ishita Kumar", "Aditi Kumar", "Meera Kumar", "Nikhil Kumar",
    "Aarav Gupta", "Vivaan Gupta", "Aditya Gupta", "Krishna Gupta", "Rohan Gupta", "Rahul Gupta", "Karan Gupta", "Priya Gupta", "Ananya Gupta", "Sneha Gupta", "Pooja Gupta", "Neha Gupta", "Ritika Gupta", "Arjun Gupta", "Kabir Gupta", "Yash Gupta", "Ishita Gupta", "Aditi Gupta", "Meera Gupta", "Nikhil Gupta",
    "Aarav Patel", "Vivaan Patel", "Aditya Patel", "Krishna Patel", "Rohan Patel", "Rahul Patel", "Karan Patel", "Priya Patel", "Ananya Patel", "Sneha Patel", "Pooja Patel", "Neha Patel", "Ritika Patel", "Arjun Patel", "Kabir Patel", "Yash Patel", "Ishita Patel", "Aditi Patel", "Meera Patel", "Nikhil Patel",
    "Aarav Yadav", "Vivaan Yadav", "Aditya Yadav", "Krishna Yadav", "Rohan Yadav", "Rahul Yadav", "Karan Yadav", "Priya Yadav", "Ananya Yadav", "Sneha Yadav", "Pooja Yadav", "Neha Yadav", "Ritika Yadav", "Arjun Yadav", "Kabir Yadav", "Yash Yadav", "Ishita Yadav", "Aditi Yadav", "Meera Yadav", "Nikhil Yadav",
    "Aarav Mishra", "Vivaan Mishra", "Aditya Mishra", "Krishna Mishra", "Rohan Mishra", "Rahul Mishra", "Karan Mishra", "Priya Mishra", "Ananya Mishra", "Sneha Mishra", "Pooja Mishra", "Neha Mishra", "Ritika Mishra", "Arjun Mishra", "Kabir Mishra", "Yash Mishra", "Ishita Mishra", "Aditi Mishra", "Meera Mishra", "Nikhil Mishra",
    "Aarav Agarwal", "Vivaan Agarwal", "Aditya Agarwal", "Krishna Agarwal", "Rohan Agarwal", "Rahul Agarwal", "Karan Agarwal", "Priya Agarwal", "Ananya Agarwal", "Sneha Agarwal", "Pooja Agarwal", "Neha Agarwal", "Ritika Agarwal", "Arjun Agarwal", "Kabir Agarwal", "Yash Agarwal", "Ishita Agarwal", "Aditi Agarwal", "Meera Agarwal", "Nikhil Agarwal",
    "Aarav Jain", "Vivaan Jain", "Aditya Jain", "Krishna Jain", "Rohan Jain", "Rahul Jain", "Karan Jain", "Priya Jain", "Ananya Jain", "Sneha Jain", "Pooja Jain", "Neha Jain", "Ritika Jain", "Arjun Jain", "Kabir Jain", "Yash Jain", "Ishita Jain", "Aditi Jain", "Meera Jain", "Nikhil Jain",
    "Aarav Pandey", "Vivaan Pandey", "Aditya Pandey", "Krishna Pandey", "Rohan Pandey", "Rahul Pandey", "Karan Pandey", "Priya Pandey", "Ananya Pandey", "Sneha Pandey", "Pooja Pandey", "Neha Pandey", "Ritika Pandey", "Arjun Pandey", "Kabir Pandey", "Yash Pandey", "Ishita Pandey", "Aditi Pandey", "Meera Pandey", "Nikhil Pandey",
    "Aarav Chauhan", "Vivaan Chauhan", "Aditya Chauhan", "Krishna Chauhan", "Rohan Chauhan", "Rahul Chauhan", "Karan Chauhan", "Priya Chauhan", "Ananya Chauhan", "Sneha Chauhan", "Pooja Chauhan", "Neha Chauhan", "Ritika Chauhan", "Arjun Chauhan", "Kabir Chauhan", "Yash Chauhan", "Ishita Chauhan", "Aditi Chauhan", "Meera Chauhan", "Nikhil Chauhan",
    "Aarav Reddy", "Vivaan Reddy", "Aditya Reddy", "Krishna Reddy", "Rohan Reddy", "Rahul Reddy", "Karan Reddy", "Priya Reddy", "Ananya Reddy", "Sneha Reddy", "Pooja Reddy", "Neha Reddy", "Ritika Reddy", "Arjun Reddy", "Kabir Reddy", "Yash Reddy", "Ishita Reddy", "Aditi Reddy", "Meera Reddy", "Nikhil Reddy",
    "Aarav Nair", "Vivaan Nair", "Aditya Nair", "Krishna Nair", "Rohan Nair", "Rahul Nair", "Karan Nair", "Priya Nair", "Ananya Nair", "Sneha Nair", "Pooja Nair", "Neha Nair", "Ritika Nair", "Arjun Nair", "Kabir Nair", "Yash Nair", "Ishita Nair", "Aditi Nair", "Meera Nair", "Nikhil Nair",
    "Aarav Joshi", "Vivaan Joshi", "Aditya Joshi", "Krishna Joshi", "Rohan Joshi", "Rahul Joshi", "Karan Joshi", "Priya Joshi", "Ananya Joshi", "Sneha Joshi", "Pooja Joshi", "Neha Joshi", "Ritika Joshi", "Arjun Joshi", "Kabir Joshi", "Yash Joshi", "Ishita Joshi", "Aditi Joshi", "Meera Joshi", "Nikhil Joshi",
];

// random organisation list
const organizations = [
    "Google", "Microsoft", "Amazon", "Infosys", "TCS", "Wipro", "Accenture", "Cognizant", "Capgemini", "Tech Mahindra",
];

// to return any random item fron the array give
function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// genreate randome phone number
function generatePhone(index) {
    const num1 = Math.floor(100000000 + Math.random() * 900000000);
    return `9${String(num1).padStart(9, "0")}`;
}

const generateUsers = async () => {
    await User.deleteMany({});
    console.log("🧹 Existing users deleted");
    const hashedPassword = await bcrypt.hash("password123", 10);

    for (let i = 1; i <= n_user; i++) {
        let user = {
            name: randomItem(Names),
            userName: `User${i}`,
            email: `user${i}@example.com`,
            password: hashedPassword,
            phone: generatePhone(i),
            role: (i > 249) ? "USER" : "HOST",
            organisation: randomItem(organizations),
            status: "ACTIVE",
            avatar: Math.floor(Math.random() * 10)
        };
        try {
            await User.create(user);
            if (i % 100 == 0) console.log(`${i} user created successfully - ${n_user}`);
        } catch (error) {
            console.log("error in adding the user data");
        }
    }
    console.log(`${n_user} users created successfully`);
    process.exit(0);

}

generateUsers();