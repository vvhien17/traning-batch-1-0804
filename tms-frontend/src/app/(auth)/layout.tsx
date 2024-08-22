import { Header } from "@components/components/header/Header";
import { SideMenu } from "@components/components/side-menu/SideMenu";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <div className="flex">
        <SideMenu />
        <div className="min-h-screen bg-zinc-100 w-full pl-10">
          {children}
        </div>
      </div>
    </div>
  );
}
