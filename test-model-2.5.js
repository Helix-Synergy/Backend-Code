require('dotenv').config();
const Bytez = require('bytez.js');

async function testModel() {
  try {
    const bytezClient = new Bytez(process.env.BYTEZ_API_KEY);
    const model = bytezClient.model("mistralai/Mistral-7B-Instruct-v0.2");
    
    const systemPrompt = "You are a helpful assistant.";
    const input = [
      { "role": "system", "content": systemPrompt },
      { "role": "user", "content": "hello" }
    ];

    const { error, output } = await model.run(input);
    if (error) {
      console.error("mistralai/Mistral-7B-Instruct-v0.2 failed with system instruction:", error);
    } else {
      console.log("mistralai/Mistral-7B-Instruct-v0.2 success with system instruction!", output);
    }
  } catch (e) {
    console.error("Test failed:", e);
  }
}
testModel();
