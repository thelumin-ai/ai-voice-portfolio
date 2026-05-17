import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { agentId, apiKey } = await req.json();

        if (!agentId) {
            return NextResponse.json({ error: 'Missing agentId' }, { status: 400 });
        }

        const retellApiKey = apiKey || process.env.RETELL_API_KEY;

        if (!retellApiKey) {
            return NextResponse.json({ error: 'Missing Retell API Key' }, { status: 400 });
        }

        const response = await fetch("https://api.retellai.com/v2/create-web-call", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${retellApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                agent_id: agentId,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.message || 'Failed to create Retell web call' }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
