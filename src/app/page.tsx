import { GeminiInput } from "@/components/GeminiInput";
import { AuthButton } from "@/components/ui/AuthButton";
import { Welcome } from "@/components/ui/WelcomeMessage";
import { Loading } from "@/components/ui/Load";
import { DemoApp } from "@/components/ui/DemoApp";
import { getCurrentUser } from "@/lib/auth-utils";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="bg-[#F5F3EF] p-2">
      {/* <Loading user={user} /> */}
      <AuthButton user={user} />
      <Welcome user={user} />
      <GeminiInput />
      <DemoApp />
    </div>
  );
}
