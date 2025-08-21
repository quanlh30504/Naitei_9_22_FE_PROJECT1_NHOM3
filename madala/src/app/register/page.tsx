"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validations/forms";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import SubmitButton from "@/Components/Buttons/SubmitButton";
import ActionButton from "@/Components/Buttons/ActionButton";
import { Input } from "@/Components/ui/input";
import { FormLabel } from "@/Components/FormLabel";
import { signIn } from "next-auth/react";
import SocialLoginButtons from "@/Components/Auth/SocialLoginButtons";

export default function RegisterPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    // TODO: Gọi API đăng ký ở đây, ví dụ registerUser(data)
    toast.success("Đăng ký thành công!");
    router.push("/login");
  };

  return (
    <main className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-10 md:py-16 max-w-4xl">
        <h1 className="text-xl md:text-2xl font-semibold tracking-widest uppercase mb-10">
          Tạo tài khoản
        </h1>
        <div className="bg-gray-50 p-8 md:p-12">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold mb-6 uppercase">Thông tin cá nhân</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <FormLabel htmlFor="firstName" required>
                    Tên trước
                  </FormLabel>
                  <Input
                    id="firstName"
                    {...form.register("firstName")}
                    type="text"
                    placeholder="Nhập tên của bạn"
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="lastName" required>
                    Tên sau
                  </FormLabel>
                  <Input
                    id="lastName"
                    {...form.register("lastName")}
                    type="text"
                    placeholder="Nhập họ của bạn"
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="phone" required>
                    Số điện thoại
                  </FormLabel>
                  <Input
                    id="phone"
                    {...form.register("phone")}
                    type="tel"
                    placeholder="Nhập số điện thoại"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-6 uppercase">Thông tin đăng nhập</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <FormLabel htmlFor="email" required>
                    Email
                  </FormLabel>
                  <Input
                    id="email"
                    {...form.register("email")}
                    type="email"
                    placeholder="email@example.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="password" required>
                    Mật khẩu
                  </FormLabel>
                  <Input
                    id="password"
                    {...form.register("password")}
                    type="password"
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="confirmPassword" required>
                    Xác nhận mật khẩu
                  </FormLabel>
                  <Input
                    id="confirmPassword"
                    {...form.register("confirmPassword")}
                    type="password"
                  />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 gap-4">
              <SubmitButton content="Đăng ký" className="w-40" />
              <ActionButton variant="destructive">
                <Link href="/login">Quay lại</Link>
              </ActionButton>
            </div>
          </form>
          <SocialLoginButtons />
        </div>
      </div>
    </main>
  );
}
