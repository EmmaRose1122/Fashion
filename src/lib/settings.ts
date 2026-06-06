import { supabase } from "@/lib/supabase";

export interface TxtRecord {
    name: string;
    content: string;
}

export interface HtmlFile {
    name: string;
    content: string;
}

export interface SiteSettings {
    headHtml: string;
    bodyStartHtml: string;
    bodyEndHtml: string;
    txtRecords: TxtRecord[];
    htmlFiles: HtmlFile[];
    updatedAt: string | null;
}

const DEFAULT_SETTINGS: SiteSettings = {
    headHtml: "",
    bodyStartHtml: "",
    bodyEndHtml: "",
    txtRecords: [],
    htmlFiles: [],
    updatedAt: null,
};

export async function getSettings(): Promise<SiteSettings> {
    try {
        const { data, error } = await supabase
            .from("Settings")
            .select("*")
            .eq("id", 1)
            .maybeSingle();

        if (error || !data) {
            return DEFAULT_SETTINGS;
        }

        return {
            headHtml: data.headHtml || "",
            bodyStartHtml: data.bodyStartHtml || "",
            bodyEndHtml: data.bodyEndHtml || "",
            txtRecords: Array.isArray(data.txtRecords) ? data.txtRecords : [],
            htmlFiles: Array.isArray(data.htmlFiles) ? data.htmlFiles : [],
            updatedAt: data.updatedAt || null,
        };
    } catch {
        return DEFAULT_SETTINGS;
    }
}
