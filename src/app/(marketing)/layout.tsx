import { getOptionalUser } from "@/lib/auth/session";
import Navbar from "@/app/components/Layout/Navbar";
import "./landing.css";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getOptionalUser();
  return (
    <div className="marketing-mono flex min-h-dvh flex-col bg-background text-foreground">
      <Navbar user={user} />
      <main>{children}</main>
    </div>
  );
}
