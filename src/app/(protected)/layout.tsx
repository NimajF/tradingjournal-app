import { getCurrentUser } from "@/lib/auth/session";
import { getFavoriteJournals } from "@/app/actions/journal";
import ProtectedShell from "@/app/(protected)/ProtectedShell";
import { Toaster } from "@/app/components/sonner";
// import GlobalAddButton from "@/app/components/Layout/GlobalAddButton";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, favoriteJournals] = await Promise.all([
    getCurrentUser(),
    getFavoriteJournals(),
  ]);

  return (
    <ProtectedShell user={user} favoriteJournals={favoriteJournals}>
      {children}
      <Toaster />
      {/* <GlobalAddButton /> */}
    </ProtectedShell>
  );
}
