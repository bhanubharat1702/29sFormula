import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import SessionTracker from "@/components/SessionTracker";
import Script from "next/script";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "29sFormula",
  description: "A premium luxury perfume brand handcrafted by PhD students. Discover scientifically curated fragrances where scent is the difference you feel.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400..800&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=DM+Sans:opsz,wght@9..40,100..1000&family=Fraunces:opsz,wght@9..144,100..900&family=Inter:wght@100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Oswald:wght@200..700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Roboto:ital,wght@0,100..900;1,100..900&family=Syne:wght@400..800&family=Unbounded:wght@200..900&family=Bodoni+Moda:opsz,wght@6..96,400..900&display=swap" rel="stylesheet" />
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                function getContrast(color) {
                  if (!color) return '#ffffff';
                  color = color.trim();
                  var r, g, b;
                  if (color.startsWith('rgb')) {
                    var match = color.match(/\\d+/g);
                    if (match && match.length >= 3) {
                      r = parseInt(match[0], 10);
                      g = parseInt(match[1], 10);
                      b = parseInt(match[2], 10);
                    } else {
                      return '#ffffff';
                    }
                  } else {
                    var hex = color.replace('#', '');
                    if (hex.length === 3) {
                      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
                    }
                    r = parseInt(hex.substring(0, 2), 16);
                    g = parseInt(hex.substring(2, 4), 16);
                    b = parseInt(hex.substring(4, 6), 16);
                  }
                  if (isNaN(r) || isNaN(g) || isNaN(b)) return '#ffffff';
                  var luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                  return luminance > 0.5 ? '#000000' : '#ffffff';
                }

                var lastColor = "";
                function updateThemeContrast() {
                  var color = document.documentElement.style.getPropertyValue('--primary-brand-color');
                  if (color) {
                    color = color.trim();
                    if (color !== lastColor) {
                      lastColor = color;
                      document.documentElement.style.setProperty('--primary-contrast-color', getContrast(color));
                    }
                  }
                }
                
                var initColor = localStorage.getItem('settings_primaryColor');
                if (initColor) {
                  document.documentElement.style.setProperty('--primary-brand-color', initColor);
                  updateThemeContrast();
                }

                if (typeof MutationObserver !== 'undefined') {
                  var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        updateThemeContrast();
                      }
                    });
                  });
                  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <SmoothScroll>
          <SessionTracker />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
