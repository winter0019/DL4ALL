
import { GoogleGenAI } from "@google/genai";
import { WeeklyReport } from "../types.ts";

/**
 * Generates formal executive insights using Gemini 3 Pro reasoning model.
 * Optimized for professional government-style memoranda and systemic analysis.
 */
export const getSmartInsights = async (reports: WeeklyReport[]): Promise<string> => {
  if (reports.length === 0) return "No data available for analysis.";

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const reportSummary = reports.map(r => 
    `Team ${r.teamCode} (${r.name}) in ${r.lga}: WK1=${r.metrics.weeklyAttendance.wk1}, WK2=${r.metrics.weeklyAttendance.wk2}, WK3=${r.metrics.weeklyAttendance.wk3}, WK4=${r.metrics.weeklyAttendance.wk4}, Total Active=${r.metrics.activeUsers}`
  ).join('\n');

  const prompt = `
    As a Senior Performance Analyst for the Katsina State Government, draft a formal MEMORANDUM based on the following weekly operational data:
    
    DATASET:
    ${reportSummary}

    REQUIREMENTS:
    1. Use a highly formal, authoritative, and professional human tone.
    2. Format the output strictly as a MEMORANDUM with these headers:
       - TO: DL4ALL Project Steering Committee / Katsina State Program Lead
       - FROM: Performance Analysis Unit
       - DATE: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
       - SUBJECT: Performance Audit & Operational Risk Assessment
    
    3. Include the following sections:
       - EXECUTIVE SUMMARY: A high-level overview of systemic trends.
       - PERFORMANCE BENCHMARKS: Highlight the top LGA and the most consistent team.
       - OPERATIONAL GAPS & CHURN RISKS: Identify specific teams with declining performance or "blackout" periods.
       - SYSTEMIC DIAGNOSIS: Analyze whether failures are logistical (administrative) or executional (field level).
       - TARGETED INTERVENTIONS: Provide concrete, mandated actions to recover project momentum.

    4. Avoid any mention of "AI", "Gemini", or "Machine Learning". The report should read as if written by a human expert.
    5. Be specific about Team Codes and LGA names provided in the dataset.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });
    return response.text || "Unable to generate memorandum. Please review the raw data ledger.";
  } catch (error) {
    console.error("Analysis Error:", error);
    return "The Performance Analysis Unit is currently unable to process this request. System offline.";
  }
};

/**
 * Extracts data from uploaded documents.
 */
export const extractDataFromDocument = async (base64Data: string, mimeType: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze this deployment record. Extract:
    1. The LGA name (strictly one of: Katsina, Malumfashi, Kankia, Batagarawa, Mashi, Daura).
    2. The Team Code (numeric portion).
    3. The total number of active users or merit score.
    
    Return ONLY a JSON object: {"lga": "name", "teamCode": "number", "total": number}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: prompt }
        ]
      },
      config: { responseMimeType: "application/json" }
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Extraction failed:", error);
    return null;
  }
};
