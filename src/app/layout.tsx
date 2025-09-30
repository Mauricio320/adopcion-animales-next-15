import { LayoutDefault } from "@/components/layout/LayoutDefault";
import "./globals.css";

import { AuthProvider } from "@/contexts/AuthContext";
import { BlockUIProvider } from "@/contexts/BlockUIContext";
import { BlockUI } from "@/components/common/BlockUI";
import { ToastProvider } from "@/contexts/ToastContext";
import { ToastContainer } from "@/components/common/Toast";
import { DataLogin } from "@/components/data-login/dataLogin";

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
