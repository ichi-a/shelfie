import { GeminiInput } from "@/components/GeminiInput";
import { AuthButton } from "@/components/ui/AuthButton";
import { Welcome } from "@/components/ui/WelcomeMessage";
import { Loading } from "@/components/ui/Load";
import { DemoApp } from "@/components/ui/DemoApp";

export default async function Home() {
  return (
    <div className="bg-[#F5F3EF] p-2">
      <Loading />
      <AuthButton />
      <Welcome />
      <GeminiInput />
      <DemoApp />
    </div>
  );
}
