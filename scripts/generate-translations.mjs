import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { config } from "dotenv"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
config({ path: join(root, ".env") })

const languages = {
  bem: "Bemba",
  nya: "Nyanja (Chichewa)",
  to: "Tonga",
  loz: "Lozi",
  kqn: "Kaonde",
  lun: "Lunda",
}

const englishPath = join(root, "locales", "en.json")
const english = JSON.parse(readFileSync(englishPath, "utf8"))

function sameShape(source, translated, path = "") {
  if (Array.isArray(source)) {
    if (!Array.isArray(translated) || translated.length !== source.length) {
      throw new Error(`Shape mismatch at ${path || "root"}: expected array of ${source.length}`)
    }
    source.forEach((item, index) => sameShape(item, translated[index], `${path}[${index}]`))
    return
  }

  if (source && typeof source === "object") {
    if (!translated || typeof translated !== "object" || Array.isArray(translated)) {
      throw new Error(`Shape mismatch at ${path || "root"}: expected object`)
    }
    for (const key of Object.keys(source)) {
      if (!(key in translated)) {
        throw new Error(`Missing key ${path ? `${path}.` : ""}${key}`)
      }
      sameShape(source[key], translated[key], path ? `${path}.${key}` : key)
    }
  }
}

async function translate(code, name) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set")
  }

  const systemPrompt = `Translate JSON values into ${name}. Keep every key and the nesting identical. Translate every sentence and label into ${name}; do not copy English sentences. Translate each value once and do not repeat words. Proper names and codes such as AI, KYC, ZMW, and NRC may stay as-is. Return valid JSON only.`
  const outPath = join(root, "locales", `${code}.json`)
  const current = JSON.parse(readFileSync(outPath, "utf8"))

  try {
    sameShape(english, current)
    console.log(`${code} already matches English shape, skipping`)
    return
  } catch {
    // Fill only the sections that are missing or incomplete.
  }

  for (const section of Object.keys(english)) {
    try {
      sameShape(english[section], current[section])
      continue
    } catch {
      // Translate this section.
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify({ [section]: english[section] }) },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI error for ${code}/${section}: ${response.status} ${errorText.slice(0, 300)}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      throw new Error(`No translation content for ${code}/${section}`)
    }

    const translated = JSON.parse(content)
    const sectionValue = translated[section] ?? translated
    sameShape(english[section], sectionValue)
    current[section] = sectionValue
    console.log(`Translated ${code}/${section}`)
  }

  sameShape(english, current)
  writeFileSync(outPath, `${JSON.stringify(current, null, 2)}\n`)
  console.log(`Wrote ${outPath}`)
}

for (const [code, name] of Object.entries(languages)) {
  console.log(`Translating ${name} (${code})...`)
  await translate(code, name)
}
