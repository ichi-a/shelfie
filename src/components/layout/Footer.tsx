
import Link from 'next/link'


export const Footer = () => {
  return (
    <div className='max-w-full bg-gray-200 flex pb-5'>
      <nav className='flex gap-3 p-2'>
        <Link href="/" className="text-blue-500 underline hover:text-blue-700">Home</Link>
        <Link href="/search" className="text-blue-500 underline hover:text-blue-700">Search</Link>
        <Link href="/myShelf" className="text-blue-500 underline hover:text-blue-700">MyShelf</Link>
      </nav>
    </div>
  )
}
