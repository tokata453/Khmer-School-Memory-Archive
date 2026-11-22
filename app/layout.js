import collection from "../collection.config.js";
import { cookies } from "next/headers";
import SiteFooter from "../components/SiteFooter.js";
import SiteHeader from "../components/SiteHeader.js";
import { normalizeLanguage } from "../lib/language.js";
import { Inter, Noto_Sans_Khmer } from "next/font/google";
import "./globals.css";

const notoSansKhmer = Noto_Sans_Khmer({
  subsets: ["khmer", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-khmer",
});

// Inter gives English content a clean, neutral reading voice while Noto Sans
// Khmer remains the dedicated typeface for Khmer script.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const language = normalizeLanguage(cookieStore.get("language")?.value);

  return (
    <html lang={language} className={`${inter.variable} ${notoSansKhmer.variable}`}>
      <body>
        <SiteHeader language={language} />
        {children}
        <SiteFooter language={language} />
      </body>
    </html>
  );
}
