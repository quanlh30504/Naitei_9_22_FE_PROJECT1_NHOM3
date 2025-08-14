"use server";

import { auth } from "@/auth";
import connectToDB from "@/lib/db";
import Wallet from "@/models/Wallet";
import VerificationToken from "@/models/VerificationToken";
import bcrypt from "bcryptjs";
import { sendWalletActivationOtp } from "../email";
import { generateOtpCode } from "../utils";

// --- ACTION 1: GỬI MÃ OTP ---
export async function sendActivationOtp(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return { success: false, message: "Lỗi xác thực." };
  }
  const captchaToken = formData.get("captchaToken") as string;

  // Xác thực CAPTCHA
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
    });
    const captchaValidation = await res.json();

    // Điểm (score) của reCAPTCHA v3 > 0.5 được xem là người dùng thật
    if (!captchaValidation.success || captchaValidation.score < 0.5) {
      return {
        success: false,
        message: "Hệ thống phát hiện hoạt động đáng ngờ.",
      };
    }
  } catch (error) {
    // Ghi lại lỗi chi tiết ở phía server để debug
    console.error("Lỗi khi xác thực reCAPTCHA:", error);
    return {
      success: false,
      message: "Không thể xác thực reCAPTCHA. Vui lòng thử lại sau.",
    };
  }

  try {
    await connectToDB();
    const otp = generateOtpCode();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await VerificationToken.deleteMany({ userId: session.user.id });
    await VerificationToken.create({
      userId: session.user.id,
      token: hashedOtp,
      expires: new Date(Date.now() + 10 * 60 * 1000), // 10 phút
    });

    const userEmail = session.user.email;

    // Gửi mã otp đến email user
    await sendWalletActivationOtp(userEmail, otp);

    return { success: true, message: "Mã OTP đã được gửi." };
  } catch (error) {
    return { success: false, message: "Không thể gửi OTP. Vui lòng thử lại." };
  }
}

// --- ACTION 2: XÁC THỰC MÃ OTP ---
export async function verifyActivationOtp(prevState: any, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  const otp = formData.get("otp") as string;

  if (!userId || !otp) {
    return { success: false, message: "Vui lòng nhập mã OTP." };
  }

  try {
    await connectToDB();
    const verificationToken = await VerificationToken.findOne({ userId });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return {
        success: false,
        message: "Mã OTP không hợp lệ hoặc đã hết hạn.",
      };
    }

    const isOtpValid = await bcrypt.compare(otp, verificationToken.token);
    if (!isOtpValid) {
      return { success: false, message: "Mã OTP không chính xác." };
    }

    // OTP hợp lệ, xóa token và báo thành công
    await VerificationToken.findByIdAndDelete(verificationToken._id);
    return { success: true, message: "Xác thực thành công!" };
  } catch (error) {
    return { success: false, message: "Lỗi máy chủ." };
  }
}

// --- ACTION 3: TẠO VÍ VỚI MÃ PIN ---
export async function createWalletWithPin(prevState: any, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  const pin = formData.get("pin") as string;
  const confirmPin = formData.get("confirmPin") as string;

  if (!userId) {
    return { success: false, message: "Lỗi xác thực." };
  }
  if (!pin || pin.length !== 6 || pin !== confirmPin) {
    return { success: false, message: "Mã PIN không hợp lệ." };
  }

  try {
    await connectToDB();
    const existingWallet = await Wallet.findOne({ userId });
    if (existingWallet) {
      return { success: false, message: "Bạn đã có ví rồi." };
    }

    const pinHash = await bcrypt.hash(pin, 10);
    await Wallet.create({ userId, balance: 0, pinHash });

    return { success: true, message: "Kích hoạt ví thành công!" };
  } catch (error) {
    return { success: false, message: "Lỗi máy chủ." };
  }
}

/**
 * Lấy thông tin ví của người dùng đang đăng nhập.
 * @returns Trả về document Wallet hoặc null nếu không tồn tại.
 */
export async function getWalletForCurrentUser() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return null; // Người dùng chưa đăng nhập
    }

    await connectToDB();

    const wallet = await Wallet.findOne({ userId }).lean();

    // .lean() trả về plain object
    return wallet;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin ví:", error);
    return null;
  }
}

/**
 * GỬI LẠI MÃ OTP KÍCH HOẠT VÍ
 */
export async function resendActivationOtp() {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return { success: false, message: "Lỗi xác thực." };
  }

  try {
    await connectToDB();
    const otp = generateOtpCode();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await VerificationToken.deleteMany({ userId: session.user.id });
    await VerificationToken.create({
      userId: session.user.id,
      token: hashedOtp,
      expires: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendWalletActivationOtp(session.user.email, otp);

    return { success: true, message: "Mã OTP mới đã được gửi." };
  } catch (error) {
    console.error("Lỗi khi gửi lại OTP:", error);
    return {
      success: false,
      message: "Không thể gửi lại OTP. Vui lòng thử lại.",
    };
  }
}
