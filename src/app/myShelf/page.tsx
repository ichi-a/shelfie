import { getCurrentUser } from "@/lib/auth-utils";
import MyShelfPage from "./MyShelfPage";

async function MyShelf() {
  const user = await getCurrentUser();

  return (
    <div>
      <MyShelfPage user={user} />
    </div>
  );
}

export default MyShelf;
