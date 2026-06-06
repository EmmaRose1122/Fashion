"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { TxtRecord, HtmlFile } from "@/lib/settings";

export type SettingsActionState = {
    error?: string;
    success?: boolean;
    message?: string;
};

interface UpdatePayload {
    headHtml?: string;
    bodyStartHtml?: string;
    bodyEndHtml?: string;
    txtRecords?: TxtRecord[];
    htmlFiles?: HtmlFile[];
}

export async function updateSettings(
    prevState: SettingsActionState | undefined,
    formData: FormData
): Promise<SettingsActionState> {
    const headHtml = (formData.get("headHtml") as string) ?? "";
    const bodyStartHtml = (formData.get("bodyStartHtml") as string) ?? "";
    const bodyEndHtml = (formData.get("bodyEndHtml") as string) ?? "";
    const txtRecordsRaw = (formData.get("txtRecords") as string) ?? "[]";
    const htmlFilesRaw = (formData.get("htmlFiles") as string) ?? "[]";

    let txtRecords: TxtRecord[] = [];
    let htmlFiles: HtmlFile[] = [];

    try {
        txtRecords = JSON.parse(txtRecordsRaw);
        if (!Array.isArray(txtRecords)) txtRecords = [];
    } catch {
        return { error: "Invalid TXT records JSON." };
    }

    try {
        htmlFiles = JSON.parse(htmlFilesRaw);
        if (!Array.isArray(htmlFiles)) htmlFiles = [];
    } catch {
        return { error: "Invalid HTML files JSON." };
    }

    // Validate entries
    for (const r of txtRecords) {
        if (!r || typeof r.name !== "string" || typeof r.content !== "string") {
            return { error: "TXT records must each have a name and content." };
        }
        if (!/^[a-zA-Z0-9_\-\.]+$/.test(r.name)) {
            return { error: `Invalid TXT record name: "${r.name}". Use letters, numbers, dots, dashes, underscores.` };
        }
    }

    for (const f of htmlFiles) {
        if (!f || typeof f.name !== "string" || typeof f.content !== "string") {
            return { error: "HTML files must each have a name and content." };
        }
        if (!/^[a-zA-Z0-9_\-\.]+$/.test(f.name)) {
            return { error: `Invalid HTML file name: "${f.name}".` };
        }
    }

    const payload: UpdatePayload = {
        headHtml,
        bodyStartHtml,
        bodyEndHtml,
        txtRecords,
        htmlFiles,
    };

    try {
        const { error } = await supabase
            .from("Settings")
            .upsert({ id: 1, ...payload, updatedAt: new Date().toISOString() });
        if (error) throw error;
    } catch (err: any) {
        console.error("Failed to update settings:", err);
        return {
            error:
                err?.message ||
                "Failed to save settings. Make sure the Settings table exists in your Supabase project (see README).",
        };
    }

    revalidatePath("/");
    revalidatePath("/admin/header");
    revalidatePath("/verify/[name]", "page");

    return { success: true, message: "Settings saved successfully." };
}
