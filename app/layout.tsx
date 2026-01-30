import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/LightRays/LightRays";
import Navbar from "@/components/Navbar";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Event App",
  description: "An application to manage developer events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} min-h-screen antialiased`}
      >

        <Navbar />


      



<div className="absolute insert-0 top-0 z-[-1] min-h-screen" style={{ width: '100%', height: '600px',}}>
  <LightRays
    raysOrigin="top-center-offset"
    raysColor="#ffffff"
    raysSpeed={1}
    lightSpread={0.5}
    rayLength={1.4}
    followMouse={true}
    mouseInfluence={0.1}
    noiseAmount={0}
    distortion={0}
   
/>
</div>
        
        <main>
          {children}

        </main>
      </body>
    </html>
  );
}
