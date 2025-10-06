import { GoogleGenerativeAI } from "@google/generative-ai"; 
import { Promt } from "../model/promt.model.js";
import 'dotenv/config';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
// console.log("Loaded Google API Key:", process.env.GOOGLE_API_KEY);


export const sendPromt = async (req, res) => {
    const { content } = req.body;
    const userId = req.userId;

    if (!content || content.trim() === "") {
        return res.status(400).json({ errors: "Promt content is required" });
    }

    try {
        //save user promt
        const userPromt = await Promt.create({
            userId,
            role: "user",
            content,
        });

        // Pick model
        const model = genAI.getGenerativeModel({ model:  "gemini-flash-latest" });

        // Generate AI response
        const result = await model.generateContent(content);
        const aiContent = result.response.text();

        // Save AI response
        //ai message
        const aiMessage = await Promt.create({
            userId,
            role: "assistant",
            content: aiContent,
        });

        return res.status(200).json({ reply: aiContent });

    } catch (error) {
        console.log("Error in Promt: ", error);
        return res
            .status(500)
            .json({ error: "Something went wrong with the AI response" });
    }
};




