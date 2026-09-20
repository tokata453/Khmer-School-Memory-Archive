import collection from "../collection.config.js";
import SiteFooter from "../components/SiteFooter.js";
import SiteHeader from "../components/SiteHeader.js";
import "./globals.css";

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
