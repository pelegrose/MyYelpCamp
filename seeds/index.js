const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const images = [
            {
                url: 'https://res.cloudinary.com/drtg8wasj/image/upload/v1604503062/YelpCamp/sfn59oagq5obnts4dkad.jpg',
                filename: 'YelpCamp/sfn59oagq5obnts4dkad'
            },
            {
                url: 'https://res.cloudinary.com/drtg8wasj/image/upload/v1604503066/YelpCamp/bgnqrgxyrwtwpzbcvdua.jpg',
                filename: 'YelpCamp/bgnqrgxyrwtwpzbcvdua'
            }
        ];

        const location = `${cities[random1000].city}, ${cities[random1000].state}`;
        const geometry = {
            type: 'Point',
            coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude
            ]
        };
        const camp = new Campground({
            author: '5fa29b5c00a8b5031a68cce0',
            location,
            title: `${sample(descriptors)} ${sample(places)}`,
            images,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas a voluptas inventore error,' +
                ' tempore qui laborum nam dignissimos accusantium? Rerum labore, quidem dolores quia inventore ipsam nulla totam in amet.',
            price,
            geometry
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})