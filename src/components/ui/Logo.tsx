"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Logo() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const updateLogo = () => {
      setIsLight(document.documentElement.classList.contains("light"));
    };

    updateLogo();

    const observer = new MutationObserver(updateLogo);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Image
      src={isLight ? "/darkLogo.png" : "/lightLogo.png"}
      alt="ReviewRadar Logo"
      width={78}
      height={68}
      style={{ height: "auto" }}
      priority
    />
  );
}