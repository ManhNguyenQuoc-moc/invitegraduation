import type { Metadata } from "next";
import { Be_Vietnam_Pro, Lora, Playfair_Display, Nunito } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AuthProvider } from "../core/context/AuthContext";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans-vietnam",
  display: "swap",
});

const lora = Lora({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif-vietnam",
  display: "swap",
});

const playfair = Playfair_Display({
  weight: ["600", "700", "800", "900"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
  display: "swap",
});

const nunito = Nunito({
  weight: ["600", "700", "800", "900"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://invitegraduation.vercel.app"),
  title: "Thiệp Mời Lễ Tốt Nghiệp - Nguyễn Quốc Mạnh",
  description: "Trân trọng kính mời bạn đến tham dự Lễ Trao Bằng Tốt Nghiệp Cử nhân cùng Quốc Mạnh tại Đại học Tôn Đức Thắng (TDTU) - 23.10.2026",
  openGraph: {
    title: "Thiệp Mời Lễ Tốt Nghiệp - Nguyễn Quốc Mạnh",
    description: "Trân trọng kính mời bạn đến tham dự Lễ Trao Bằng Tốt Nghiệp Cử nhân cùng Quốc Mạnh tại Đại học Tôn Đức Thắng (TDTU) - 23.10.2026",
    url: "https://invitegraduation.vercel.app",
    siteName: "Thiệp Mời Tốt Nghiệp - Nguyễn Quốc Mạnh",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Thư Mời Lễ Tốt Nghiệp - Nguyễn Quốc Mạnh",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thiệp Mời Lễ Tốt Nghiệp - Nguyễn Quốc Mạnh",
    description: "Trân trọng kính mời bạn đến tham dự Lễ Trao Bằng Tốt Nghiệp Cử nhân cùng Quốc Mạnh tại Đại học Tôn Đức Thắng - 23.10.2026",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/wolf-logo-emblem.png",
    apple: "/wolf-logo-emblem.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${lora.variable} ${playfair.variable} ${nunito.variable} h-full antialiased`}
    >
      <head>
        <link rel="preload" as="image" href="/wolf-logo-emblem.png" fetchPriority="high" />
        <link rel="preload" as="image" href="/22.07 (3-clean).png" fetchPriority="high" />
        <link rel="preload" as="image" href="/22.07 (5).png" />
      </head>
      <body className={`${beVietnamPro.className} min-h-screen w-full flex flex-col font-sans bg-[#F8FAFC] m-0 p-0 text-[#0F172A]`}>
        <AntdRegistry>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
