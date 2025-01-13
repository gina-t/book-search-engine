import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Construct the absolute path to the server.env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../env/server.env') });

console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);
console.log('PORT:', process.env.PORT);
