import { PortalClient } from "./PortalClient";

const DEFAULT_ADMIN_EMAIL = "editor@fashionhub.studio";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Secure Portal",
};

export default function SecurePortalPage() {
    const usingDefaultEmail = !process.env.ADMIN_EMAIL;
    const usingDefaultPassword = !process.env.ADMIN_PASSWORD;

    return (
        <PortalClient
            usingDefaultEmail={usingDefaultEmail}
            usingDefaultPassword={usingDefaultPassword}
            defaultEmail={DEFAULT_ADMIN_EMAIL}
        />
    );
}
