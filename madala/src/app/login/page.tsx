"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { authenticateCredentials } from "@/lib/actions";
import { signIn } from "next-auth/react";

import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import SubmitButton from "@/Components/Buttons/SubmitButton";
import ActionButton from "@/Components/Buttons/ActionButton";
import { useSearchParams } from "next/navigation";
import { ChromeIcon, GithubIcon } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, dispatch] = useActionState(authenticateCredentials, undefined);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);

      window.dispatchEvent(new CustomEvent("loginSuccess"));

      router.push("/");
    }

    if (state && !state.success && !state.errors) {
      // Kiểm tra nếu là thông báo tài khoản bị ban
      if (
        state.message.includes("vô hiệu hóa") ||
        state.message.includes("⚠️")
      ) {
        toast.error(state.message, {
          duration: 8000, // Hiển thị lâu hơn cho thông báo quan trọng
          style: {
            background: "#fee2e2",
            color: "#991b1b",
            border: "2px solid #fca5a5",
            fontSize: "14px",
            fontWeight: "600",
          },
          icon: "🚫",
        });
      } else {
        toast.error(state.message);
      }
    }
  }, [state, router]);

  useEffect(() => {
    const error = searchParams.get("error");

    // lấy mã lỗi từ URL để hiển thị toast
    if (error === "CartAuthRequired") {
      toast.error("Bạn cần đăng nhập để xem giỏ hàng");
    }
  }, [searchParams]);
  const handleSocialLogin = async (provider: "google" | "github") => {
    await signIn(provider, { callbackUrl: "/" }, { prompt: "select_account" });
  };

  return (
    <main className="bg-white text-gray-800 min-h-screen">
      <div className="container mx-auto px-4 py-10 md:py-16 max-w-4xl">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-xl md:text-2xl font-semibold tracking-widest uppercase">
            Đăng nhập
          </h1>
          <ActionButton>
            <Link href="/register">Đăng ký</Link>
          </ActionButton>
        </header>

        <div className="bg-gray-50 p-8 md:p-12">
          {/* Alert cho tài khoản bị ban */}
          {state && !state.success && state.message.includes("vô hiệu hóa") && (
            <div className="mb-6 p-4 border-l-4 border-red-500 bg-red-50 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">🚫</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Tài khoản đã bị vô hiệu hóa
                  </h3>
                  <div className="mt-1 text-sm text-red-700">
                    <p>{state.message.replace("⚠️ ", "")}</p>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs text-red-600">
                      📧 Liên hệ admin qua email: admin@madala.com để được hỗ
                      trợ
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <h2 className="text-lg font-semibold mb-2">KHÁCH HÀNG ĐĂNG NHẬP</h2>
          <p className="text-gray-600 text-sm mb-8">
            Nếu bạn có một tài khoản, xin vui lòng đăng nhập.
          </p>

          <form action={dispatch} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Địa chỉ email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                required
              />
              {state?.errors?.email && (
                <p className="text-sm text-red-500">{state.errors.email[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input id="password" name="password" type="password" required />
              {state?.errors?.password && (
                <p className="text-sm text-red-500">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="link" asChild className="p-0 h-auto">
                <Link href="#">Quên Mật khẩu?</Link>
              </Button>
              <SubmitButton content="Đăng nhập" className="w-40" />
            </div>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-50 px-2 text-muted-foreground">
                Hoặc tiếp tục với
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin("google")}
            >
              <ChromeIcon className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin("github")}
            >
              <GithubIcon className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
