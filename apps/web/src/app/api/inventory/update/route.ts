import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { product_id, quantity_change } = body;

        if (!product_id || typeof quantity_change !== "number") {
            return NextResponse.json(
                { error: "Invalid input. Require product_id and quantity_change(number)." },
                { status: 400 }
            );
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const authHeader = req.headers.get("Authorization");

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error("Missing Environment Variables: URL or Service Key");
            return NextResponse.json(
                { error: "Internal Server Error Configuration" },
                { status: 500 }
            );
        }

        if (!authHeader) {
            return NextResponse.json(
                { error: "Missing Authorization Header" },
                { status: 401 }
            );
        }

        // Verify user using Anon Key + Auth Header
        const supabaseAuth = createClient(
            supabaseUrl,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: { headers: { Authorization: authHeader } },
            }
        );

        const {
            data: { user },
            error: authError,
        } = await supabaseAuth.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Perform Admin Operation
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        const { data: newStock, error: rpcError } = await supabaseAdmin.rpc(
            "update_inventory",
            {
                p_id: product_id,
                p_quantity_change: quantity_change,
            }
        );

        if (rpcError) {
            throw rpcError;
        }

        return NextResponse.json({ success: true, new_stock: newStock });
    } catch (error: any) {
        const message = error.message || "Unknown error";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
