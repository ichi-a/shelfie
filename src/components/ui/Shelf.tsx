
// import { Book } from "@/types/book";



// export default async function WallShelfBooks({data}:Book) {

//   const bookData = await data
//   if (!bookData) {
//     console.log("")
//   }

//   return (
//     <div className="min-h-screen w-full bg-neutral-100 flex items-center justify-center px-4">
//       <div className="w-full max-w-md">
//         <div className="relative pt-10">
//           {/* 板（壁から水平に突出） */}
//           <div className="absolute left-1/2 top-41 -translate-x-1/2 w-full h-3 bg-amber-900 rounded-sm shadow-[0_6px_8px_rgba(0,0,0,0.18)]" />

//           {/* 本 */}
//           <div className="relative flex justify-center gap-12 pt-4">
//             {bookData?.items?.map((book) => (
//               <div
//                 key={book.id}
//                 className={`w-20 sm:w-24 aspect-2/3 drop-shadow-[0_4px_6px_rgba(0,0,0,0.30)] bg-white`}
//               >
//                 <img
//                   src=""
//                   alt=""
//                   className="h-full w-full object-cover rounded-sm"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
