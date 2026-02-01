
import { GoogleGenAI, Type } from "@google/genai";
import { WeeklyReport } from "../types.ts";

/**
 * Generates executive insights using Gemini 3 Pro reasoning model.
 */
export const getSmartInsights = async (reports: WeeklyReport[]): Promise<string> => {
  if (reports.length === 0) return "No data available for analysis.";

  // Create instance right before making the call as per requirements
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const reportSummary = reports.map(r => 
    `Team ${r.teamCode} (${r.name}/${r.partnerName}) in ${r.lga}: WK1=${r.metrics.weeklyAttendance.wk1}, WK2=${r.metrics.weeklyAttendance.wk2}, WK3=${r.metrics.weeklyAttendance.wk3}, WK4=${r.metrics.weeklyAttendance.wk4}, Total=${r.metrics.activeUsers}`
  ).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `
        Act as a World-Class Performance Analyst for the DL4ALL initiative in Katsina State.
        Using the provided ground-level data, generate a high-stakes professional report following this structure:

        1. ATTENDANCE GAPS: Identify 'churn risks' where teams moved from numeric values to 'ABS' or 'NDB' in later weeks. Provide an 'Assessment' for critical losses.
        2. TOP PERFORMERS: Highlight 'Star Performers' with high consistency or strong recovery patterns.
        3. SYSTEMIC DIAGNOSIS: Analyze patterns like 'NDB' in specific LGAs (e.g., Kankia/Daura) as logistical delays vs team failure.
        4. TARGETED INTERVENTIONS: Provide concrete, actionable recommendations (Retraining, Field Visits, Re-Engagement).

        TONE: Executive, sharp, authoritative, and data-driven. Use bolding and bullet points for readability.

        DATASET:
        ${reportSummary}
      `,
      config: {
        // High thinking budget for deep reasoning
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    return response.text || "Unable to generate insights.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message?.includes("Requested entity was not found")) {
        return "ERROR: API Key configuration invalid. Please re-authenticate the AI engine via the activation screen.";
    }
    return "Failed to connect to intelligence engine. Please check your internet connection.";
  }
};

/**
 * Extracts data from a document image or PDF using Gemini 3 Pro Image model.
 * Complies with SDK rules for nano banana series models.
 */
export const extractDataFromDocument = async (base64Data: string, mimeType: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: `
              Extract DL4ALL performance data from this Katsina State record. 
              
              FORMAT NOTES:
              - Rows have two names in the 'NAME' column. The top name is 'teamLeaderName', the bottom is 'partnerName'.
              - 'WK 1' through 'WK 4' columns contain either a number, 'ABS' (Absent), 'NDB' (No Data), or 'P' (Present/Base).
              - The 'TOTAL' column is a numeric sum.
              - 'KT LGA' in headers refers to 'Katsina' LGA.
              
              Return a raw JSON object only, with no markdown formatting: 
              { "lga": string, "teamCode": string, "teamLeaderName": string, "partnerName": string, "wk1": string, "wk2": string, "wk3": string, "wk4": string, "total": number }
            `,
          },
        ]
      },
      // Note: responseMimeType and responseSchema are NOT supported for nano banana series models
      config: {}
    });

    const text = response.text || "{}";
    // Sanitize response text to extract only the JSON block if present
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : "{}");
  } catch (error) {
    console.error("Extraction Error:", error);
    return null;
  }
};
