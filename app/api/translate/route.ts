import { NextResponse } from "next/server"
import { DEFAULT_TRANSLATIONS } from "@/lib/translations"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { text, targetLanguage, context } = body

    console.log(`[Translate API] Received request for language: ${targetLanguage}`)

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate payload size (OpenAI has limits)
    const payloadSize = JSON.stringify(text).length
    if (payloadSize > 100000) { // ~100KB limit
      console.warn(`[Translate API] Large payload detected: ${payloadSize} bytes`)
    }

    // If requesting English, return default English translations
    if (targetLanguage === "en") {
      return NextResponse.json({ 
        translation: DEFAULT_TRANSLATIONS.en
      })
    }

    const apiKey = process.env.OPENAI_API_KEY

    // If no API key, return a fallback message or English
    if (!apiKey) {
      console.warn("OPENAI_API_KEY not found, returning English content")
      return NextResponse.json({ 
        translation: DEFAULT_TRANSLATIONS.en,
        warning: "AI translation unavailable (configured API key missing). Using English fallback."
      })
    }

    // Map language codes to full names for Zambian languages
    const languageNames: Record<string, string> = {
      bem: "Bemba",
      nya: "Nyanja (Chichewa)",
      to: "Tonga",
      loz: "Lozi",
      kqn: "Kaonde",
      lun: "Lunda",
      en: "English"
    }

    const targetLanguageName = languageNames[targetLanguage] || targetLanguage
    console.log(`Translating to ${targetLanguageName} (${targetLanguage})...`)

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Efficient model for translation
        messages: [
          {
            role: "system",
            content: `You are a professional translator for a financial technology application called 'Pollen'. 
            Translate the provided JSON content into ${targetLanguageName} (language code: ${targetLanguage}).
            Maintain the exact JSON structure and keys - do not change any key names.
            Keep technical terms like 'AI', 'Blockchain', 'Digital Loans' if they are commonly used in the target language, otherwise translate them appropriately.
            Ensure the tone is professional, empowering, and clear.
            Return only valid JSON with the same structure as the input.`
          },
          {
            role: "user",
            content: JSON.stringify(text)
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      let errorMessage = "Translation failed"
      let errorDetails = "Failed to translate content. Please check your OpenAI API key and try again."
      
      try {
        const errorText = await response.text()
        console.error("OpenAI API error response:", errorText)
        
        try {
          const errorData = JSON.parse(errorText)
          console.error("OpenAI API error (parsed):", errorData)
          errorMessage = errorData.error?.message || errorData.error?.code || errorData.error || `OpenAI API returned status ${response.status}`
          if (errorData.error?.type) {
            errorDetails = `Error type: ${errorData.error.type}. ${errorDetails}`
          }
        } catch (parseError) {
          errorMessage = `OpenAI API error: ${response.status} ${response.statusText}`
          if (errorText) {
            errorDetails = errorText.substring(0, 200) // Limit error text length
          }
        }
      } catch (readError) {
        console.error("Failed to read error response:", readError)
        errorMessage = `OpenAI API error: ${response.status} ${response.statusText}`
      }
      
      return NextResponse.json({ 
        error: errorMessage,
        details: errorDetails
      }, { status: 500 })
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid OpenAI response structure:", data)
      return NextResponse.json({ 
        error: "Invalid response from OpenAI",
        details: "The translation service returned an unexpected response format."
      }, { status: 500 })
    }

    try {
      const translatedContent = JSON.parse(data.choices[0].message.content)
      console.log("Translation successful for", targetLanguage)
      return NextResponse.json({ translation: translatedContent })
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      console.error("Response content:", data.choices[0].message.content)
      return NextResponse.json({ 
        error: "Failed to parse translation response",
        details: "The translation service returned invalid JSON."
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Translation error:", error)
    return NextResponse.json({ 
      error: error.message || "Internal server error",
      details: error.stack || "An unexpected error occurred during translation."
    }, { status: 500 })
  }
}

