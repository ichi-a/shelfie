import { GeminiInput } from "@/components/GeminiInput";
import { AuthButton } from "@/components/ui/AuthButton";

export default async function Home() {

  return (
    <div className="p-2 pb-20 bg-[#F5F3EF]">
      <AuthButton />
    <GeminiInput />


    </div>
  );
}
