import OpenAI from "openai"

const defaultSuggestions = [
  "What is one thing you appreciate about me?",
  "What should I focus on improving this month?",
  "What is a simple habit that changed your life?",
  "What is a goal you think I can achieve this year?",
  "What is one kind message you want to share today?",
]

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST() {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json(
        {
          success: false,
          message: "OpenRouter API key is not configured",
        },
        { status: 500 }
      )
    }

    const model =
      process.env.OPENROUTER_MODEL || "meta-llama/llama-3.2-3b-instruct:free"

    const completion = await openrouter.chat.completions.create({
      model,
      temperature: 0.7,
      max_tokens: 180,
      messages: [
        {
          role: "system",
          content:
            "Generate exactly 5 short, friendly, open-ended prompts for an anonymous messaging app. Return only one line. Separate prompts with '||'. Do not include numbering.",
        },
        {
          role: "user",
          content: "Generate prompt suggestions now.",
        },
      ],
    })

    const rawText = completion.choices[0]?.message?.content || ""
    const suggestions = rawText
      .split("||")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 5)

    const finalSuggestions =
      suggestions.length >= 3 ? suggestions : defaultSuggestions

    return Response.json(
      {
        success: true,
        message: "Suggestions generated successfully",
        suggestions: finalSuggestions,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Unexpected error in suggest messeges", error)
    return Response.json(
      {
        success: false,
        message: "Unable to generate suggestions right now",
      },
      { status: 500 }
    )
  }
}
