"use client"

import { useEffect, useRef } from "react";

type Handler = (event: MouseEvent | TouchEvent) => void;
type AnimationCallback = () => void;

const useOnClickOutside = <T extends HTMLElement>(
  handler: Handler,
  animation?: AnimationCallback
) => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;

      if (animation) {
        animation();
        setTimeout(() => handler(event), 300);
      } else {
        handler(event);
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [handler, animation]);

  return ref;
};

export default useOnClickOutside;
