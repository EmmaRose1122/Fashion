"use client";

import { useActionState, useState } from "react";
import { CrownIcon } from "@/components/ui/CrownIcon";
import { updateSettings } from "@/actions/settings";
import { TxtRecord, HtmlFile } from "@/lib/settings";

interface HeaderManagerProps {
    initialHeadHtml: string;
    initialBodyStartHtml: string;
    initialBodyEndHtml: string;
    initialTxtRecords: TxtRecord[];
    initialHtmlFiles: HtmlFile[];
    updatedAt: string | null;
}

export function HeaderManager({
    initialHeadHtml,
    initialBodyStartHtml,
    initialBodyEndHtml,
    initialTxtRecords,
    initialHtmlFiles,
    updatedAt,
}: HeaderManagerProps) {
    const [state, action, isPending] = useActionState(updateSettings, undefined);

    const [headHtml, setHeadHtml] = useState(initialHeadHtml);
    const [bodyStartHtml, setBodyStartHtml] = useState(initialBodyStartHtml);
    const [bodyEndHtml, setBodyEndHtml] = useState(initialBodyEndHtml);
    const [txtRecords, setTxtRecords] = useState<TxtRecord[]>(initialTxtRecords);
    const [htmlFiles, setHtmlFiles] = useState<HtmlFile[]>(initialHtmlFiles);

    const addTxt = () =>
        setTxtRecords((prev) => [...prev, { name: "", content: "" }]);
    const removeTxt = (i: number) =>
        setTxtRecords((prev) => prev.filter((_, idx) => idx !== i));
    const updateTxt = (i: number, field: keyof TxtRecord, value: string) =>
        setTxtRecords((prev) =>
            prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r))
        );

    const addHtml = () =>
        setHtmlFiles((prev) => [...prev, { name: "", content: "" }]);
    const removeHtml = (i: number) =>
        setHtmlFiles((prev) => prev.filter((_, idx) => idx !== i));
    const updateHtml = (i: number, field: keyof HtmlFile, value: string) =>
        setHtmlFiles((prev) =>
            prev.map((f, idx) => (idx === i ? { ...f, [field]: value } : f))
        );

    const handleHtmlFileUpload = (i: number, file: File | null) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const text = String(reader.result || "");
            updateHtml(i, "content", text);
            setHtmlFiles((prev) =>
                prev.map((f, idx) =>
                    idx === i && !f.name
                        ? { ...f, name: file.name.replace(/[^a-zA-Z0-9_\-.]/g, "-") }
                        : f
                )
            );
        };
        reader.readAsText(file);
    };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

    return (
        <form action={action} className="space-y-10 text-left">
            {state?.error && (
                <div className="text-xs text-red-500 font-medium bg-red-50 border border-red-100 p-4 rounded-sm">
                    {state.error}
                </div>
            )}
            {state?.success && (
                <div className="text-xs text-green-700 font-medium bg-green-50 border border-green-200 p-4 rounded-sm">
                    {state.message}
                </div>
            )}

            <input type="hidden" name="txtRecords" value={JSON.stringify(txtRecords)} />
            <input type="hidden" name="htmlFiles" value={JSON.stringify(htmlFiles)} />

            <section className="space-y-3">
                <div>
                    <h3 className="font-heading text-xl font-bold flex items-center gap-2">
                        <CrownIcon size={16} className="text-accent" />
                        HEAD HTML
                    </h3>
                    <p className="text-xs text-text-secondary mt-1">
                        Custom HTML injected into the document head. Use for meta tags, verification codes, analytics, fonts, etc.
                    </p>
                </div>
                <textarea
                    name="headHtml"
                    value={headHtml}
                    onChange={(e) => setHeadHtml(e.target.value)}
                    rows={10}
                    spellCheck={false}
                    placeholder={'<meta name="google-site-verification" content="..." />\n<meta name="facebook-domain-verification" content="..." />'}
                    className="w-full text-xs font-mono border border-border bg-surface px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary resize-y"
                />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <h3 className="font-heading text-xl font-bold flex items-center gap-2">
                        <CrownIcon size={16} className="text-accent" />
                        BODY Start
                    </h3>
                    <p className="text-xs text-text-secondary">
                        Injected immediately after the opening body tag. Useful for chat widgets, noscript fallbacks.
                    </p>
                    <textarea
                        name="bodyStartHtml"
                        value={bodyStartHtml}
                        onChange={(e) => setBodyStartHtml(e.target.value)}
                        rows={6}
                        spellCheck={false}
                        placeholder="<!-- Google Tag Manager (noscript) -->"
                        className="w-full text-xs font-mono border border-border bg-surface px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary resize-y"
                    />
                </div>
                <div className="space-y-3">
                    <h3 className="font-heading text-xl font-bold flex items-center gap-2">
                        <CrownIcon size={16} className="text-accent" />
                        BODY End
                    </h3>
                    <p className="text-xs text-text-secondary">
                        Injected just before the closing body tag. Common for analytics scripts, pixels, conversion tracking.
                    </p>
                    <textarea
                        name="bodyEndHtml"
                        value={bodyEndHtml}
                        onChange={(e) => setBodyEndHtml(e.target.value)}
                        rows={6}
                        spellCheck={false}
                        placeholder="<!-- Google Analytics -->"
                        className="w-full text-xs font-mono border border-border bg-surface px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary resize-y"
                    />
                </div>
            </section>

            <section className="space-y-4 border border-border rounded-sm p-6 bg-background/40">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h3 className="font-heading text-xl font-bold flex items-center gap-2">
                            <CrownIcon size={16} className="text-accent" />
                            TXT Records
                        </h3>
                        <p className="text-xs text-text-secondary mt-1">
                            Served as plain text at <code className="text-[10px] bg-border-light px-1.5 py-0.5 rounded">/verify/[name].txt</code>.
                            Use for domain verification (Bing, Pinterest, Facebook, etc.) without DNS.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={addTxt}
                        className="text-[10px] uppercase tracking-widest text-accent hover:text-accent-hover font-bold border border-accent/40 px-3 py-2 rounded-sm transition-all hover:bg-accent hover:text-white"
                    >
                        + Add TXT
                    </button>
                </div>

                {txtRecords.length === 0 ? (
                    <p className="text-xs text-text-secondary/60 italic py-4 text-center border border-dashed border-border rounded-sm">
                        No TXT records yet. Click + Add TXT to create one.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {txtRecords.map((r, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start bg-surface p-4 rounded-sm border border-border-light">
                                <div className="md:col-span-3 space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">
                                        Filename
                                    </label>
                                    <input
                                        type="text"
                                        value={r.name}
                                        onChange={(e) => updateTxt(i, "name", e.target.value)}
                                        placeholder="ms12345"
                                        className="w-full text-xs font-mono border border-border bg-background px-3 py-2 rounded-sm focus:outline-none focus:border-accent"
                                    />
                                </div>
                                <div className="md:col-span-7 space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">
                                        Content (TXT value)
                                    </label>
                                    <input
                                        type="text"
                                        value={r.content}
                                        onChange={(e) => updateTxt(i, "content", e.target.value)}
                                        placeholder="MS=ms12345"
                                        className="w-full text-xs font-mono border border-border bg-background px-3 py-2 rounded-sm focus:outline-none focus:border-accent"
                                    />
                                </div>
                                <div className="md:col-span-2 flex items-end">
                                    {r.name && (
                                        <a
                                            href={`/verify/${encodeURIComponent(r.name)}.txt`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 text-[10px] uppercase tracking-widest text-text-secondary hover:text-accent font-bold border border-border hover:border-accent/40 px-2 py-2 rounded-sm text-center transition-colors"
                                        >
                                            View
                                        </a>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeTxt(i)}
                                        className="ml-2 text-xs text-red-500 hover:text-red-700 font-bold px-3 py-2 transition-colors"
                                        aria-label="Remove TXT record"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="space-y-4 border border-border rounded-sm p-6 bg-background/40">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h3 className="font-heading text-xl font-bold flex items-center gap-2">
                            <CrownIcon size={16} className="text-accent" />
                            HTML Files
                        </h3>
                        <p className="text-xs text-text-secondary mt-1">
                            Upload or paste HTML files (e.g. for Google Search Console or domain verification). Served at{" "}
                            <code className="text-[10px] bg-border-light px-1.5 py-0.5 rounded">/verify/[name].html</code>.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={addHtml}
                        className="text-[10px] uppercase tracking-widest text-accent hover:text-accent-hover font-bold border border-accent/40 px-3 py-2 rounded-sm transition-all hover:bg-accent hover:text-white"
                    >
                        + Add File
                    </button>
                </div>

                {htmlFiles.length === 0 ? (
                    <p className="text-xs text-text-secondary/60 italic py-4 text-center border border-dashed border-border rounded-sm">
                        No HTML files yet. Click + Add File to upload one.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {htmlFiles.map((f, i) => (
                            <div key={i} className="grid grid-cols-1 gap-3 bg-surface p-4 rounded-sm border border-border-light">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                                    <div className="md:col-span-4 space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">
                                            Filename
                                        </label>
                                        <input
                                            type="text"
                                            value={f.name}
                                            onChange={(e) => updateHtml(i, "name", e.target.value)}
                                            placeholder="google123abc.html"
                                            className="w-full text-xs font-mono border border-border bg-background px-3 py-2 rounded-sm focus:outline-none focus:border-accent"
                                        />
                                    </div>
                                    <div className="md:col-span-6 space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">
                                            Upload HTML file (optional)
                                        </label>
                                        <input
                                            type="file"
                                            accept=".html,.htm,text/html"
                                            onChange={(e) =>
                                                handleHtmlFileUpload(
                                                    i,
                                                    e.target.files ? e.target.files[0] : null
                                                )
                                            }
                                            className="w-full text-xs text-text-secondary file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-xs file:uppercase file:tracking-widest file:font-semibold file:bg-accent file:text-white file:cursor-pointer hover:file:bg-accent-hover file:rounded-sm cursor-pointer border border-border bg-background rounded-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex items-end gap-2">
                                        {f.name && (
                                            <a
                                                href={`/verify/${encodeURIComponent(f.name)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 text-[10px] uppercase tracking-widest text-text-secondary hover:text-accent font-bold border border-border hover:border-accent/40 px-2 py-2 rounded-sm text-center transition-colors"
                                            >
                                                View
                                            </a>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeHtml(i)}
                                            className="text-xs text-red-500 hover:text-red-700 font-bold px-3 py-2 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">
                                        HTML content
                                    </label>
                                    <textarea
                                        value={f.content}
                                        onChange={(e) => updateHtml(i, "content", e.target.value)}
                                        rows={6}
                                        spellCheck={false}
                                        placeholder="<!DOCTYPE html><html>...</html>"
                                        className="w-full text-xs font-mono border border-border bg-background px-3 py-2 rounded-sm focus:outline-none focus:border-accent resize-y"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <div className="flex items-center gap-4 pt-6 border-t border-border-light">
                <button
                    type="submit"
                    disabled={isPending}
                    className="text-xs uppercase tracking-widest bg-accent hover:bg-accent-hover disabled:bg-text-secondary/40 text-white px-8 py-4 rounded-sm font-semibold transition-colors disabled:cursor-not-allowed"
                >
                    {isPending ? "Saving..." : "Save All Header Code"}
                </button>
                <p className="text-xs text-text-secondary">
                    {updatedAt ? `Last saved: ${new Date(updatedAt).toLocaleString()}` : "Never saved"}
                </p>
            </div>
        </form>
    );
}
