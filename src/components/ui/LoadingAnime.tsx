
import BookLottie from "./BookLottie"
import Styles from "./LoadingAnime.module.css"

export const LoadingAnime = () => {
  return (
    <div className={`bg-[#C89B3C]/30 flex justify-center items-center mx-auto ${Styles.scene} mb-100`}>
      <img src="/image/bookshelf.png" alt="" className={Styles.bookshelf} />
      <img src="/image/Airobo.png" alt="" className={Styles.aiRobo}/>
      <img src="/image/Eye1.png" alt="" className={Styles.eye}/>
      <BookLottie className="absolute w-28 -bottom-10 right-22"/>
      <img src="/image/desk.png" alt="" className={Styles.desk}/>
    </div>
  )
}
