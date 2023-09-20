import winston from 'winston';

// Logger yaratish
export const logger = winston.createLogger({
    level: 'info', // Log sifati
    format: winston.format.json(), // JSON format
    transports: [
        new winston.transports.Console(), // Konsolga log chiqarish
        new winston.transports.File({ filename: 'app.log' }), // Faylga log saqlash
    ],
});
