import { Redis } from 'ioredis';
import { promisify } from 'util';

// Redis serverga ulanish uchun o'zgaruvchilar
const redisHost = process.env.REDIS_HOST || 'localhost'; // Redis serverning host nomi yoki IP manzili
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10); // Redis serverning porti

// Redis klientni yaratish
const client = new Redis({
    host: redisHost, 
    port: redisPort,
    lazyConnect: true, // "true" deb sozlash
});
// Redis-ga ulanish
client.connect();

client.on('connect', function () {
    console.log('Redis serverga muvaffaqiyatli bog\'landi');
});

// Xatolik yuz berib qolganida
client.on('error', function (error) {
    console.error('Redis serverga bog\'lanishda xatolik yuz berdi:', error);
});

// Redis ga ma'lumot yozish va olish uchun yordamchi funksiyalar
const asyncGet = promisify(client.get).bind(client);
const asyncSet = promisify(client.set).bind(client);

// Redisga ma'lumotni yozish
async function setRedisData(key: string, value: any): Promise<void> {
    try {
        await asyncSet(key, JSON.stringify(value));
    } catch (error) {
        console.error('Redisga ma\'lumotni yozishda xatolik yuz berdi:', error);
        throw new Error('Redisga ma\'lumotni yozishda xatolik yuz berdi');
    }
}

// Redisdan ma'lumot olish
async function getRedisData(key: string): Promise<any | null> {
    try {
        const data = await asyncGet(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Redisdan ma\'lumot olishda xatolik yuz berdi:', error);
        throw  Error('Redisdan ma\'lumot olishda xatolik yuz berdi');
    }
}

// Redisga ma'lumotni yangilash
async function updateRedisData(key: string, value: any): Promise<void> {
    try {
        await asyncSet(key, JSON.stringify(value));
    } catch (error) {
        console.error('Redisga ma\'lumotni yangilashda xatolik yuz berdi:', error);
        throw new Error('Redisga ma\'lumotni yangilashda xatolik yuz berdi');
    }
}
async function deleteRedisData(key: string): Promise<void> {
    try {
        await client.del(key);
    } catch (error) {
        console.error('Redisdan ma\'lumotni o\'chirishda xatolik yuz berdi:', error);
        throw new Error('Redisdan ma\'lumotni o\'chirishda xatolik yuz berdi');
    }
}
export { setRedisData, getRedisData, updateRedisData ,deleteRedisData};