"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { SplideTrack, Splide as SplideComponent, SplideSlide } from "@splidejs/react-splide";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/ui/common/components/button";
import ProgressBar from "./progress-bar";

interface HeroProps {
  collections: any;
}

const HeroSection: React.FC<HeroProps> = ({ collections }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const splideRef = useRef<any>(null);

  const navigate = (index: number) => {
    if (splideRef.current) {
      splideRef.current?.splide?.go(index);
    }
  };

  return (
    <section className="relative w-full h-[calc(100vh-14rem)] md:h-[calc(100vh-7rem)]">
      <SplideComponent
        ref={splideRef}
        options={{
          type: "loop",
          perPage: 1,
          pagination: false,
          arrows: false,
          interval: 5000,
          autoplay: true,
          keyboard: true,
          pauseOnHover: false,
        }}
        aria-label="Hero Banner Carousel"
        hasTrack={false}
        onMove={(splide: any) => setActiveIndex(splide.index)}
        onMounted={() => setActiveIndex(0)}
      >
        <SplideTrack>
          {collections?.map(({ title, metadata, handle }: any, index: number) => (
            <SplideSlide key={index}>
              <div className="relative w-full h-[calc(100vh-14rem)] md:h-[calc(100vh-7rem)] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex} // 🔥 Forces re-mount when index changes
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 3, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image
                      src={metadata?.cover_image || "/fallback.jpg"}
                      alt={`Slide ${index}`}
                      fill
                      priority
                      className="object-cover object-center"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-white opacity-3"></div>
                <div className="container px-4 md:px-0">
                  <div className="absolute bottom-20 md:bottom-40 flex flex-col gap-4 md:gap-8 items-start">
                    <h4 className="text-3xl md:text-5xl uppercase font-normal">{title}</h4>
                    <Button className="py-2 md:py-3 min-w-[10rem] md:min-w-[14rem]" variant="secondary" isLink href={`/collections/${handle}`}>
                      Shop Now
                    </Button>
                  </div>
                </div>
              </div>
            </SplideSlide>
          ))}
        </SplideTrack>
      </SplideComponent>

      {/* Navigation Dots */}
      <div className="flex gap-1 md:gap-2 w-full justify-center absolute z-10 bottom-12 md:bottom-8 items-end">
        {collections?.map((_: any, index: number) => (
          <button
            key={index}
            className={`cursor-pointer bg-gray-100 transition-all duration-300 ${
              index === activeIndex
                ? "w-[2rem] md:w-[3rem] h-[0.5rem] md:h-[0.75rem]"
                : "w-[2rem] md:w-[3rem] h-[0.3rem] md:h-[0.5rem]"
            }`}
            onClick={() => navigate(index)}
          >
            {index === activeIndex ? (
              <ProgressBar />
            ) : (
              <span className="w-full h-full bg-gray-400 block"></span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
