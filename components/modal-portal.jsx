"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/** Full-screen overlays — above nav (z-40) and sticky bars, below OmLoader (z-200). */
export const MODAL_LAYER_CLASS = "z-[100]";

/**
 * Renders children on document.body so fixed modals sit above the site header.
 * Content inside <main> cannot stack above the navbar without a portal.
 */
export function ModalPortal({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !children) return null;

  return createPortal(children, document.body);
}
