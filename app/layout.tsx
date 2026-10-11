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
  title: "Thiệp Mời Tốt Nghiệp - Nguyễn Quốc Mạnh",
  description: "Thiệp mời lễ tốt nghiệp Cử nhân - Đại học Tôn Đức Thắng",
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
