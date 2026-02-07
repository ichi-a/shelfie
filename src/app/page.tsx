import { GeminiInput } from "@/components/GeminiInput";
import { AuthButton } from "@/components/ui/AuthButton";
import { Welcome } from "@/components/ui/WelcomeMessage";
import { Loading } from "@/components/ui/Load";
import { DemoApp } from "@/components/ui/DemoApp";

export default async function Home() {


  return (
    <div className="p-2 bg-[#F5F3EF]">
      <Loading />
      <AuthButton />
      <Welcome />
      <GeminiInput />
      <DemoApp />

    </div>
  );
}
