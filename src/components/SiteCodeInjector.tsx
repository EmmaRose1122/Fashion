import { getSettings } from "@/lib/settings";

export async function SiteCodeInjector() {
    const settings = await getSettings();

    return (
        <>
            {settings.headHtml && (
                <div
                    dangerouslySetInnerHTML={{ __html: settings.headHtml }}
                    suppressHydrationWarning
                />
            )}
        </>
    );
}

export async function SiteBodyStart() {
    const settings = await getSettings();
    if (!settings.bodyStartHtml) return null;
    return (
        <div
            dangerouslySetInnerHTML={{ __html: settings.bodyStartHtml }}
            suppressHydrationWarning
        />
    );
}

export async function SiteBodyEnd() {
    const settings = await getSettings();
    if (!settings.bodyEndHtml) return null;
    return (
        <div
            dangerouslySetInnerHTML={{ __html: settings.bodyEndHtml }}
            suppressHydrationWarning
        />
    );
}
