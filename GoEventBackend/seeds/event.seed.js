require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const Event = require("../db/models/event.model.js");
const User = require("../db/models/user.model.js");

const MONGO_URI = process.env.MONGO_DB_URL || process.env.MONGO_DB_SRV_URL;  // database url
const nevent = 2000; // number event to create

const categories = [
    "Music",
    "Technology",
    "Sports",
    "Business",
    "Workshop",
    "Education",
    "Gaming",
    "Food",
    "Fashion",
    "Health"
];
const cities = [
    { city: "Delhi", state: "Delhi" },
    { city: "Mumbai", state: "Maharashtra" },
    { city: "Bangalore", state: "Karnataka" },
    { city: "Hyderabad", state: "Telangana" },
    { city: "Pune", state: "Maharashtra" },
    { city: "Chennai", state: "Tamil Nadu" },
    { city: "Noida", state: "Uttar Pradesh" },
    { city: "Lucknow", state: "Uttar Pradesh" },
    { city: "Jaipur", state: "Rajasthan" },
    { city: "Kolkata", state: "West Bengal" }
];

const eventModes = ["online", "offline", "hybrid"];

const statuses = [
    "published",
    "published",
    "published",
    "pending",
    "completed"
];

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function seedEvents() {
    try {
        console.log(`✅ Initialising Event Creating seed for create ${nevent} events`);
        await mongoose.connect(MONGO_URI);

        console.log("✅ MongoDB Connected");

        const users = await User.find();

        if (!users.length) {
            throw new Error("❌ No users found. Seed users first.");
        }

        await Event.deleteMany({});
        console.log("🧹 All events deleted");

        const events = [];

        for (let i = 0; i < nevent; i++) {
            const organizer = randomItem(users);
            const location = randomItem(cities);

            // 1. Generate a random creation date within the past year
            const createdAt = faker.date.past({ years: 1 });
            const updatedAt = new Date(createdAt); // Match createdAt exactly

            // 2. Schedule the event to start 7 to 30 days after its creation date
            const startDate = new Date(
                createdAt.getTime() +
                faker.number.int({ min: 7, max: 30 }) * 24 * 60 * 60 * 1000
            );

            // 3. Schedule the event to end 2 to 24 hours after it starts
            const endDate = new Date(
                startDate.getTime() +
                faker.number.int({ min: 2, max: 24 }) * 60 * 60 * 1000
            );

            // 4. Registration deadline is set 2 days before the event starts
            const registrationDeadline = new Date(
                startDate.getTime() - 2 * 24 * 60 * 60 * 1000
            );

            const comments = [];
            const commentCount = faker.number.int({ min: 0, max: 10 });

            for (let j = 0; j < commentCount; j++) {
                comments.push({
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    comment: faker.lorem.sentence()
                });
            }

            const speakers = [];
            const speakerCount = faker.number.int({ min: 0, max: 5 });

            for (let j = 0; j < speakerCount; j++) {
                speakers.push({
                    name: faker.person.fullName(),
                    designation: faker.person.jobTitle(),
                    company: faker.company.name(),
                    image: faker.image.avatar(),
                    bio: faker.lorem.paragraph()
                });
            }

            const faqs = [];
            const faqCount = faker.number.int({ min: 0, max: 5 });

            for (let j = 0; j < faqCount; j++) {
                faqs.push({
                    question: faker.lorem.sentence(),
                    answer: faker.lorem.paragraph()
                });
            }

            let totalSeatCounter = faker.number.int({ min: 20, max: 2000 });
            let registrationCounter = faker.number.int({ min: 0, max: totalSeatCounter });

            events.push({
                title: faker.company.catchPhrase(),
                shortDescription: faker.lorem.sentence(),
                description: faker.lorem.paragraphs(3),
                category: randomItem(categories),
                organizer: organizer._id,
                organizerName: organizer.name,
                bannerImage: `https://picsum.photos/1200/600?random=${i}`,
                thumbnailImage: `https://picsum.photos/400/300?random=${i}`,
                galleryImages: [
                    `https://picsum.photos/600/400?random=${i}1`,
                    `https://picsum.photos/600/400?random=${i}2`,
                    `https://picsum.photos/600/400?random=${i}3`
                ],
                promotionalVideo: faker.internet.url(),
                eventMode: randomItem(eventModes),
                venueName: faker.company.name(),
                address: faker.location.streetAddress(),
                city: location.city,
                state: location.state,
                country: "India",
                pincode: faker.location.zipCode(),
                googleMapsLink: "https://maps.google.com",
                meetingLink: faker.internet.url(),
                meetingPassword: faker.internet.password(),

                // Injected time logical fields
                createdAt,
                updatedAt,
                startDate,
                endDate,
                registrationDeadline,

                ticketPrice: faker.number.int({ min: 0, max: 5000 }),
                contactEmail: faker.internet.email(),
                contactPhone: `9${faker.number.int({ min: 100000000, max: 999999999 })}`,
                website: faker.internet.url(),
                socialLinks: {
                    instagram: faker.internet.url(),
                    facebook: faker.internet.url(),
                    linkedin: faker.internet.url(),
                    twitter: faker.internet.url(),
                    youtube: faker.internet.url()
                },
                speakers,
                faqs,
                refundPolicy: faker.lorem.paragraph(),
                termsAndConditions: faker.lorem.paragraph(),
                likes: faker.number.int({ min: 0, max: 1000 }),
                comments,
                availableSeats: totalSeatCounter - registrationCounter,
                registrationCount: totalSeatCounter,
                seatsFilled: registrationCounter,
                status: (endDate <= new Date()) ? "completed" : randomItem(statuses)
            });
        }

        await Event.insertMany(events);
        console.log(`✅ Terminated Event Creating seed for create ${nevent} events`);
        process.exit(0);
    } catch (err) {
        console.log(`❌ Terminated Event Creating seed`);
        console.error(err);
        process.exit(1);
    }
}

seedEvents();
