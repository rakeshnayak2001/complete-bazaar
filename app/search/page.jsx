"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard"; // adjust path if needed
import Image from "next/image";

export default function SearchPage() {
  const { products } = useAppContext();
  const [query, setQuery] = useState("");
  const router = useRouter();

  // simple filter by name (you can extend to category, description, etc.)
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="px-6 md:px-16 lg:px-32 py-8">
      <div className="flex items-center space-x-2 mb-6">
        <button onClick={() => router.back()} className="text-xl">
          <Image
            className="group-hover:-translate-x-1 transition"
            src={assets.arrow_right_icon_colored}
            alt="arrow_right_icon_colored"
          />
        </button>
        <input
          type="text"
          className="flex-1 p-2 rounded-full focus:outline-none border border-gray-300"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {filtered.length === 0 && query ? (
        <p className="text-center text-gray-500">No products match “{query}”</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-x-10 lg:gap-x-20">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
