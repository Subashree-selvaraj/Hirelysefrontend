// pages/api/ats-gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { resumeText, jobDescription } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
Compare the following resume and job description, and provide an in-depth ATS alignment analysis in the following structured format:

1. Aligned Areas (mention key matches between resume and JD)
2. Not Aligned (point out specific mismatches or missing elements and why)
3. Suggestions (improve alignment — specific edits/phrases to add)
4. Summary (brief final assessment)

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.status(200).json({ alignmentAnalysis: text });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Failed to generate ATS analysis" });
  }
}
