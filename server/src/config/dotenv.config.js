import dotenv from 'dotenv';

dotenv.config();

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@memotrip.thiiehr.mongodb.net/?retryWrites=true&w=majority&appName=MemoTrip`;

export default MONGO_URI;