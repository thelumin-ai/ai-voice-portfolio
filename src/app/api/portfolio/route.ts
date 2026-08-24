import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get("admin_token");

        if (!adminToken || adminToken.value !== "authenticated") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const metricsStr = formData.get("metrics") as string;
        const type = formData.get("type") as string;
        const color = formData.get("color") as string;
        const borderColor = formData.get("borderColor") as string;
        const file = formData.get("file") as File | null;
        let mediaUrl = formData.get("mediaUrl") as string | null;

        if (!title || !description || !type || !color || !borderColor) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (description.length > 2500) {
            return NextResponse.json({ error: "Portfolio description must not exceed 2,500 characters" }, { status: 400 });
        }

        if (title.length > 200) {
            return NextResponse.json({ error: "Portfolio title must not exceed 200 characters" }, { status: 400 });
        }

        const metrics = metricsStr ? JSON.parse(metricsStr) : [];

        // Handle file upload if a file was provided
        if (file) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('portfolio_media')
                .upload(fileName, file);

            if (uploadError) {
                console.error("Upload error:", uploadError);
                return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
            }

            const { data: publicUrlData } = supabase.storage
                .from('portfolio_media')
                .getPublicUrl(fileName);

            mediaUrl = publicUrlData.publicUrl;
        }

        // Insert into database
        const { data, error } = await supabase
            .from('portfolios')
            .insert([
                {
                    title,
                    description,
                    metrics,
                    type,
                    media_url: mediaUrl,
                    color,
                    border_color: borderColor
                }
            ])
            .select()
            .single();

        if (error) {
            console.error("Database insert error:", error);
            return NextResponse.json({ error: "Failed to save portfolio item" }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("API route error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('portfolios')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: "Failed to fetch portfolios" }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
