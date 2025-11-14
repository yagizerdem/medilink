import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/https";
import { defineString } from "firebase-functions/params";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "firebase-functions";

const GEMINI_API_KEY = defineString("GEMINI_API_KEY");
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY.value()!);

admin.initializeApp();

export const drugInfo = onRequest(async (req, res) => {
  try {
    const drugName = req.query.name as string;

    if (!drugName) {
      res.status(400).json({
        error: "Missing 'name' query parameter. Example: ?name=paracetamol",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
      Provide medically accurate information about this drug:
      - Drug: ${drugName}
      - Explain its common uses
      - Possible side effects
      - Drug interactions (very important)
      - Contraindications
      - Warnings
      Format response in JSON:
      {
        "uses": "...",
        "side_effects": "...",
        "interactions": "...",
        "contraindications": "...",
        "warnings": "..."
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.status(200).send(text);
  } catch (err) {
    logger.log(err);
    res.status(500).json({ error: "Internal error", details: `${err}` });
  }
});
