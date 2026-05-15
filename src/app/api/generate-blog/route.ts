import { NextResponse } from 'next/server'
import { getSiteSettings } from '@/app/admin/(protected)/settings/actions'

export async function POST(req: Request) {
    try {
        const { prompt, provider } = await req.json()

        if (!prompt || !provider) {
            return NextResponse.json({ error: 'Prompt and provider are required' }, { status: 400 })
        }

        // Fetch API keys from DB
        const { data: settings } = await getSiteSettings()
        
        let content = ""

        if (provider === 'openai') {
            const apiKey = settings?.openai_api_key
            if (!apiKey) return NextResponse.json({ error: 'OpenAI API key not configured in settings' }, { status: 400 })
            
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [
                        { role: 'system', content: 'You are an expert tech and AI voice automation copywriter. Output a raw JSON object with the following keys: "title", "slug", "excerpt", and "content" (content should be in Markdown and highly SEO optimized). Do not wrap the JSON in markdown blocks.' },
                        { role: 'user', content: prompt }
                    ]
                })
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error?.message || 'OpenAI API error')
            content = data.choices[0].message.content
        } 
        else if (provider === 'anthropic') {
            const apiKey = settings?.anthropic_api_key
            if (!apiKey) return NextResponse.json({ error: 'Anthropic API key not configured in settings' }, { status: 400 })
            
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-opus-20240229',
                    max_tokens: 4000,
                    system: 'You are an expert tech and AI voice automation copywriter. Output a raw JSON object with the following keys: "title", "slug", "excerpt", and "content" (content should be in Markdown and highly SEO optimized). Do not wrap the JSON in markdown blocks.',
                    messages: [
                        { role: 'user', content: prompt }
                    ]
                })
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error?.message || 'Anthropic API error')
            content = data.content[0].text
        }
        else if (provider === 'gemini') {
            const apiKey = settings?.gemini_api_key
            if (!apiKey) return NextResponse.json({ error: 'Gemini API key not configured in settings' }, { status: 400 })
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    system_instruction: {
                        parts: { text: 'You are an expert tech and AI voice automation copywriter. Output a raw JSON object with the following keys: "title", "slug", "excerpt", and "content" (content should be in Markdown and highly SEO optimized). Do not wrap the JSON in markdown blocks.'}
                    },
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error?.message || 'Gemini API error')
            content = data.candidates[0].content.parts[0].text
        }
        else {
            return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
        }

        try {
            const parsedContent = JSON.parse(content.replace(/```json/gi, '').replace(/```/g, '').trim())
            return NextResponse.json({ 
                title: parsedContent.title,
                slug: parsedContent.slug,
                excerpt: parsedContent.excerpt,
                content: parsedContent.content 
            })
        } catch (e) {
            console.error("Failed to parse JSON from AI:", content);
            return NextResponse.json({ error: 'AI did not return a valid JSON format. Try again.' }, { status: 500 })
        }

    } catch (error: any) {
        console.error("AI Generation Error:", error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
