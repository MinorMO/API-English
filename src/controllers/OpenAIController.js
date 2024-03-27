import ChatGPT from '../middlewares/OpenAI/chatgpt.js';
import DynamoDBModel from '../models/DynamoDB-Model.js'

const bot = new ChatGPT();

const chatgpt = async (req, res) => {
    try {
        if (!req.body || !req.body.prompt) {
            return res.status(400).json({ error: 'El cuerpo de la solicitud debe contener un campo "prompt".' });
        }

        // Extrae el mensaje del cuerpo de la solicitud
        const prompt = req.body.prompt;

        const result = await bot.chatgpt(prompt);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const Wordschatgpt = async (req, res) => {
    try {
       
        let words = await new DynamoDBModel().getOnlyWords();

    

        const result = JSON.parse(await bot.chatgptWords(words)) ;

 

        await new DynamoDBModel().insertListWords(result);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export {
    chatgpt,
    Wordschatgpt
};