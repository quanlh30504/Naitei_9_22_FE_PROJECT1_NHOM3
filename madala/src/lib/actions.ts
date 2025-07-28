"use server";

import { AuthError } from "next-auth";
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
    return { success: true, message: "Đăng nhập thành công! Đang chuyển hướng..." };

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
