"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import moon from "../assets/moon.svg";
import sun from "../assets/sun.svg";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isShrunk, setIsShrunk] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }

    const handleScroll = () => {
      setIsShrunk(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  };

  return (
    <header
      className={`header ${isShrunk ? "shrink" : ""} dark:bg-gray-800 dark:text-white fixed top-0 left-0 w-full z-10`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Where in the world?
        </Link>
        <button onClick={toggleDarkMode} className="flex items-center space-x-2">
          <Image
            src={isDarkMode ? sun : moon}
            alt={isDarkMode ? "Sun icon" : "Moon icon"}
            width={24}
            height={24}
          />
          <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
