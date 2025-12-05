import "@workspace/ui/globals.css";
import "./custom.css";
import { AdaptiveLayout } from "@workspace/features";

export const metadata = {
  title: "COMBIEN - Prix d'Objets Médiévaux Fantastiques",
  description:
    "Application de recherche pour objets d'un univers médiéval fantastique",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
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
      currentApp="combien"
      metadata={metadata}
    >
      {children}
    </AdaptiveLayout>
  );
}
