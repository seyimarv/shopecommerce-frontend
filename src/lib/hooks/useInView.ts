import { useEffect, useState, useRef } from "react";

interface UseInViewOptions {
  id?: string;
  ref?: React.RefObject<HTMLElement>;
  threshold?: number; // Intersection Observer threshold (default 0)
  rootMargin?: string; // Allows offset adjustments
}

export function useInView({
  id,
  ref,
  threshold = 0,
  rootMargin = "0px",
}: UseInViewOptions) {
  const [isInView, setIsInView] = useState(false);
  const internalRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = id ? document.getElementById(id) : ref?.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [id, ref, threshold, rootMargin]);

  return { isInView, ref: internalRef };
}
