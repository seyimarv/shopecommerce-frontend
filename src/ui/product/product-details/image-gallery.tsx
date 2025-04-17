"use client";

import { useState, useRef, SetStateAction } from "react";
import Image from "next/image";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";

interface ImageGalleryProps {
  images: string[];
  thumbnail: string;
}

export default function ImageGallery({ images, thumbnail }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainSliderRef = useRef<Splide | null>(null);

  return (
    <div className="flex flex-col w-full">
      <div className="relative">
        {images.length > 1 ? (
          <Splide
            ref={mainSliderRef}
            options={{
              type: "fade",
              rewind: true,
              pagination: false,
              arrows: false,
              autoplay: false,
            }}
            onMove={(splide: { index: SetStateAction<number> }) =>
              setSelectedIndex(splide.index)
            }
          >
            {images.map((image, index) => (
              <SplideSlide key={index}>
                <div className="relative w-full aspect-square max-h-[600px]">
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg shadow-md"
                    priority={index === 0}
                  />
                </div>
              </SplideSlide>
            ))}
          </Splide>
        ) : (
          <div className="relative w-full aspect-square max-h-[600px]">
            <Image
              src={thumbnail}
              alt="Thumbnail"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-md"
              priority
            />
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-4 md:mt-7 relative">
          <button
            className="hidden sm:block cursor-pointer p-2 rounded-full absolute shadow-lg left-2 lg:left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white"
            onClick={() => mainSliderRef.current?.go("-1")}
          >
            <FaChevronLeft size={16} className="md:text-lg" />
          </button>
          <div className="bg-white p-2 md:p-3 rounded-lg shadow-lg w-full sm:!max-w-sm mx-auto">
            <Splide
              options={{
                type: "slide",
                perPage: 4,
                perMove: 1,
                gap: "0.5rem",
                pagination: false,
                arrows: false,
                autoWidth: false,
                fixedWidth: false,
                trimSpace: true,
                focus: 0,
                breakpoints: {
                  1200: { perPage: 5, gap: "0.75rem" },
                  992: { perPage: 4, gap: "0.75rem" },
                  768: { perPage: 4, gap: "0.5rem" },
                },
              }}
            >
              {images.map((image, index) => (
                <SplideSlide key={index}>
                  <div 
                    className={`relative aspect-square w-full cursor-pointer rounded-md transition-all duration-100 overflow-hidden ${
                      selectedIndex === index 
                        ? "border" 
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedIndex(index);
                      mainSliderRef.current?.go(index);
                    }}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-200 hover:scale-105"
                    />
                  </div>
                </SplideSlide>
              ))}
            </Splide>
          </div>

          <button
            className="hidden sm:block cursor-pointer p-2 lg:p-3 rounded-full absolute shadow-lg right-2 lg:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white"
            onClick={() => mainSliderRef.current?.go("+1")}
          >
            <FaChevronRight size={16} className="md:text-lg" />
          </button>
        </div>
      )}
    </div>
  );
}
