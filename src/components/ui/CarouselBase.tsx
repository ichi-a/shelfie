"use client";

import { demoData } from "@/data/demoData";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export function CarouselDemo() {
  return (
    <Carousel className="w-12/14">
      <CarouselContent>
        {demoData.map((item, i) => (
          <CarouselItem key={i}>
            <div className={`space-y-5`}>
              <div className="">{item.description}</div>
              <div className="relative mb-10 aspect-5/9 w-full overflow-hidden md:aspect-16/8 md:max-w-1000">
                <Image
                  src={item.imgUrl}
                  alt="アプリデモ画像"
                  fill
                  className={`hidden object-cover md:block`}
                />
                <Image
                  src={item.imgUrlSp}
                  alt="アプリデモ画像"
                  fill
                  className={`object-contain md:hidden`}
                />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="text-[#1F4D4F] max-md:border-none max-md:shadow-none" />
      <CarouselNext className="text-[#1F4D4F] max-md:border-none max-md:shadow-none" />
    </Carousel>
  );
}
