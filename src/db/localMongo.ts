import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config(); // .env faylidan o'qib oladi

async function main() {
    const client = new MongoClient(process.env.Local_URL_DB as string);
    try {
        await client.connect();
        console.log('MongoDB ga ulandik!');
    } finally {
        await client.close();
    }
}

main().catch(console.error);