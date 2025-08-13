import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import connectToDB from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    // Chuyển hướng nếu người dùng chưa đăng nhập
    redirect("/login");
  }

  try {
    await connectToDB();

    const fullUserData = await User.findById(session.user.id).lean();

    // Xử lý trường hợp session tồn tại nhưng không tìm thấy user trong DB
    if (!fullUserData) {
      throw new Error(
        "Không tìm thấy thông tin người dùng trong cơ sở dữ liệu."
      );
    }

    return (
      <main className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <ProfileSidebar user={JSON.parse(JSON.stringify(fullUserData))} />
            <section className="w-full md:w-3/4 bg-white p-8 rounded-lg shadow-sm">
              {children}
            </section>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    // Ghi lại lỗi trên server
    console.error("Lỗi trong ProfileLayout:", error);
    return (
      <main className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-center bg-white p-8 rounded-lg shadow-sm">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Đã xảy ra lỗi
              </h2>
              <p className="text-gray-600">
                Không thể tải thông tin cá nhân của bạn. Vui lòng thử lại sau.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
