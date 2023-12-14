#! /usr/bin/env node
import "dotenv/config";
import readline from "node:readline";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const newMessage = async (history, message) => {
  const results = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [...history, message],
  });

  return results.choices[0].message;
};

const formatMessage = (userInput) => ({ role: "user", content: userInput });

const chat = () => {
  const history = [
    {
      role: "system",
      content:
        "You are an AI assistant answer the qeustions of the best of your ability, by the way my name is diego",
    },
  ];
  const start = () => {
    rl.question("You: ", async (userInput) => {
      if (userInput.toLowerCase() === "exit") {
        rl.close();
        return;
      }

      const userMessage = formatMessage(userInput);
      const response = await newMessage(history, userMessage);
      history.push(userMessage, response);
      console.log(`\n\nAI: ${response.content}`);
      start();
    });
  };
  start();
};

console.log("Chatbot initialized. Type 'exit' to end the chat.");
chat();
