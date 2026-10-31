const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Gallery = require('../models/Gallery');
const Contact = require('../models/Contact');
const Restaurant = require('../models/Restaurant');
const Package = require('../models/Package');
const connectDB = require('../config/db');

dotenv.config({ path: __dirname + '/../.env' });

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await Room.deleteMany();
    await Booking.deleteMany();
    await Gallery.deleteMany();
    await Contact.deleteMany();
    await Restaurant.deleteMany();
    await Package.deleteMany();

    console.log('Seeding Users...');
    // Create Admin User
    const adminUser = await User.create({
      name: 'Resort General Manager',
      email: 'admin@goaresort.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 98221 44550',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });

    // Create Guest User
    const guestUser = await User.create({
      name: 'Rohan Sharma',
      email: 'guest@example.com',
      password: 'guest123',
      role: 'user',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    });

    console.log('Seeding Rooms...');
    const roomsData = [
      {
        name: 'Arabian Sea Panoramic Suite',
        roomType: 'Ocean Suite',
        description:
          'Perched directly above the shimmering shores of Candolim, this ultra-luxurious suite features floor-to-ceiling glass doors opening onto an expansive private teak deck. Enjoy uninterrupted sunset vistas, marble bathroom with ocean-view soaking tub, and dedicated butler service.',
        shortDescription: '180° Arabian sea views with private sun deck and soaking tub.',
        pricePerNight: 12500,
        discountPrice: 10999,
        capacity: { adults: 2, children: 1, maxGuests: 3 },
        bedType: 'Custom King Bed',
        sizeSqFt: 680,
        view: 'Direct Ocean View',
        amenities: [
          'Ocean View Balcony',
          'Private Soaking Tub',
          'Free High-speed Wi-Fi',
          'Complimentary Breakfast',
          '24/7 Room Service',
          'Espresso Machine',
          'Luxury Bathrobes & Slippers',
          'Infinity Pool Access',
        ],
        images: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
        ],
        featured: true,
        ratingsAverage: 4.9,
        numReviews: 34,
      },
      {
        name: 'Royal Portuguese Beach Villa',
        roomType: 'Royal Villa',
        description:
          'An authentic Goan Portuguese-heritage private villa nested among sway palm trees with private plunge pool, outdoor shower, handcrafted antique Goan wood furnishings, and private direct pathway down to the sandy beach.',
        shortDescription: 'Private villa with plunge pool, lush tropical garden, and direct beach trail.',
        pricePerNight: 24000,
        discountPrice: 21500,
        capacity: { adults: 4, children: 2, maxGuests: 6 },
        bedType: '2 King Beds',
        sizeSqFt: 1450,
        view: 'Private Garden & Sea Breeze',
        amenities: [
          'Private Plunge Pool',
          'Direct Beach Trail Access',
          'Outdoor Rainforest Shower',
          'Full Living & Dining Lounge',
          'High-speed Wi-Fi',
          'Complimentary Airport Transfer',
          'Personal Concierge',
          'Chef Breakfast Included',
        ],
        images: [
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80',
        ],
        featured: true,
        ratingsAverage: 5.0,
        numReviews: 28,
      },
      {
        name: 'Sunset Beachfront Cottage',
        roomType: 'Beachfront Cottage',
        description:
          'Step barefoot directly onto the golden sand from your wooden verandah. Decorated with breezy coastal fabrics, eco-friendly bamboo trims, hammock lounge, and sound of gentle Arabian sea waves lulling you to rest.',
        shortDescription: 'Rustic-luxe cottage directly on the sand with private hammock deck.',
        pricePerNight: 8900,
        discountPrice: 7999,
        capacity: { adults: 2, children: 1, maxGuests: 3 },
        bedType: 'King Four-Poster Bed',
        sizeSqFt: 520,
        view: 'Beachfront Sands',
        amenities: [
          'Direct Beachfront Patio',
          'Verandah Hammock',
          'Air Conditioning',
          'Free High-speed Wi-Fi',
          'Daily Fresh Fruit Basket',
          'Eco Spa Toiletries',
        ],
        images: [
          'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1000&q=80',
        ],
        featured: true,
        ratingsAverage: 4.8,
        numReviews: 42,
      },
      {
        name: 'Tropical Lagoon Deluxe Room',
        roomType: 'Deluxe Room',
        description:
          'Warmly appointed room overlooking our cascading freshwater lagoon pool and bougainvillea gardens. Features plush king bedding, ergonomic workstation, rain shower, and private balcony for morning tea.',
        shortDescription: 'Balcony overlooking lagoon pool, plush linens, and calm greenery.',
        pricePerNight: 6500,
        discountPrice: 5800,
        capacity: { adults: 2, children: 1, maxGuests: 3 },
        bedType: 'King Bed or Twin Beds',
        sizeSqFt: 420,
        view: 'Lagoon Pool & Palm Gardens',
        amenities: [
          'Balcony with Pool View',
          'Free High-speed Wi-Fi',
          'Rainfall Shower',
          '55" 4K Smart TV',
          'Mini Bar',
          'Buffet Breakfast Included',
        ],
        images: [
          'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1000&q=80',
        ],
        featured: false,
        ratingsAverage: 4.7,
        numReviews: 21,
      },
      {
        name: 'Executive Super Deluxe Club',
        roomType: 'Super Deluxe',
        description:
          'Elevated luxury with exclusive executive club lounge access, evening cocktail hours, spacious living nook, deep soak bathtub, and custom pillow menu for the ultimate restorative Goan vacation.',
        shortDescription: 'Includes Club Lounge access, cocktail privileges, and luxury bathtub.',
        pricePerNight: 9500,
        discountPrice: 8500,
        capacity: { adults: 2, children: 2, maxGuests: 4 },
        bedType: 'Plush King Bed',
        sizeSqFt: 550,
        view: 'Resort Gardens & Horizon Sea',
        amenities: [
          'Club Lounge Access',
          'Complimentary Sunset Cocktails',
          'Luxury Marble Bathtub',
          'Espresso Machine',
          'High-speed Wi-Fi',
          'Turn-down Service with Goan Sweets',
        ],
        images: [
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
        ],
        featured: false,
        ratingsAverage: 4.8,
        numReviews: 19,
      },
      {
        name: 'The Goa Grand Penthouse Suite',
        roomType: 'Ocean Suite',
        description:
          'The pinnacle of Goa Resort luxury. Occupying the entire top level with private rooftop infinity jacuzzi, panoramic Arabian sunset deck, private bar, master bedroom, and state-of-the-art audiovisual lounge.',
        shortDescription: 'Rooftop private infinity jacuzzi with 360-degree ocean & sunset horizon.',
        pricePerNight: 32000,
        discountPrice: 28500,
        capacity: { adults: 4, children: 2, maxGuests: 6 },
        bedType: 'Master King + Second King',
        sizeSqFt: 2100,
        view: '360° Arabian Sea & Goa Coastline',
        amenities: [
          'Private Rooftop Jacuzzi',
          'Full Coastal Bar & Wine Cellar',
          'Dedicated Private Chef Service',
          'Airport Limousine Transfer',
          'Chauffeured Luxury Car for Sightseeing',
          'Spa Treatments Included',
        ],
        images: [
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80',
        ],
        featured: true,
        ratingsAverage: 5.0,
        numReviews: 15,
      },
    ];

    const createdRooms = await Room.insertMany(roomsData);

    console.log('Seeding Gallery...');
    const galleryData = [
      {
        title: 'Sunset Over Candolim Coast',
        category: 'Beach',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
        description: 'Golden hour at our private beachfront deck in Goa.',
        featured: true,
      },
      {
        title: 'Infinity Edge Ocean Pool',
        category: 'Spa & Pool',
        imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80',
        description: 'Where the pool water merges with the Arabian horizon.',
        featured: true,
      },
      {
        title: 'Beachside Candlelight Dining',
        category: 'Dining',
        imageUrl: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1000&q=80',
        description: 'Fresh seafood barbecue and authentic Goan curries by the sea.',
        featured: true,
      },
      {
        title: 'Arabian Sea Suite Deck',
        category: 'Suites',
        imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
        description: 'Panoramic luxury wakeups every single morning.',
        featured: true,
      },
      {
        title: 'Ayurvedic Spa Sanctuary',
        category: 'Spa & Pool',
        imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
        description: 'Holistic wellness treatments using organic Goan oils.',
        featured: true,
      },
      {
        title: 'Beach Cabana Chill',
        category: 'Sunset & Vibe',
        imageUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1000&q=80',
        description: 'Curated tropical cocktails and acoustic seaside evenings.',
        featured: true,
      },
      {
        title: 'Portuguese Heritage Courtyard',
        category: 'Suites',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
        description: 'Colonial archways surrounded by tropical palms and frangipani.',
        featured: false,
      },
      {
        title: 'Bayside Tiki Bar & Cocktails',
        category: 'Dining',
        imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=80',
        description: 'Handcrafted feni infusions and artisanal sunset cocktails.',
        featured: false,
      },
    ];

    await Gallery.insertMany(galleryData);

    console.log('Seeding Sample Bookings...');
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + 5);
    const checkOutDate = new Date();
    checkOutDate.setDate(checkOutDate.getDate() + 8);

    await Booking.create({
      user: guestUser._id,
      room: createdRooms[0]._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: { adults: 2, children: 1 },
      totalNights: 3,
      roomPrice: createdRooms[0].discountPrice,
      taxAmount: Math.round(createdRooms[0].discountPrice * 3 * 0.12),
      totalAmount: Math.round(createdRooms[0].discountPrice * 3 * 1.12),
      bookingStatus: 'Confirmed',
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card (Visa)',
      guestDetails: {
        name: 'Rohan Sharma',
        email: 'guest@example.com',
        phone: '+91 98765 43210',
        specialRequests: 'High floor ocean-facing room requested with late check-in.',
      },
    });

    console.log('Seeding Sample Inquiries...');
    await Contact.create([
      {
        name: 'Priya Verma',
        email: 'priya.v@gmail.com',
        phone: '+91 98112 33445',
        subject: 'Destination Wedding Inquiry',
        message: 'Looking to book 20 rooms for a 3-day wedding celebration in November. Please share banquet and lawn packages.',
        status: 'unread',
      },
      {
        name: 'David Miller',
        email: 'david.m@uktravel.com',
        phone: '+44 7911 123456',
        subject: 'Airport Pickup & Suite Availability',
        message: 'Arriving at Dabolim airport next Monday. Can we arrange chauffeur service directly to Goa Resort?',
        status: 'read',
      },
    ]);

    console.log('Seeding Restaurant Menu Items...');
    await Restaurant.create([
      {
        name: 'Butter Garlic Jumbo Tiger Prawns',
        category: 'Goan Seafood',
        description: 'Locally caught fresh Arabian Sea tiger prawns tossed in rich golden garlic herb butter, white wine, and freshly cracked black pepper.',
        price: 1250,
        image: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        isChefSpecial: true,
        spicyLevel: 'Medium',
      },
      {
        name: 'Goan Traditional Fish Curry Thali',
        category: 'Goan Seafood',
        description: 'Authentic coconut and kokum yellow curry served with freshly caught Kingfish, steamed Goan red rice, cabbage foogath, and fried kismoor.',
        price: 850,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        isChefSpecial: true,
        spicyLevel: 'Spicy',
      },
      {
        name: 'Crispy Kingfish Rava Fry',
        category: 'Starters',
        description: 'Fresh kingfish steaks marinated in spicy red Goan recheado masala, coated in golden semolina and shallow fried till crunchy.',
        price: 720,
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        isChefSpecial: false,
        spicyLevel: 'Medium',
      },
      {
        name: 'Portuguese Chicken Peri-Peri Espetada',
        category: 'Grill & BBQ',
        description: 'Tender chicken skewers basted in house-smoked peri-peri bird eye chili glaze, grilled over beach coals with roasted capsicum.',
        price: 950,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        isChefSpecial: true,
        spicyLevel: 'Spicy',
      },
      {
        name: 'Goan Paneer Xacuti with Poi Bread',
        category: 'Main Course',
        description: 'Silken paneer cubes simmered in a dark roasted coconut and 16-spice aromatic gravy, served with hot crusty Goan poi bread.',
        price: 680,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
        isVeg: true,
        isChefSpecial: false,
        spicyLevel: 'Medium',
      },
      {
        name: 'Tandoori Rock Lobster Thermidor',
        category: 'Grill & BBQ',
        description: 'Whole rock lobster gratinated with creamy dijon béchamel, aged gruyère cheese, and finished over charcoal embers.',
        price: 2400,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        isChefSpecial: true,
        spicyLevel: 'Mild',
      },
      {
        name: 'Candolim Sunset Sangria Pitcher',
        category: 'Cocktails & Beverages',
        description: 'Spanish red wine infused with fresh Goan mango, passionfruit, orange slices, and a dash of Portuguese brandy.',
        price: 1400,
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
        isVeg: true,
        isChefSpecial: false,
        spicyLevel: 'None',
      },
      {
        name: 'Kokum Mojito with Cashew Feni',
        category: 'Cocktails & Beverages',
        description: 'Heritage cashew feni muddled with fresh mint, wild kokum syrup, lime juice, and sparkling soda on crushed ice.',
        price: 550,
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
        isVeg: true,
        isChefSpecial: true,
        spicyLevel: 'None',
      },
      {
        name: 'Traditional Goan Bebinca',
        category: 'Desserts',
        description: 'Seven-layered warm Indo-Portuguese coconut milk pudding served with artisan vanilla bean ice cream and toasted almonds.',
        price: 450,
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
        isVeg: true,
        isChefSpecial: true,
        spicyLevel: 'None',
      },
    ]);

    console.log('Seeding Holiday Packages...');
    await Package.create([
      {
        title: 'Royal Goan Honeymoon Escapade',
        category: 'Honeymoon',
        duration: '4 Days / 3 Nights',
        price: 48000,
        discountPrice: 42500,
        description: 'An idyllic romantic sanctuary created exclusively for couples. Celebrate your love with private ocean suites, beach dinners under the stars, and soothing seaside spa indulgence.',
        inclusions: [
          'Arabian Sea Suite with Private Jacuzzi',
          'Private 4-Course Candlelight Dinner on Candolim Beach',
          'Daily Champagne Breakfast in Suite or Bed',
          '60-min Couple Ayurvedic Harmony Spa Treatment',
          'Complimentary Luxury Chauffeur Airport Transfers',
          'Welcome Goan Port Wine & Flower Bed Setup',
        ],
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
        featured: true,
        ratingsAverage: 5.0,
      },
      {
        title: 'Candolim Coastal Wellness & Yoga Retreat',
        category: 'Wellness & Spa',
        duration: '5 Days / 4 Nights',
        price: 55000,
        discountPrice: 48999,
        description: 'Rebalance mind, body, and spirit by the soothing Arabian tides. Features private Ayurvedic doctor consultations, daily sunrise yoga, detoxifying diets, and restorative ocean views.',
        inclusions: [
          'Portuguese Heritage Garden Villa Stay',
          'Daily Sunrise Beach Yoga & Sound Healing Meditation',
          'Personalized Ayurvedic Consultation & Daily Herbal Massages',
          'Full Board Detoxifying Organic Farm-to-Table Meals',
          'Private Steam, Sauna & Infinity Pool Access',
          'Guided Mindful Morning Nature Walk along Fort Aguada',
        ],
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
        featured: true,
        ratingsAverage: 4.9,
      },
      {
        title: 'All-Inclusive Family Tropical Fiesta',
        category: 'Family Getaway',
        duration: '4 Days / 3 Nights',
        price: 62000,
        discountPrice: 54999,
        description: 'The ultimate vacation for the entire family. Luxurious 2-bedroom villas, unlimited dining for adults and kids, thrilling water sports, and curated heritage excursions.',
        inclusions: [
          '2-Bedroom Royal Portuguese Villa (Up to 4 Adults + 2 Kids)',
          'All Buffet Meals & Unlimited Kids Poolside Snacks & Smoothies',
          'Complimentary Water Sports Pass (Parasailing, Jet Ski & Banana Ride)',
          'Full-Day Chauffeur Driven North Goa Sightseeing Tour',
          'Evening Goan Cultural Folk Dance & Live Music Show',
          'Kids Beach Activity Club & Sandcastle Workshops',
        ],
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80',
        featured: false,
        ratingsAverage: 4.8,
      },
      {
        title: 'Sunset Yacht & Heritage Weekend Escape',
        category: 'Weekend Escape',
        duration: '3 Days / 2 Nights',
        price: 38000,
        discountPrice: 32999,
        description: 'Quick recharge weekend designed for luxury seekers. Enjoy a sunset catamaran sail, handcrafted cocktails, exquisite Portuguese dining, and flexible checkout.',
        inclusions: [
          'Direct Ocean View Suite with Sundeck',
          'Private 2-Hour Sunset Catamaran Cruise with Wine & Canapés',
          'Daily Chef Multi-Cuisine Breakfast Buffet',
          'Guided Heritage Tour of Old Goa Churches & Latin Quarter',
          'Guaranteed Late Checkout until 4:00 PM on Sunday',
        ],
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
        featured: true,
        ratingsAverage: 4.9,
      },
    ]);

    console.log('Database seeded successfully!');
    console.log('----------------------------------------------------');
    console.log('Admin Account: admin@goaresort.com / admin123');
    console.log('Guest Account: guest@example.com / guest123');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
