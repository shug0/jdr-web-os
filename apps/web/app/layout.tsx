import "@workspace/ui/globals.css";
import { DesktopOSLayout } from "@/layouts/desktop-os-layout";

export const metadata = {
  title: "JDR OS - Operating System pour Jeux de Rôle",
  description: "Interface OS-like pour les outils JDR Coffee",
  icons: {
    icon: "/logo/cofe.ico",
  },
  generator: "Claude Code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DesktopOSLayout metadata={metadata}>
      {children}
    </DesktopOSLayout>
  );
}
