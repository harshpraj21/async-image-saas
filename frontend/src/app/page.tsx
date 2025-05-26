import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="text-center space-y-6 bg-white shadow-xl p-10 rounded-2xl max-w-md">
        <h1 className="text-3xl font-bold text-zinc-800">Welcome to Image SaaS</h1>
        <p className="text-zinc-600 text-sm">
          Upload and process your images asynchronously with credits.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login">
            <Button variant="default">Login</Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline">Sign Up</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
