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
  console.log(images, thumbnail)

  return (
    <div className="flex flex-col flex-1">
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
                <div className="relative w-full h-[calc(100vh-6.375rem)]">
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
          <div className="relative w-full h-[calc(100vh-6.375rem)]">
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
        <div className="mt-7 relative">
          <button
            className="cursor-pointer p-3 rounded-full absolute shadow-lg left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white"
            onClick={() => mainSliderRef.current?.go("-1")}
          >
            <FaChevronLeft size={20} />
          </button>
          <div className="bg-white p-3 rounded-lg shadow-lg w-full max-w-sm mx-auto">
            <Splide
              options={{
                type: "slide",
                perPage: 4,
                perMove: 1,
                gap: "1rem",
                pagination: false,
                arrows: false,
                focus: "center",
                breakpoints: {
                  1024: { perPage: 3 },
                  768: { perPage: 3 },
                  480: { perPage: 2 },
                },
              }}
            >
              {images.map((image, index) => (
                <SplideSlide key={index}>
                  <div className="relative w-full h-24">
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className={`rounded-md cursor-pointer ${selectedIndex === index ? "border-2 border-black" : ""
                        }`}
                      onClick={() => {
                        setSelectedIndex(index);
                        mainSliderRef.current?.go(index);
                      }}
                    />
                  </div>
                </SplideSlide>
              ))}
            </Splide>
          </div>

          <button
            className="cursor-pointer p-3 rounded-full absolute shadow-lg right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white"
            onClick={() => mainSliderRef.current?.go("+1")}
          >
            <FaChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
