"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Country {
  cca2: string;
  name: { common: string };
  flags: { png: string };
  population: number;
  region: string;
  capital?: string[];
}

async function getCountries(): Promise<Country[]> {
  const res = await fetch("https://restcountries.com/v3.1/all");
  if (!res.ok) throw new Error("Failed to fetch countries");
  return res.json();
}

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);

  const regions = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];

  // Define the type for the ref array
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const data = await getCountries();
        setCountries(data);
        setFilteredCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    const results = countries.filter((country) => {
      const matchesSearch = country.name.common
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesRegion =
        selectedRegion === "All" || country.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
    setFilteredCountries(results);
  }, [searchTerm, selectedRegion, countries]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
          } else {
            entry.target.classList.remove("fade-in");
          }
        });
      },
      { threshold: 0.1 } // Adjust threshold as needed
    );

    // Attach observer to each card
    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      // Cleanup observer from each card
      cardsRef.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, [filteredCountries]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex justify-between gap-4 mt-[150px]">
        <input
          type="text"
          placeholder="Search for a country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-3 border border-gray-300 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="p-3 border w-[200px] border-gray-300 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country, index) => (
            <Link
              key={country.cca2}
              href={`/details/${country.cca2}`}
              className="rounded-lg p-4 shadow-lg flex flex-col justify-between h-80 w-64 bg-white dark:bg-gray-800 text-black dark:text-white transform transition-transform duration-300 hover:translate-y-[-8px] hover:shadow-xl fade-in"
              ref={(el: HTMLAnchorElement | null) => {
                if (el) cardsRef.current[index] = el;
              }}
            >
              {country.flags.png && (
                <img
                  src={country.flags.png}
                  alt={`Flag of ${country.name.common}`}
                  className="w-full h-40 object-cover mb-2"
                />
              )}
              <h2 className="text-xl font-semibold mb-2">
                {country.name.common}
              </h2>
              <div className="flex-grow">
                <p className="mb-1">
                  <strong>Population:</strong>{" "}
                  {country.population.toLocaleString()}
                </p>
                <p className="mb-1">
                  <strong>Region:</strong> {country.region}
                </p>
                <p>
                  <strong>Capital:</strong>{" "}
                  {country.capital ? country.capital[0] : "N/A"}
                </p>
              </div>
            </Link>

          ))        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
            No countries found.
          </p>
        )}
      </div>
    </div>
  );
}
