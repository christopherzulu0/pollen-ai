import { NextResponse } from "next/server"
import { DEFAULT_TRANSLATIONS } from "@/lib/translations"

// Increase timeout for Vercel (max 60s on Pro, 10s on Hobby)
export const maxDuration = 60
export const runtime = 'nodejs'

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
    if (payloadSize > 50000) { // ~50KB limit to reduce processing time
      console.warn(`[Translate API] Large payload detected: ${payloadSize} bytes`)
      // For large payloads, we'll optimize the request
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

    // Optimize system prompt for faster processing
    const systemPrompt = `Translate JSON to ${targetLanguageName}. Keep structure and keys identical. Translate values only. Keep technical terms (AI, Blockchain, Digital Loans) if common in ${targetLanguageName}. Professional tone. Return valid JSON only.`

    // Create a timeout controller for the fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 55000) // 55s timeout (5s buffer before Vercel's 60s limit)

    try {
      // Call OpenAI API with timeout
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        signal: controller.signal, // Add abort signal for timeout
        body: JSON.stringify({
          model: "gpt-4o-mini", // Efficient model for translation
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: JSON.stringify(text)
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.2, // Lower temperature for faster, more consistent responses
          max_tokens: 4000, // Limit tokens to speed up response
        }),
      })

      clearTimeout(timeoutId) // Clear timeout if request completes

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
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      // Handle timeout or abort errors
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('timeout')) {
        console.error("Translation timeout:", fetchError)
        return NextResponse.json({ 
          error: "Translation timeout",
          details: "The translation request took too long. Please try again or contact support if the issue persists."
        }, { status: 504 }) // Gateway Timeout
      }
      
      // Handle other fetch errors
      console.error("Translation fetch error:", fetchError)
      return NextResponse.json({ 
        error: fetchError.message || "Failed to connect to translation service",
        details: "Unable to reach the translation service. Please try again later."
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

