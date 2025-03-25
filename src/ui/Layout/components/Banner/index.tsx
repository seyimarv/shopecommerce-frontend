"use client";

import { useRef, useState } from "react";
import { Splide, SplideSlide, SplideRef } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import {
  FaChevronRight,
  FaChevronLeft,
  FaPause,
  FaPlay,
} from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { retrieveAnnouncements } from "@/lib/data/announcements";

const Banner: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["announcements"],
    queryFn: retrieveAnnouncements,
  });
  const splideRef = useRef<SplideRef>(null);
  const [autoPlay, setAutoPlay] = useState(true);

  const goNext = () => splideRef.current?.splide.go("+1");
  const goPrev = () => splideRef.current?.splide.go("-1");

  const toggleAutoplay = () => {
    const splide = splideRef.current?.splide;
    if (splide) {
      const { Autoplay } = splide.Components;
      if (autoPlay) {
        Autoplay.pause();
      } else {
        Autoplay.play();
      }
      setAutoPlay(!autoPlay);
    }
  };

  return (
    <div className="bg-secondary w-full py-4 relative h-[2.5rem]" id="banner">
      <div className="container flex items-center h-full">
        <Splide
          ref={splideRef}
          options={{
            type: "loop",
            perPage: 1,
            autoplay: autoPlay,
            interval: 3000,
            pauseOnHover: true,
            speed: 500,
            arrows: false,
            pagination: false,
          }}
          className="flex-1"
        >
          {data?.announcements?.map(
            (announcement: { id: number; message: string }) => (
              <SplideSlide key={announcement?.id}>
                <p className="text-xs font-light tracking-widest">
                  {announcement?.message}
                </p>
              </SplideSlide>
            )
          )}
        </Splide>
        <div className="flex gap-4 text-sm font-light">
          <button className="cursor-pointer" onClick={goPrev}>
            <FaChevronLeft />
          </button>
          <button className="cursor-pointer" onClick={toggleAutoplay}>
            {autoPlay ? <FaPause /> : <FaPlay />}
          </button>
          <button className="cursor-pointer" onClick={goNext}>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
