"use server";

import { AuthError } from "next-auth";
import User from "@/models/User";
import connectToDB from "@/lib/db";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";


type ActionState = {
      success?: boolean;
      message: string;
} | undefined;

// --- Action cho Đăng nhập ---
/**
 * Xử lý đăng nhập bằng Credentials.
 * Khi thành công, signIn sẽ tự động chuyển hướng.
 * @param prevState - Trạng thái trước đó từ useFormState (không dùng).
 * @param formData - Dữ liệu từ form.
 * @returns Một chuỗi lỗi nếu thất bại, ngược lại không trả về gì.
 */
export async function authenticateCredentials(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirect: false,
    });
    return { success: true, message: "Đăng nhập thành công! " };

  } catch (error) {
    if (error instanceof AuthError) {
      console.error(
        `[SERVER LOGIN ERROR]: AuthError caught. Type: ${error.type}`,
        { cause: error.cause }
      );

      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Email hoặc mật khẩu không chính xác." };
        case "CallbackRouteError":
          return { message: "Lỗi xác thực. Vui lòng kiểm tra lại thông tin đăng nhập." };
        default:
          return { message: "Đã có lỗi không mong muốn xảy ra." };
      }
    }

    // Xử lý các lỗi không phải là AuthError
    console.error("Unexpected error during login action:", error);
    return { message: "Đã có lỗi nghiêm trọng phía máy chủ." };
  }
}

// --- Action cho Đăng ký ---

/**
 * Xử lý logic đăng ký người dùng.
 * @param prevState - Trạng thái trước đó từ useFormState.
 * @param formData - Dữ liệu được gửi từ form.
 * @returns Một object chứa trạng thái thành công/thất bại và thông báo.
 */
export async function registerUser(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const phone = formData.get("phone") as string;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return { message: "Vui lòng điền đầy đủ thông tin." };
  }

  if (password !== confirmPassword) {
    return { message: "Mật khẩu xác nhận không khớp." };
  }
  if (!/^\d{10,11}$/.test(phone.trim())) {
    return {
      message:
        "Số điện thoại không hợp lệ. Vui lòng chỉ nhập số, từ 10-11 chữ số.",
    };
  }
  try {
    await connectToDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { message: "Địa chỉ email này đã được sử dụng." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      phone: phone.trim()
      // Role sẽ được tự động gán là "user" theo default trong schema
    });

    await newUser.save();
    return { success: true, message: "Đăng ký tài khoản thành công! " };
  } catch (error) {
    console.error("Lỗi đăng ký phía server:", error);
    return { message: "Đã có lỗi xảy ra phía máy chủ. Vui lòng thử lại." };
  }
}
