import { GeminiInput } from "@/components/GeminiInput";
import { SearchBooks } from "@/lib/SearchBooks ";
import { AuthButton } from "@/components/ui/AuthButton";
import WallShelfBooks from "@/components/ui/Shelf";
import { SearchBooksR } from "@/lib/searchBooksRakuten";
import { auth } from "@/lib/firebase";
import Link from "next/link";



export default async function Home() {
  const user = auth.currentUser

  // const data = await SearchBooks("伊坂幸太郎")
  // if(!data) return
  // console.log(data)


  return (
    <div className="p-2">
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


    <GeminiInput />


    </div>
  );
}
