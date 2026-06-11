"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { resolveTripCardImage } from "@/lib/home-trip-cards";

const SWIPE_MS = 900;
const HOLD_MS = 600;

export function TripCardMedia({ images, alt, playing = false }) {
  const slides = images.length > 0 ? images : [resolveTripCardImage("")];
  const multi = slides.length > 1;
  const loopSlides = multi ? [...slides, slides[0]] : slides;

  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const timerRef = useRef(null);
  const playingRef = useRef(playing);

  playingRef.current = playing;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleAdvance = useCallback(
    (delay = HOLD_MS) => {
      clearTimer();
      timerRef.current = setTimeout(() => {
        if (!playingRef.current || slides.length < 2) return;
        setAnimate(true);
        setIndex((prev) => (prev < slides.length ? prev + 1 : prev));
      }, delay);
    },
    [clearTimer, slides.length]
  );

  useEffect(() => {
    if (!playing || !multi) {
      clearTimer();
      setIndex(0);
      setAnimate(true);
      return;
    }

    setIndex(0);
    setAnimate(true);
    scheduleAdvance(HOLD_MS);

    return clearTimer;
  }, [playing, multi, slides.length, scheduleAdvance, clearTimer]);

  const handleTransitionEnd = (e) => {
    if (e.propertyName !== "transform" || !multi || !playingRef.current) return;

    if (index === slides.length) {
      setAnimate(false);
      setIndex(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimate(true);
          scheduleAdvance(HOLD_MS);
        });
      });
      return;
    }

    scheduleAdvance(HOLD_MS);
  };

  const slideCount = loopSlides.length;
  const step = multi ? 100 / slideCount : 0;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="flex h-full"
        onTransitionEnd={handleTransitionEnd}
        style={{
          width: multi ? `${slideCount * 100}%` : "100%",
          transform: `translateX(-${index * step}%)`,
          transition: multi && animate ? `transform ${SWIPE_MS}ms ease-in-out` : "none",
        }}
      >
        {loopSlides.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative h-full shrink-0"
            style={{ width: multi ? `${100 / slideCount}%` : "100%" }}
          >
            <img
              src={src}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
