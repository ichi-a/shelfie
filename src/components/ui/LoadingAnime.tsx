import BookLottie from "./BookLottie";
import Styles from "./LoadingAnime.module.css";

export const LoadingAnime = () => {
  return (
    <div
      className={`mx-auto flex items-center justify-center bg-[#C89B3C]/30 ${Styles.scene} mb-100`}
    >
      <img src="/image/bookshelf.png" alt="" className={Styles.bookshelf} />
      <img src="/image/Airobo.png" alt="" className={Styles.aiRobo} />
      <img src="/image/Eye1.png" alt="" className={Styles.eye} />
      <BookLottie className="absolute right-22 -bottom-10 w-28" />
      <img src="/image/desk.png" alt="" className={Styles.desk} />
    </div>
  );
};
