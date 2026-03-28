import { generateText } from "ai"
import { ollama } from "ollama-ai-provider-v2"

export async function POST() {
  try {
    const prompt =
      "Create exactly 5 short, open-ended, friendly anonymous message prompts. Return only one plain string where each prompt is separated by '||'. Avoid sensitive topics."

    const { text } = await generateText({
      model: ollama("minimax-m2.5:cloud"),
      prompt,
    })

    const suggestions = text
      .split("||")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 5)

    return Response.json(
      {
        success: true,
        message: "Suggestions generated successfully",
        suggestions,
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
