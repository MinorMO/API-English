// verbsController.js
import DynamoDBModel from '../models/DynamoDB-Model.js';

const dynamoDBModel = new DynamoDBModel();

const getAllWords = async (req, res) => {
    try {
        const words = await dynamoDBModel.getAllWords();
        res.json({ words });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getRandomWords = async (req, res) => {
    try {
        const verbs = await dynamoDBModel.getRandomWords();
        res.json(verbs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const insertWord = async (req, res) => {
    try {
        const verbData = req.body;
        const response = await dynamoDBModel.insertWord(verbData);
        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const insertListWords = async (req, res) => {
    try {
        const verbs = req.body;
        const response = await dynamoDBModel.insertListWords(verbs);
        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteWord = async (req, res) => {
    try {
        const verbID = req.params.id;
        await dynamoDBModel.deleteWord(verbID);
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateWord = async (req, res) => {
    try {
        const verbData = req.body;
        const response = await dynamoDBModel.updateWord(verbData);
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getWordById = async (req, res) => {
    try {
        const verbID = req.params.id;
        const verb = await dynamoDBModel.getWordById(verbID);
        if (verb == null) {
            res.status(404).json({ error: 'Verb not found' });
            return;
        }
        res.json(verb);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getWordByName = async (req, res) => {
    try {
        const verbInEnglish = req.params.verbInEnglish;
        const verb = await dynamoDBModel.getWordByName(verbInEnglish);
        if (verb == null) {
            res.status(404).json({ error: 'Verb not found' });
            return;
        }
        res.json(verb);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export {
    getAllWords,
    insertWord,
    insertListWords,
    deleteWord,
    updateWord,
    getWordById,
    getWordByName,
    getRandomWords
};

