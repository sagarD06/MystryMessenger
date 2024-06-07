"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react"; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import { WavyBackground } from "@/components/ui/wavy-background";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

export default function Home() {
  const words = [
    {
      text: "Dive",
      className: "text-white dark:text-white"
    },
    {
      text: "into the",
      className: "text-white dark:text-white"

    },
    {
      text: "world",
      className: "text-white dark:text-white"

    },
    {
      text: "of",
      className: "text-white dark:text-white"

    },
    {
      text: "Anonymous Messages.",
      className: "text-orange-500 dark:text-orange-500",
    },
  ];
  return (
    <WavyBackground backgroundFill="#111827" className="w-full ssssss max-w-7xl mx-auto flex flex-col items-center justify-center h-auto md:h-[30rem]">
        {/* Main content */}
        <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-10 text-white">
          <section className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold">
              <TypewriterEffectSmooth words={words} />
            </h1>
            <p className="mt-3 md:mt-4 text-base md:text-lg">
              Mystry Messenger - Where your identity remains a secret.
            </p>
          </section>

          {/* Carousel for Messages */}
          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full max-w-lg md:max-w-xl"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0" />
                      <div>
                        <p>{message.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <Link href="/sign-up">
            <Button className="bg-orange-400 mt-2 hover:bg-orange-600">Get started</Button>
          </Link>
        </main>

        {/* Footer */}
        <footer className="text-center p-4 md:p-6 text-white z-20">
          © 2024 Mystry Messenger. All rights reserved.
        </footer>
    </WavyBackground>
  );
}
