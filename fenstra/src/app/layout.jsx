import "./globals.css";

export const metadata = {
  title: "Fenstra · Window & Door Design Pro UK",
  description: "Professional UK glazing design, quoting and ordering platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
