"use client";

import Lottie from "lottie-react";
import bookAnim from "@/assets/animation/bookAnim.json";

const BookLottie = ({ className }: { className: string }) => {
  return (
    <Lottie
      animationData={bookAnim}
      loop={true}
      autoPlay={true}
      className={className}
    />
  );
};

export default BookLottie;
