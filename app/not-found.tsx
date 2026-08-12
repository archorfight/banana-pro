import './globals.css';
import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-orange-50 px-4">
          <div className="text-center max-w-md">
            <div className="text-8xl mb-6">🍌</div>
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">
              Oops! This page slipped away like a banana peel.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold rounded-full hover:from-yellow-500 hover:to-orange-600 transition-all shadow-lg"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
