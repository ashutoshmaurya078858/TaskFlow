import { SettingNavbar } from "@/components/(dashboard)/settings/setting-navbar";
import { getCurrent } from "@/fetures/auth/action";


interface AuthLayoutProps {
  children: React.ReactNode;
}
const AuthLayout = async({ children }: AuthLayoutProps) => {
   const user = await getCurrent();
    const safeUser = JSON.parse(JSON.stringify(user));
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
       <SettingNavbar  user={safeUser}/>
        <div >
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
