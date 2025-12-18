import "./globals.css";
import { ReactNode } from "react";
import { Roboto } from "next/font/google";
import Navbar from "./components/Navbar";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Interest Calculator",
  description: "Interest Calculator Web Application",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
