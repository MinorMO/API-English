// verbsRoutes.js
import express from 'express';
import { getRandomWords,getAllWords,insertWord, insertListWords,deleteWord,updateWord,getWordById,getWordByName} from '../controllers/verbsController.js';
import { chatgpt,Wordschatgpt } from '../controllers/OpenAIController.js';
const router = express.Router();

// Rutas más específicas primero
router.get('/verbs/ByID/:id', getWordById); // Ruta para obtener un verbo por ID
router.get('/verbs/ByName/:verbInEnglish', getWordByName); // Ruta para obtener un verbo por nombre

// Rutas más generales después
router.get('/words', getAllWords); // Ruta para obtener todos los verbos
router.post('/verbs', insertWord); // Ruta para insertar un verbo
router.put('/verbs', updateWord); // Ruta para actualizar un verbo
router.delete('/verbs/:id', deleteWord); // Ruta para eliminar un verbo por ID
router.post('/verbs/list', insertListWords); // Ruta para insertar una lista de verbos
router.post('/chatgpt', chatgpt); // Ruta para obtener una respuesta de ChatGPT
router.get('/randomwords', getRandomWords); // Ruta para obtener una respuesta de ChatGPT
router.get('/wordschatgpt', Wordschatgpt); // Ruta para obtener una respuesta de ChatGPT


export default router;

