import { NextRequest, NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";

export const revalidate = 0;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ name: string }> }
) {
    const { name } = await params;

    // name may include extension or not
    let base = name;
    let kind: "txt" | "html" | "raw" = "raw";
    if (name.toLowerCase().endsWith(".txt")) {
        base = name.slice(0, -4);
        kind = "txt";
    } else if (name.toLowerCase().endsWith(".html") || name.toLowerCase().endsWith(".htm")) {
        base = name.replace(/\.html?$/i, "");
        kind = "html";
    }

    // Sanitize
    const safeBase = base.replace(/[^a-zA-Z0-9_\-]/g, "");
    if (!safeBase || safeBase !== base) {
        return new NextResponse("Invalid filename.", { status: 400 });
    }

    const settings = await getSettings();

    if (kind === "txt") {
        const rec = settings.txtRecords.find((r) => r.name === base);
        if (!rec) {
            return new NextResponse("Not Found", {
                status: 404,
                headers: { "content-type": "text/plain; charset=utf-8" },
            });
        }
        return new NextResponse(rec.content, {
            status: 200,
            headers: {
                "content-type": "text/plain; charset=utf-8",
                "cache-control": "no-store, max-age=0",
            },
        });
    }

    if (kind === "html") {
        const file = settings.htmlFiles.find(
            (f) => f.name === name || f.name === base || f.name === `${base}.html` || f.name === `${base}.htm`
        );
        if (!file) {
            return new NextResponse("<h1>Not Found</h1>", {
                status: 404,
                headers: { "content-type": "text/html; charset=utf-8" },
            });
        }
        return new NextResponse(file.content, {
            status: 200,
            headers: {
                "content-type": "text/html; charset=utf-8",
                "cache-control": "no-store, max-age=0",
            },
        });
    }

    // No extension: try TXT first, then HTML
    const txtMatch = settings.txtRecords.find((r) => r.name === base);
    if (txtMatch) {
        return new NextResponse(txtMatch.content, {
            status: 200,
            headers: {
                "content-type": "text/plain; charset=utf-8",
                "cache-control": "no-store, max-age=0",
            },
        });
    }

    const htmlMatch = settings.htmlFiles.find(
        (f) => f.name === name || f.name === base || f.name === `${base}.html` || f.name === `${base}.htm`
    );
    if (htmlMatch) {
        return new NextResponse(htmlMatch.content, {
            status: 200,
            headers: {
                "content-type": "text/html; charset=utf-8",
                "cache-control": "no-store, max-age=0",
            },
        });
    }

    return new NextResponse("Not Found", { status: 404 });
}
