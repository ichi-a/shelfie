import { SearchBooks } from "@/components/SearchBooks ";
import WallShelfBooks from "@/components/ui/Shelf";


export default async function Home() {

  const data = await SearchBooks("dog")
  if(!data) return
  console.log(data)
  return (
    <div >
      <WallShelfBooks />
    <ul>
      {data.items?.map((book) => (
        <li key={book.id}>
          {book.id}
        </li>
      ))}
    </ul>

    </div>
  );
}
