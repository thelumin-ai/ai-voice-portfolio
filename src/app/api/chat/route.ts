import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const query = message.toLowerCase();

    // If an OpenAI or Gemini API key is set in production, we can run actual LLM completions.
    // Otherwise, we provide an incredibly rich, tailored response block based on Abimbola's profile.
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are an expert AI Automation Assistant representing Abimbola Akinsanmi, a professional AI Voice & Workflow Automation Engineer. You build low-latency voice agents using Vapi.ai and Retell AI, set up multi-channel workflows on n8n.com and Make.com, and build native CRM synchronizations with GoHighLevel and HubSpot. Be direct, helpful, professional, and explain how automated triggers and webhooks solve business reception and operations bottlenecks. Keep responses under 3 sentences unless asked.",
              },
              { role: "user", content: message },
            ],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({ response: data.choices[0].message.content });
        }
      } catch (err) {
        console.error("OpenAI API Fetch Error:", err);
      }
    }

    // Default high-converting fallbacks matching their skillsets
    let answer = "Abimbola integrates AI Voice agents (Vapi & Retell) with workflow automations like n8n and Make.com to automatically update CRMs like GoHighLevel/HubSpot. Let me know if you would like to book a quick consult to discuss!";

    if (query.includes("pricing") || query.includes("cost") || query.includes("rates")) {
      answer = "Pricing is completely bespoke and ROI-focused depending on the complexity of your voice agents and CRM integrations. We offer project-based rates as well as monthly maintenance options. Type 'book a consultation' to get a customized price estimate!";
    } else if (query.includes("time") || query.includes("how long")) {
      answer = "A typical omnichannel voice agent and CRM synchronization takes between 1 to 3 weeks to design, test, and completely deploy to production.";
    } else if (query.includes("experience") || query.includes("portfolio") || query.includes("projects")) {
      answer = "Abimbola has built voice qualification agents for real estate, automated receptionist lines for local business contractors, and deep multi-step n8n pipelines for solar lead qualifiers. Check out the 'Portfolio' and 'Use Cases' sections on the home page for live interactive tests!";
    }

    return NextResponse.json({ response: answer });
  } catch (error) {
    console.error("Chat API Route Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat query" },
      { status: 500 }
    );
  }
}
