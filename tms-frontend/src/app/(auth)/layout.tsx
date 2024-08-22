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
      <SideMenu />
      {children}
    </div>
  );
}
