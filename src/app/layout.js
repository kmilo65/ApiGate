import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import SessionProvider from "@/app/components/SessionProvider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <SessionProvider session={session}>
          <Toaster 
            position="top-right" 
            toastOptions={{
              duration: 4000,
              style: {
                fontSize: '14px',
                maxWidth: '90vw',
              },
            }}
          />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
