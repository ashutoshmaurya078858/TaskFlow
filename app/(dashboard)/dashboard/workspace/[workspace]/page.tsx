import { getCurrent } from "@/fetures/auth/action";
import HomeTab from "@/fetures/homeTab/HomeTab";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return (
    <>
      <HomeTab />
    </>
  );
};

export default page;
