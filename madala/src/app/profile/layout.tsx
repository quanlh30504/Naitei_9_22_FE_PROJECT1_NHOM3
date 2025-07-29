import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileSidebar from "@/Components/Profile/ProfileSidebar";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar  */}
          <ProfileSidebar user={session.user} />
          <section className="w-full md:w-3/4 bg-white p-8 rounded-lg shadow-sm">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
