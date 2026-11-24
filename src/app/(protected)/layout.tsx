import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth/session";
import { getFavoriteJournals } from "@/app/actions/journal";
import { getFavoriteNewsletters } from "@/app/actions/newsletter";
import ProtectedShell from "@/app/(protected)/ProtectedShell";
import { Toaster } from "@/app/components/sonner";
import { SIDEBAR_COLLAPSED_COOKIE } from "@/lib/constants/app";
// import GlobalAddButton from "@/app/components/Layout/GlobalAddButton";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, favoriteJournals, favoriteNewsletters, cookieStore] =
    await Promise.all([
      getCurrentUser(),
      getFavoriteJournals(),
      getFavoriteNewsletters(),
      cookies(),
    ]);
  const initialSidebarCollapsed =
    cookieStore.get(SIDEBAR_COLLAPSED_COOKIE)?.value === "true";

  return (
    <ProtectedShell
      user={user}
      favoriteJournals={favoriteJournals}
      favoriteNewsletters={favoriteNewsletters}
      initialSidebarCollapsed={initialSidebarCollapsed}
    >
      {children}
      <Toaster />
      {/* <GlobalAddButton /> */}
    </ProtectedShell>
  );
}
