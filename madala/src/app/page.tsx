import { auth, signOut } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import userImage from "@/assets/images/Users/user-image.jpg";

export default async function HomePage() {
  const session = await auth();

  const imageProfile = session?.user?.image || userImage;

  return (
    <main className="font-sans text-center mt-12 p-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
        Trang Chủ
      </h1>

      {session ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg md:text-xl text-gray-700">
            Chào mừng trở lại,{" "}
            <strong className="font-semibold text-teal-600">
              {session.user?.name || session.user?.email}
            </strong>
            !
          </p>

          <Image
            src={imageProfile}
            alt="User avatar"
            width={80}
            height={80}
            className="rounded-full border-2 border-teal-500"
          />

          <form
            action={async () => {
              "use server";
              await signOut();
            }}
            className="mt-4"
          >
            <button
              type="submit"
              className="px-6 py-2 font-semibold text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200"
            >
              Đăng xuất
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg md:text-xl text-gray-700">
            Bạn chưa đăng nhập.
          </p>
          <Link
            href="/login"
            className="mt-2 px-6 py-2 font-semibold text-white bg-teal-500 rounded-lg shadow-md hover:bg-teal-600 transition-colors duration-200"
          >
            Đi đến trang Đăng nhập
          </Link>
        </div>
      )}
    </main>
  );
}
