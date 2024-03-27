//Nombre Archivo : DynamoDB-Model.js
import DynamoDB from '../config/AWS/dynamoDB/dynamoDBConfig.js';
import { v4 as uuidv4 } from 'uuid';


class DynamoDBModel {

    constructor() {
        this._dynamoDB = DynamoDB.getInstance();
    }



    async getOnlyWords() {
        const response = await this._dynamoDB.scan({
            TableName: DynamoDB.TABLE_NAME,
            FilterExpression: 'ENTITY_TYPE = :entity_type',
            ExpressionAttributeValues: {
                ':entity_type': { S: 'VOCABULARY' }
            }
        }).promise();

        const items = (response.Items != null) ? response.Items : [];

        if (items.length === 0) {
            // Si no se encuentra ninguna palabra en la base de datos, retornar un valor indicativo, como una cadena vacía.
            return '';
        }
    
        const words = items.map(item => item.english.S ?? '');
        const concatenatedWords = words.join(', ');
    
        return concatenatedWords;
    }



    async getAllWords() {
        const response = await this._dynamoDB.scan({
            TableName: DynamoDB.TABLE_NAME,
            FilterExpression: 'ENTITY_TYPE = :entity_type',
            ExpressionAttributeValues: {
                ':entity_type': { S: 'VOCABULARY' }
            }
        }).promise();

        const items = (response.Items != null) ? response.Items : [];

        const words = items.map(item => {
            const wordID = item['ENGLISH-APP_PK'].S ?? '';
            const english = item.english.S ?? '';
            const translations = item.translations.S ?? '';
            const category = item.category.S ?? '';
            const example_sentence = item.example_sentence.S ?? '';
            const example_sentence_verb_tense = item.example_sentence_verb_tense.S ?? '';

            return {
                wordID: wordID.split('_')[1],
                english,
                translations,
                category,
                example_sentence,
                example_sentence_verb_tense
            };
        });
        return words;
    }

    async getRandomWords() {
        const words = await this.getAllWords();
        const randomIndexes  = await this._getRandomIndexes(words.length, 10);
        const randomWords = randomIndexes.map(index => words[index]);
        return randomWords;

    }

   async _getRandomIndexes(max, count) {
        const indexes = [];
        while (indexes.length < count) {
            const randomIndex = Math.floor(Math.random() * max);
            if (!indexes.includes(randomIndex)) {
                indexes.push(randomIndex);
            }
        }
        return indexes;
    }



    async insertWord(word) {
        const wordID = uuidv4(); // Genera un nuevo UUID
        const translations = word.translations.join(', '); // Convertir el array de traducciones a una cadena
        await this._dynamoDB.putItem({
            TableName: DynamoDB.TABLE_NAME,
            Item: {
                //la S es para string
                'ENGLISH-APP_PK': { S: `WORD_${wordID}` },
                'ENGLISH-APP_FK': { S: `WORD_${wordID}` },
                'ENTITY_TYPE': { S: 'VOCABULARY' },
                'english': { S: word.english },
                'translations': { S: translations },
                'category': { S: word.category },
                'example_sentence': { S: word.example_sentence},
                'example_sentence_verb_tense': { S: word.example_sentence_verb_tense } // Agregar el tiempo del ejemplo
            }
        }).promise();
        return word;
    }


    async getWordByName(english) {
        const response = await this._dynamoDB.scan({
            TableName: DynamoDB.TABLE_NAME,
            FilterExpression: 'english = :english',
            ExpressionAttributeValues: {
                ':english': { S: english }


            }
        }).promise();

        const items = (response.Items != null) ? response.Items[0] : undefined;
        if (items == null) {
            return null;
        }

        const verbObj = {
            verbID: items['ENGLISH-APP_PK'].S.split('_')[1],
            category: items.category.S,
            english: items.english.S,
            translations: items.translations.S,
            example_sentence: items.example_sentence.S,
            example_sentence_verb_tense: items.example_sentence_verb_tense.S,
        };
        return verbObj;


    }


    async insertListWords(verbs) {
        let insert = false;
        const uniqueWords = []; // Array para almacenar las palabras únicas a insertar
        const wordsDB = await this.getAllWords();



        



       

         for (const verb of verbs.words) {
            const existingWord = wordsDB.find(word => word.english.toUpperCase() === verb.english.toUpperCase());
            if (!existingWord) {
                uniqueWords.push(verb);
            }

         }
        
    
        const verbsToInsert = uniqueWords.map(verb => { 
            const WordID = uuidv4();
            return {
                PutRequest: {
                    Item: {
                        'ENGLISH-APP_PK': { S: `WORD_${WordID}` },
                        'ENGLISH-APP_FK': { S: `WORD_${WordID}` },
                        'ENTITY_TYPE': { S: 'VOCABULARY' },
                        'english': { S: verb.english },
                        'translations': { S: verb.translations.join(', ') },
                        'category': { S: verb.category },
                        'example_sentence': { S: verb.example_sentence },
                        'example_sentence_verb_tense': { S: verb.example_sentence_verb_tense }
                    }
                }
            };
        });
    
        const batchRequests = [];
        while (verbsToInsert.length > 0) {
            batchRequests.push({
                RequestItems: {
                    [DynamoDB.TABLE_NAME]: verbsToInsert.splice(0, 25)
                }
            });
        }
    
        for (const request of batchRequests) {
            await this._dynamoDB.batchWriteItem(request).promise();
        }
    
        return uniqueWords; // Devolver solo las palabras únicas insertadas
    }
    




    async updateWord(word) {
        await this._dynamoDB.updateItem({
            TableName: DynamoDB.TABLE_NAME,
            Key: {
                'ENGLISH-APP_PK': { S: `WORD_${word.verbID}` },
                'ENGLISH-APP_FK': { S: `WORD_${word.verbID}` }
            },
            UpdateExpression: 'SET category = :category, english = :english, translations = :translations, example_sentence = :example_sentence, example_sentence_verb_tense = :example_sentence_verb_tense',
            ExpressionAttributeValues: {
                ':category': { S: word.category },
                ':english': { S: word.english },
                ':translations': { S: word.translations },
                ':example_sentence': { S: word.example_sentence },
                ':example_sentence_verb_tense': { S: word.example_sentence_verb_tense }
            }
        }).promise();
        return word;
    }


    async deleteWord(wordID) {
        await this._dynamoDB.deleteItem({
            TableName: DynamoDB.TABLE_NAME,
            Key: {
                'ENGLISH-APP_PK': { S: `WORD_${wordID}` },
                'ENGLISH-APP_FK': { S: `WORD_${wordID}` }
            }
        }).promise();
    }

    async getWordById(wordID) {
        const response = await this._dynamoDB.getItem({
            TableName: DynamoDB.TABLE_NAME,
            Key: {
                'ENGLISH-APP_PK': { S: `WORD_${wordID}` },
                'ENGLISH-APP_FK': { S: `WORD_${wordID}` }
            }
        }).promise();
        const item = response.Item;
        if (item == null) {
            return null;
        }
        return {
            wordID: wordID,
            category: item.category.S,
            english: item.english.S,
            translations: item.translations.S,
            example_sentence: item.example_sentence.S,
            example_sentence_verb_tense: item.example_sentence_verb_tense.S
        };
    }

   


}

export default DynamoDBModel;


