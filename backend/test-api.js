import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

async function runTest() {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("❌ ERROR: GOOGLE_API_KEY .env file mein nahi mili.");
      return;
    }

    // Yeh check karne ke liye ki key load ho rahi hai ya nahi
    console.log("Key loaded:", apiKey.substring(0, 4) + "..." + apiKey.substring(apiKey.length - 4));

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    console.log("Gemini ko prompt bhej rahe hain...");
    const result = await model.generateContent("Hello");
    const response = await result.response;
    const text = response.text();

    console.log("✅ SUCCESS! AI ka Jawab:", text);

  } catch (error) {
    console.error("❌ TEST FAILED! Error Details:");
    console.error(error);
  }
}

runTest();