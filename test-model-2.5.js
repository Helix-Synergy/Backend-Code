require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function testModel() {
  try {
    const systemPrompt = "You are a helpful assistant.";
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt
    });
    const result = await model.generateContent("hello");
    console.log("gemini-2.5-flash success with system instruction!", result.response.text());
  } catch (e) {
    console.error("gemini-2.5-flash failed with system instruction:", e);
  }
}
testModel();
