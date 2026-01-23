import { GeminiInput } from "@/components/GeminiInput";
import { SearchBooks } from "@/components/SearchBooks ";
import WallShelfBooks from "@/components/ui/Shelf";




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


      <GeminiInput />
    </div>
  );
}
