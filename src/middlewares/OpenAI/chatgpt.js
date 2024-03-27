import OpenAI from "openai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);

dotenv.config({
  path: path.resolve(currentDir, '../../../.env'),
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class ChatGPT {
  //Por favor, genera un JSON con la siguiente estructura: { \"oraciones\": [ { \"oracion\": \"xxxx\" }, { \"oracion\": \"xxxx\" }, { \"oracion\": \"xxxx.\" }, { \"oracion\": \"xxxxx\" } ] }",

  async chatgpt(prompt) {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON. Please generate a JSON object with the following structure: {\"words\":[{\"english\":\"palabra\",\"translations\":[\"posible traducción o traducciones\"],\"category\":\"sustantivo, adjetivo, phrasal verb, verbo, etc.\",\"example_sentence\":\"oración de ejemplo\",\"example_sentence_verb_tense\":\"tiempo verbal de la oración de ejemplo\"}]}",

        },

        { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
    });

    console.log(response.choices[0].message.content);


    const responseData = response.choices[0].message.content;
    // Retornar el objeto JSON
    return responseData;
  }

  async chatgptWords(words) {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON. Please generate a JSON object with the following structure: {\"words\":[{\"english\":\"word or pharasal verb\",\"translations\":[\"posible traducción o traducciones\"],\"category\":\"noun, adjetive, phrasal verb, etc.\",\"example_sentence\":\"example sentence\",\"example_sentence_verb_tense\":\"example: simple present, past, future, or continue present, past, future, or perfect, present, past, future, etc. \"}]}",

        },

        { role: "user", content: 'Give me the 10 most common words or phrasal verbs in English, along with their possible translations into Spanish, whether they have one or several, along with their grammatical category, for example, verb, adjective, phrasal verb, noun, etc., and an example sentence with that word, using a different verb tense for each word. Please make sure to include the verb tense of the example sentence. But do not repeat the following words: '+ words },
      ],
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
    });

    console.log(response.choices[0].message.content);


    const responseData = response.choices[0].message.content;
    // Retornar el objeto JSON
    return responseData;
  }


  
}
export default ChatGPT;




