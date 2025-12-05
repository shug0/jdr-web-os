import "@workspace/ui/globals.css";
import { AdaptiveLayout } from "@workspace/features";

export const metadata = {
	title: "MJ Assistant - JDR Data Showcase",
	description: "Interactive showcase for @workspace/static-data package",
	icons: { icon: "/favicon.png" },
	generator: "Claude Code",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AdaptiveLayout currentApp="mj-assistant" metadata={metadata}>
			{children}
		</AdaptiveLayout>
	);
}
