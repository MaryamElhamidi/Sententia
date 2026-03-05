import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Sententia - Cognitive Bias Assessment Platform",
    description: "Understand cognitive biases through interactive assessments and improve decision-making",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
