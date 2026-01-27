
import Styles from "./LoadingAnime.module.css"

export const LoadingAnime = () => {
  return (
    <div className={`bg-orange-200 flex justify-center items-center mx-auto ${Styles.scene}`}>
      <img src="/image/bookshelf.png" alt="" className={Styles.bookshelf} />
      <img src="/image/librarian_l.png" alt="" className={Styles.librarian}/>
      <img src="/image/desk.png" alt="" className={Styles.desk}/>
    </div>
  )
}
