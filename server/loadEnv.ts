import dotenv from "dotenv";

const result = dotenv.config();

if (result.error) {
  console.error("Error loading .env file", result.error);
  // Pertimbangkan untuk throw error di sini jika DATABASE_URL sangat krusial dan tidak ada default
  // throw result.error;
}

// Anda bisa menambahkan console.log di sini untuk debugging jika diperlukan
// console.log('loadEnv.ts: DATABASE_URL is', process.env.DATABASE_URL);
// console.log('All loaded env vars:', result.parsed);
