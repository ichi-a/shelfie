

type Book = {
  id: string
  title: string
  thumbnail?: string
  tilt: string
}

const books: Book[] = [
  {
    id: "1",
    title: "Book 1",
    thumbnail:
      "https://books.google.com/books/content?id=zyTCAlFPjgYC&printsec=frontcover&img=1&zoom=1",
    tilt: "-rotate-2",
  },
  {
    id: "2",
    title: "Book 2",
    thumbnail:
      "https://books.google.com/books/content?id=OEBPSwAACAAJ&printsec=frontcover&img=1&zoom=1",
    tilt: "rotate-1",
  },
  {
    id: "3",
    title: "Book 3",
    thumbnail:
      "https://books.google.com/books/content?id=4l1eDwAAQBAJ&printsec=frontcover&img=1&zoom=1",
    tilt: "-rotate-1",
  },
  {
    id: "4",
    title: "Book 4",
    thumbnail:"",
    tilt: "rotate-2",
  },
]

export default function WallShelfBooks() {
  return (
    <div className="min-h-screen w-full bg-neutral-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="relative pt-10">
          {/* 板（壁から水平に突出） */}
          <div className="absolute left-1/2 top-41 -translate-x-1/2 w-full h-3 bg-amber-900 rounded-sm shadow-[0_6px_8px_rgba(0,0,0,0.18)]" />

          {/* 本 */}
          <div className="relative flex justify-center gap-12 pt-4">
            {books.map((book) => (
              <div
                key={book.id}
                className={`w-20 sm:w-24 aspect-[2/3] ${book.tilt} drop-shadow-[0_4px_6px_rgba(0,0,0,0.30)] bg-white`}
              >
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="h-full w-full object-cover rounded-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
