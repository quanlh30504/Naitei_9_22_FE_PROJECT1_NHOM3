"use server";

import { auth } from "@/auth";
import connectToDB from "@/lib/db";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

type ProfileUpdateState =
  | {
      success?: boolean;
      message: string;
    }
  | undefined;

/**
 * Cập nhật thông tin cá nhân của người dùng đang đăng nhập.
 * @param prevState - Trạng thái trước đó từ useFormState.
 * @param formData - Dữ liệu được gửi từ form.
 * @returns Một object chứa trạng thái thành công/thất bại và thông báo.
 */
export async function updateProfile(
  prevState: ProfileUpdateState,
  formData: FormData
): Promise<ProfileUpdateState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { message: "Bạn phải đăng nhập để thực hiện hành động này." };
  }

  const fullName = formData.get("fullName") as string;
  const nickname = formData.get("nickname") as string;
  const day = formData.get("day") as string;
  const month = formData.get("month") as string;
  const year = formData.get("year") as string;
  const gender = formData.get("gender") as string;
  const country = formData.get("country") as string;

  if (!fullName || fullName.trim().length < 3) {
    return { message: "Họ và tên phải có ít nhất 3 ký tự." };
  }
  const updateData: { [key: string]: any } = {
    name: fullName,
  };
  if (nickname) updateData.nickname = nickname;
  if (gender) updateData.gender = gender;
  if (country && country !== "Chọn quốc tịch") updateData.country = country;
  if (day !== "Ngày" && month !== "Tháng" && year !== "Năm") {
    updateData.birthDate = new Date(`${year}-${month}-${day}`);
  }

  try {
    await connectToDB();

    await User.findByIdAndUpdate(session.user.id, updateData);

    console.log("Cập nhật thông tin thành công:", updateData);
     revalidatePath("/", "layout");

    return {
      success: true,
      message: "Cập nhật thông tin thành công!",
    };
  } catch (error) {
    console.error("Lỗi cập nhật profile:", error);
    return { message: "Đã có lỗi xảy ra phía máy chủ." };
  }
}


// Định nghĩa kiểu dữ liệu trả về cho Header
export interface UserHeaderData {
  name: string;
  email: string;
  image?: string;
}

/**
 * Lấy thông tin cơ bản của người dùng để hiển thị trên Header.
 * Chỉ chọn các trường cần thiết để tối ưu hiệu suất.
 * @returns Dữ liệu người dùng cho Header hoặc null nếu không đăng nhập.
 */
export async function getUserForHeader(): Promise<UserHeaderData | null> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    await connectToDB();

    const user = await User.findById(session.user.id)
      .select("name email image") 
      .lean();

    if (!user) {
      return null;
    }

    return {
      name: user.name || "User",
      email: user.email || "",
      image: user.image,
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu người dùng cho header:", error);
    return null;
  }
}
