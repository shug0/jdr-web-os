import "@workspace/ui/globals.css";
import "./custom.css";
import { AdaptiveLayout } from "@workspace/features";

export const metadata = {
  title: "PNJ - Générateur de Personnages Non-Joueurs",
  description:
    "Générateur de PNJ pour jeux de rôle - Créez des personnages uniques avec descriptions IA",
  icons: {
    icon: "/favicon.png",
  },
  generator: "Claude Code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdaptiveLayout 
      currentApp="pnj"
      metadata={metadata}
    >
      {children}
    </AdaptiveLayout>
  );
}