import { LayoutDefault } from "@/components/layout/LayoutDefault";
import "./globals.css";
import type { Metadata } from "next";

import { AuthProvider } from "@/contexts/AuthContext";
import { BlockUIProvider } from "@/contexts/BlockUIContext";
import { BlockUI } from "@/components/common/BlockUI";
import { ToastProvider } from "@/contexts/ToastContext";
import { ToastContainer } from "@/components/common/Toast";
import { DataLogin } from "@/components/data-login/dataLogin";

export const metadata: Metadata = {
  title: "Adopción de Animales - Encuentra tu compañero perfecto",
  description: "Plataforma dedicada a la adopción y apadrinamiento de animales en necesidad. Conecta con albergues y encuentra a tu nuevo amigo peludo.",
  openGraph: {
    title: "Adopción de Animales",
    description: "Encuentra tu compañero perfecto en nuestra plataforma de adopción y apadrinamiento.",
    images: [
      {
        url: "/img/banner1-1.png",
        width: 1200,
        height: 630,
        alt: "Adopción de Animales",
      },
    ],
    url: "https://banimal.desarrolllocomunitario2025.online", // Reemplaza con tu URL real
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adopción de Animales",
    description: "Encuentra tu compañero perfecto en nuestra plataforma de adopción y apadrinamiento.",
    images: ["/img/banner1-1.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="text-gray-700">
        <ToastProvider>
          <BlockUIProvider>
            <AuthProvider>
              <DataLogin>
                <LayoutDefault />
                <div className="w-7xl max-w-[90%] m-auto mt-3">{children}</div>
              </DataLogin>
              <BlockUI />
              <ToastContainer />
            </AuthProvider>
          </BlockUIProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
