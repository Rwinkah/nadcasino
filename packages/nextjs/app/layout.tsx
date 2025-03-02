import { Inter } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import { TurnkeyProvider } from "@turnkey/sdk-react";
import "@turnkey/sdk-react/styles";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

// required to render auth component styles properly

const inter = Inter({ subsets: ["latin"] });

export const metadata = getMetadata({ title: "Nadcasino", description: "Experience Next-Gen Blockchain Gaming" });

const config = {
  apiBaseUrl: "https://api.turnkey.com",
  defaultOrganizationId: process.env.NEXT_PUBLIC_ORGANIZATION_ID ?? "b2813a3d-f7b4-4c9c-829a-ddb13ecf4489",
};
const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning className={inter.className}>
      <body>
        <TurnkeyProvider config={config}>
          {/* @ts-ignore */}
          <ThemeProvider enableSystem>
            <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
          </ThemeProvider>
        </TurnkeyProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
