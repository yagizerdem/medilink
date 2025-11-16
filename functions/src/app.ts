import { defineString } from "firebase-functions/params";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "firebase-functions";
import express from "express";

// ENV
const GEMINI_API_KEY = defineString("GEMINI_API_KEY");
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY.value()!);

// Express App
const app = express();
app.use(express.json());

// Route: /drug-info/:drugName
app.get("/drug-info/:drugName", async (req, res) => {
  try {
    const drugName = req.params.drugName;

    if (!drugName) {
      return res.status(400).json({
        error: "Missing 'drugName' in URL. Example: /drug-info/paracetamol",
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

    return res.status(200).send(text);
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: "Internal error", details: `${err}` });
  }
});

app.post("/drug-interactions", async (req, res) => {
  try {
    const drugs: string[] = req.body.drugs;

    if (!drugs || !Array.isArray(drugs) || drugs.length < 1) {
      return res.status(400).json({
        error:
          "Invalid request." +
          ' Provide {"drugs":["aspirin"]} or multiple drugs.',
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    let prompt = "";

    if (drugs.length === 1) {
      const drug = drugs[0];
      prompt = `
Provide extremely short structured data for: ${drug}

Return JSON ONLY:

{
  "drug": "${drug}",
  "uses": "max 5 words",
  "side_effects": "max 5 words",
  "contraindications": "max 5 words",
  "warnings": "max 5 words",
  "interactions": "max 5 words"
}

Rules:
- No sentences.
- No markdown.
- No extra text.
- If unknown, write "Unknown".
`;
    } else {
      prompt = `
Analyze interactions between: ${drugs.join(", ")}

Return ONLY valid JSON:

{
  "summary": "max 6 words",
  "critical_pairs": [
    {
      "drugA": "nameA",
      "drugB": "nameB",
      "risk": "Major | Moderate",
      "note": "max 4 words"
    }
  ],
  "skipped_count": number
}

Rules:
- ONLY major/moderate risks.
- Max 5 critical_pairs.
- Short fragments only.
- No markdown.
- If nothing important:
  summary="No significant risks"
  critical_pairs=[]
  skipped_count=all pairs.
`;
    }

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    let clean = raw;
    const s = clean.indexOf("{");
    const e = clean.lastIndexOf("}");
    if (s !== -1 && e !== -1) clean = clean.slice(s, e + 1);

    let parsed: any;
    try {
      parsed = JSON.parse(clean);
    } catch (e) {
      return res.status(500).json({
        error: "Invalid JSON from Gemini",
        raw: clean,
      });
    }

    const sanitize = (value: unknown): unknown => {
      if (typeof value === "string") {
        return value
          .replace(/\n/g, " ")
          .replace(/\s+/g, " ")
          .replace(/\.$/, "")
          .trim();
      }
      return value;
    };

    const normalizeObj = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map((item) =>
          typeof item === "object" ? normalizeObj(item) : sanitize(item)
        );
      }

      if (obj && typeof obj === "object") {
        const newObj: any = {};
        for (const key of Object.keys(obj)) {
          const val = obj[key];
          if (typeof val === "object" && val !== null) {
            newObj[key] = normalizeObj(val);
          } else {
            newObj[key] = sanitize(val);
          }
        }
        return newObj;
      }

      return sanitize(obj);
    };

    parsed = normalizeObj(parsed);

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({
      error: "Internal error",
      details: String(err),
    });
  }
});

app.post("/health-analysis", async (req, res) => {
  try {
    const answers = req.body.answers;

    if (!answers || !Array.isArray(answers) || answers.length < 1) {
      return res.status(400).json({
        error:
          "Invalid request. Provide:" +
          ' { "answers": [ {"question":"...", "answer":"yes|no"} ] }',
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a medical diagnostics expert.

Analyze the following symptom questionnaire:

${JSON.stringify(answers)}

Return ONLY valid JSON in this structure:

{
  "risk_level": "Low | Moderate | High | Unknown",
  "score": number,
  "summary": "2 short sentences explaining overall risk",
  "critical_symptoms": [
    { "symptom": "name", "reason": "1 short sentence why it matters" }
  ],
  "recommendations": [
    "short recommendation 1",
    "short recommendation 2",
    "short recommendation 3"
  ]
}

Rules:
- Keep explanations SHORT but meaningful.
- 1–2 sentence summary.
- Each critical_symptom.reason max 1 sentence.
- Use simple medical language.
- No markdown.
- No text outside JSON.
- If unsure, use 'Unknown'.
    `;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    let clean = raw;
    const s = clean.indexOf("{");
    const e = clean.lastIndexOf("}");
    if (s !== -1 && e !== -1) clean = clean.slice(s, e + 1);

    let parsed: any;
    try {
      parsed = JSON.parse(clean);
    } catch (err) {
      console.error("Invalid JSON from Gemini:", clean);
      return res.status(500).json({
        error: "Invalid JSON from Gemini",
        raw: clean,
      });
    }

    const sanitize = (value: unknown): unknown => {
      if (typeof value === "string") {
        return value.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
      }
      return value;
    };

    const normalize = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map((i) =>
          typeof i === "object" ? normalize(i) : sanitize(i)
        );
      }
      if (obj && typeof obj === "object") {
        const out: any = {};
        for (const k of Object.keys(obj)) out[k] = normalize(obj[k]);
        return out;
      }
      return sanitize(obj);
    };

    parsed = normalize(parsed);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal error",
      details: String(err),
    });
  }
});

export { app };
