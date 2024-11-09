// app/components/Navbar.js

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">Weather App</h1>
        <div className="flex space-x-4">
          <Link href="/search" className="hover:underline">
            Search
          </Link>
          <Link href="/saved" className="hover:underline">
            Saved
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/account" className="hover:underline">
            Account
          </Link>
        </div>
      </div>
    </nav>
  );
}
