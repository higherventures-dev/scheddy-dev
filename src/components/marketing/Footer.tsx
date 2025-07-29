'use client'
import Link from "next/link"
// NOTE
export default function Footer() {
  return (
    <footer className="py-8 border-t">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Scheddy. All rights reserved.</p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
