import { GeminiInput } from "@/components/GeminiInput";
import { SearchBooks } from "@/lib/SearchBooks ";
import { AuthButton } from "@/components/ui/AuthButton";
import WallShelfBooks from "@/components/ui/Shelf";
import { SearchBooksR } from "@/lib/searchBooksRakuten";
import Link from "next/link";



export default async function Home() {

  // const data = await SearchBooks("伊坂幸太郎")
  // if(!data) return
  // console.log(data)


  return (
    <div >
      <AuthButton />
      {/* <ul>
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
      <WallShelfBooks data={data} /> */}

      <div className="flex justify-center items-center w-full mx-auto text-center my-2 gap-3">
        <Link href="/search" className="text-blue-500 underline hover:text-blue-700">検索ページ</Link>
        <Link href="/myShelf" className="text-blue-500 underline hover:text-blue-700">My本棚</Link>
      </div>


      <GeminiInput />

    </div>
  );
}
