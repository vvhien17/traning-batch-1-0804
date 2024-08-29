import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import QueryProvider from "@components/Provider/QueryProvider";
import { GlobalProvider } from "@components/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GlobalProvider>
        <QueryProvider>
          <body className={inter.className}>
            {children}
            <ToastContainer autoClose={1000} />
          </body>
        </QueryProvider>
      </GlobalProvider>
    </html>
  );
}
