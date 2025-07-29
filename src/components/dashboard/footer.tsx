'use client'
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="py-8 border-t">
      <div className="flex-1 w-full flex flex-col items-center">
        <p>© {new Date().getFullYear()} Scheddy. All rights reserved.</p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
