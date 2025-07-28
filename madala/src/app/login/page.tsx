"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { authenticateCredentials } from "@/lib/actions";

import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import SubmitButton from "@/Components/Buttons/SubmitButton";
import ActionButton from "@/Components/Buttons/ActionButton";

export default function LoginPage() {
  const router = useRouter();

  const [state, dispatch] = useFormState(authenticateCredentials, undefined);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      
      window.dispatchEvent(new CustomEvent('loginSuccess'));
      
      router.push("/");
    }
    
    if (state && !state.success && !state.errors) {
      toast.error(state.message);
    }
  }, [state, router]);

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
                <p className="text-sm text-red-500">
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
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
              <SubmitButton content="Đăng nhập" className="w-40"/>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
