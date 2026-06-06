import { getSettings } from "@/lib/settings";
import { HeaderManager } from "@/components/admin/HeaderManager";

export const revalidate = 0;

export default async function AdminHeaderPage() {
    const settings = await getSettings();

    return (
        <div className="space-y-8 text-left max-w-4xl">
            <div className="border-b border-border-light pb-6 space-y-2">
                <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">Console</span>
                <h1 className="font-heading text-2xl md:text-3xl font-bold">Header & Site Code</h1>
                <p className="text-xs text-text-secondary">
                    Inject custom HTML into your site's head and body, manage TXT records,
                    and host HTML verification files — all without redeploying.
                </p>
            </div>

            {(!settings.headHtml &&
                !settings.bodyStartHtml &&
                !settings.bodyEndHtml &&
                settings.txtRecords.length === 0 &&
                settings.htmlFiles.length === 0) && (
                    <div className="text-xs text-text-secondary bg-background/50 border border-dashed border-border rounded-sm p-6 space-y-2">
                        <p className="font-bold text-text-primary">No header code set yet.</p>
                        <p>
                            Add HTML meta tags, Google Analytics snippets, or verification codes
                            below. Files added here will be available at:
                        </p>
                        <ul className="list-disc list-inside space-y-1 pt-2">
                            <li>
                                <code className="bg-border-light px-1.5 py-0.5 rounded">/verify/[name].txt</code>{" "}
                                for plain-text records
                            </li>
                            <li>
                                <code className="bg-border-light px-1.5 py-0.5 rounded">/verify/[name].html</code>{" "}
                                for HTML verification files
                            </li>
                        </ul>
                        <p className="pt-2 italic text-text-secondary/80">
                            Note: If you see a database error when saving, run the Settings table SQL
                            in the README in your Supabase project first.
                        </p>
                    </div>
                )}

            <HeaderManager
                initialHeadHtml={settings.headHtml}
                initialBodyStartHtml={settings.bodyStartHtml}
                initialBodyEndHtml={settings.bodyEndHtml}
                initialTxtRecords={settings.txtRecords}
                initialHtmlFiles={settings.htmlFiles}
                updatedAt={settings.updatedAt}
            />
        </div>
    );
}
