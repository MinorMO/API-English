import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import EnglishBackendApp from './EnglishBackendApp.js';

try {
    const currentFilePath = fileURLToPath(import.meta.url);
    const currentDir = path.dirname(currentFilePath);
    
    dotenv.config({
        path: path.resolve(currentDir, '../.env'),
    });

    await new EnglishBackendApp().start();
} catch (error) {
    console.log(error);
}
