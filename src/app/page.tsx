import { GeminiInput } from "@/components/GeminiInput";
import { SearchBooks } from "@/components/SearchBooks ";
import WallShelfBooks from "@/components/ui/Shelf";
import { SearchBooksR } from "@/lib/searchBooksRakuten";
import Link from "next/link";



export default async function Home() {

  const data = await SearchBooks("伊坂幸太郎")
  if(!data) return
  console.log(data)


  return (
    <div >
      <ul>
        {data.items?.map((book) => (
          <li key={book.id}>
            <p>{book.id}</p>
            <p>{book.volumeInfo.title}</p>
            {book.volumeInfo.authors?.map((v) => (
              <p key={v}>{v}</p>
            ))}
            <img src={book.volumeInfo?.imageLinks?.thumbnail} alt=""
            />
          </li>
        ))}
      </ul>
      <WallShelfBooks data={data} />

      <div className="flex justify-center items-center w-full mx-auto text-center my-2 ">
        <Link href="/search" className="text-blue-500 underline hover:text-blue-700">検索ページ</Link>
      </div>


      <GeminiInput />

    </div>
  );
}
