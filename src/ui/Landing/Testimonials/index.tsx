"use client";

import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { GrNext } from "react-icons/gr";
import Image from "next/image";
import StarRating from "@/ui/common/components/star-rating";

interface Testimonial {
  url: string;
  alt: string;
  name: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    url: "/picture1.jpg",
    alt: "Beautiful nature",
    name: "John Doe",
    quote: "This service is absolutely amazing! Highly recommended.",
    rating: 5,
  },
  {
    url: "/picture1.jpg",
    alt: "City skyline",
    name: "Jane Smith",
    quote: "I've never experienced such great quality and professionalism.",
    rating: 4,
  },
  {
    url: "/picture1.jpg",
    alt: "Ocean waves",
    name: "Emily Johnson",
    quote: "A truly wonderful experience from start to finish.",
    rating: 5,
  },
  {
    url: "/picture1.jpg",
    alt: "Mountain view",
    name: "Michael Brown",
    quote: "Fantastic! Will definitely come back again.",
    rating: 4,
  },
  {
    url: "/picture1.jpg",
    alt: "Dense forest",
    name: "Sophia Williams",
    quote: "Exceeded all my expectations. 5 stars!",
    rating: 5,
  },
  {
    url: "/picture1.jpg",
    alt: "Desert landscape",
    name: "Daniel Martinez",
    quote: "I am blown away by the attention to detail.",
    rating: 4,
  },
];

interface ArrowButtonProps {
  children: React.ReactNode;
  className?: string;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({ children, className }) => (
  <button
    className={`${className} absolute !-top-1/2 -translate-y-1/2 text-xl !bg-white p-2 rounded-full shadow-xl`}
  >
    {children}
  </button>
);

const Testimonials: React.FC = () => {
  const mainRef = useRef<Splide | null>(null);
  const thumbsRef = useRef<Splide | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | string>("");

  useEffect(() => {
    if (mainRef.current && thumbsRef.current) {
      const mainSplide = mainRef.current.splide;
      const thumbsSplide = thumbsRef.current.splide;

      mainSplide.sync(thumbsSplide);
      thumbsSplide.sync(mainSplide);
    }
  }, []);

  return (
    <div className="gallery-with-thumbs relative container max-w-6xl mx-auto">
      <h4 className="text-center text-2xl tracking-widest uppercase -mb-4">
        Our Customers love us
      </h4>
      <div className="py-8 max-w-2xl mx-auto relative w-full">
        <Splide
          ref={thumbsRef}
          options={{
            type: "loop",
            fixedWidth: 120,
            fixedHeight: 120,
            gap: 20,
            pagination: false,
            arrows: false,
            interval: 3000,
            isNavigation: true,
            focus: "center",
          }}
          aria-label="Thumbnails"
          hasTrack={false}
          className="w-full"
          onMove={(splide: { index: SetStateAction<number | string> }) =>
            setActiveIndex(splide.index)
          }
          onMounted={() => setActiveIndex(0)}
        >
          <SplideTrack>
            {testimonials.map((image, index) => (
              <SplideSlide
                key={index}
                className="!border-none flex items-center justify-center"
              >
                <div className="relative w-[60px] h-[60px]">
                  <Image
                    src={image.url}
                    alt={`Thumbnail - ${image.alt}`}
                    fill
                    className={`rounded-lg transition-all duration-300 object-cover object-center
        ${index === activeIndex ? "scale-125" : "opacity-50"}`}
                  />
                </div>
              </SplideSlide>
            ))}
          </SplideTrack>
        </Splide>
      </div>

      {/* Main Carousel */}
      <div className="mt-4 w-full">
        <Splide
          ref={mainRef}
          options={{
            type: "loop",
            perPage: 1,
            pagination: false,
            arrows: true,
            interval: 3000,
            pauseOnHover: true,
            keyboard: true,
          }}
          aria-label="Main Slider"
          hasTrack={false}
        >
          <SplideTrack>
            {testimonials.map((image, index) => (
              <SplideSlide key={index}>
                <div className="max-w-lg mx-auto flex justify-center items-center flex-col font-light text-md">
                  <StarRating rating={image.rating} />
                  <span className="italic tracking-wider text-center mb-2">
                    {image.quote}
                  </span>
                  <div className="flex items-center">
                    <span className="w-4 h-[2px] bg-gray-500 inline-block"></span>
                    <span className="text-sm text-gray-500 uppercase ml-2">
                      {image.name}
                    </span>
                  </div>
                </div>
              </SplideSlide>
            ))}
          </SplideTrack>
          <div className="splide__arrows">
            <ArrowButton className="splide__arrow splide__arrow--prev left-4 top-1/2">
              <GrNext fill="black" stroke="black" />
            </ArrowButton>

            <ArrowButton className="splide__arrow splide__arrow--next right-4 top-1/2">
              <GrNext fill="black" stroke="black" />
            </ArrowButton>
          </div>
        </Splide>
      </div>
    </div>
  );
};

export default Testimonials;
