import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-blue-500 p-2 sm:p-4 text-center text-white fixed bottom-0">
      <div className="flex justify-between max-w-5xl mx-auto px-2 sm:px-4">
        <p className="text-xs sm:text-base">© 2024 Copyright undso</p>
        <Link href="/wikiSearch">
          <p className="text-xs sm:text-base text-white hover:underline">
            Check out this other cool tool: WikiSearch
          </p>
        </Link>
      </div>
    </footer>
  );
}
