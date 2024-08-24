import React from "react";
import Link from "next/link";

interface CountryDetail {
  flags: { png: string };
  name: { common: string };
  population: number;
  region: string;
  capital?: string[];
  subregion: string;
  languages: Record<string, string>;
  currencies: Record<string, { name: string }>;
}

async function getCountryData(id: string): Promise<CountryDetail> {
  const res = await fetch(`https://restcountries.com/v3.1/alpha/${id}`);
  if (!res.ok) throw new Error("Failed to fetch country data");
  const data = await res.json();
  return data[0];
}

export default async function Details({ params }: { params: { id: string } }) {
  const country = await getCountryData(params.id);

  return (
    <div className="container mx-auto p-4">
      <Link
        href="/"
        className="mb-4 inline-block text-black hover:underline mt-[80px] dark:text-white"
      >
        &larr; Back
      </Link>
      <div className="rounded-lg p-4 shadow-lg flex gap-[116px] items-center mt-[80px] bg-white dark:bg-gray-800">
        {country.flags.png && (
          <img
            src={country.flags.png}
            alt={`Flag of ${country.name.common}`}
            className="w-[560px] h-[401px] mb-4"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold mb-2 text-black dark:text-white">
            {country.name.common}
          </h1>
          <p className="mb-2 text-black dark:text-white">
            <strong>Population:</strong> {country.population.toLocaleString()}
          </p>
          <p className="mb-2 text-black dark:text-white">
            <strong>Region:</strong> {country.region}
          </p>
          <p className="mb-2 text-black dark:text-white">
            <strong>Capital:</strong>{" "}
            {country.capital ? country.capital[0] : "N/A"}
          </p>
          <p className="mb-2 text-black dark:text-white">
            <strong>Subregion:</strong> {country.subregion}
          </p>
          <p className="mb-2 text-black dark:text-white">
            <strong>Languages:</strong>{" "}
            {Object.values(country.languages).join(", ")}
          </p>
          <p className="text-black dark:text-white">
            <strong>Currency:</strong>{" "}
            {Object.values(country.currencies)
              .map((currency) => currency.name)
              .join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}
