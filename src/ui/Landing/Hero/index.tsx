/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useState, useRef, SetStateAction } from "react";
import { SplideTrack, Splide, SplideSlide } from "@splidejs/react-splide";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/ui/common/components/button";
import ProgressBar from "./progress-bar";

interface HeroProps {
  collections: any;
}

const HeroSection: React.FC<HeroProps> = ({ collections }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const splideRef = useRef<Splide | null>(null);

  const navigate = (index: number) => {
    if (splideRef.current) {
      splideRef.current.splide.go(index);
    }
  };

  return (
    <section className="relative w-full h-[calc(100vh-6.375rem)]">
      <Splide
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
        aria-label="Main Slider"
        hasTrack={false}
        onMove={(splide: { index: SetStateAction<number> }) =>
          setActiveIndex(splide.index)
        }
        onMounted={() => setActiveIndex(0)}
      >
        <SplideTrack>
          {collections?.map(({ title, metadata }: any, index: number) => (
            <SplideSlide key={index}>
              <div className="relative w-full h-[calc(100vh-6.375rem)] overflow-hidden">
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
                <div className="container">
                  <div className="absolute bottom-40 flex flex-col gap-8 items-start">
                    <h4 className="text-5xl uppercase font-normal">{title}</h4>
                    <Button className="py-3 min-w-[14rem]" variant="secondary">
                      Shop Now
                    </Button>
                  </div>
                </div>
              </div>
            </SplideSlide>
          ))}
        </SplideTrack>
      </Splide>

      {/* Navigation Dots */}
      <div className="flex gap-2 w-full justify-center absolute z-10 bottom-8 items-end">
        {collections?.map((_: any, index: number) => (
          <button
            key={index}
            className={`cursor-pointer bg-gray-100 transition-all duration-300 ${
              index === activeIndex
                ? "w-[3rem] h-[0.75rem]"
                : "w-[3rem] h-[0.5rem]"
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
