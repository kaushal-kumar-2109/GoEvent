require("dotenv").config();
require("../config/db.connect.js");
const { faker } = require("@faker-js/faker");
const Event = require("../src/models/event.model.js");
const User = require("../src/models/user.model.js");

const n_event = 4000;

const categories = [
    "Music", "Technology", "Sports", "Business", "Workshop", "Education", "Gaming", "Food", "Fashion", "Health"
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
const eventModes = ["PUBLIC", "PRIVATE", "ALL"];

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const createEvents = async () => {
    await Event.deleteMany({});
    console.log("🧹 All events deleted");

    const users = await User.find();
    console.log("Users found successfully", users.length);

    for (let i = 0; i < n_event; i++) {
        const organizer = randomItem(users);
        const location = randomItem(cities);
        const createdAt = faker.date.past({ years: 1 });
        const updatedAt = new Date(createdAt);
        const startDate = new Date(
            createdAt.getTime() +
            faker.number.int({ min: 7, max: 30 }) * 24 * 60 * 60 * 1000
        );
        const endDate = new Date(
            startDate.getTime() +
            faker.number.int({ min: 2, max: 15 }) * 60 * 60 * 1000
        );
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

        let event = {
            title: faker.company.catchPhrase(),
            shortDescription: faker.lorem.sentence(),
            description: faker.lorem.paragraphs(4),
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
            promotionalVideo: "https://cdn.pixabay.com/video/2019/04/06/22634-328940142_large.mp4",
            eventType: randomItem(eventModes),
            venueName: faker.company.name(),
            address: faker.location.streetAddress(),
            city: location.city,
            state: location.state,
            pincode: faker.location.zipCode(),
            googleMapsLink: "https://maps.google.com",
            startDate,
            endDate,
            registrationDeadline,
            ticketPrice: faker.number.int({ min: 0, max: 5000 }),
            availableSeats: totalSeatCounter - registrationCounter,
            seatsFilled: registrationCounter,
            totalSeats: totalSeatCounter,
            contactEmail: faker.internet.email(),
            contactPhone: `9${faker.number.int({ min: 100000000, max: 999999999 })}`,
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
            status: (endDate <= new Date()) ? "COMPLETED" : (startDate <= new Date()) ? "STARTED" : (registrationDeadline <= new Date()) ? "PENDING" : randomItem(["PUBLISHED", "CANCELLED", "DELETED", "DRAFT"]),

            createdAt,
            updatedAt,

        };

        try {
            await Event.create(event);
            if (i % 1000 === 0) {
                console.log(`${i} events created successfully - ${n_event}`);
            }
        } catch (error) {
            console.error("Error creating event", error);
        }
    }
    console.log(`${n_event} events created successfully`);
    process.exit(0);
}

createEvents();