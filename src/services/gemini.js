import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCxMVGkhZvR6sGxEzFq8UZRbF3e5pxB_4c";
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeImage = async (imageFile, prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const imageData = await fileToGenerativePart(imageFile);
    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON from potential markdown wrappers
    return text.replace(/```json/g, "").replace(/```/g, "").trim();
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const chatWithAI = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

async function fileToGenerativePart(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        inlineData: {
          data: reader.result.split(",")[1],
          mimeType: file.type
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
