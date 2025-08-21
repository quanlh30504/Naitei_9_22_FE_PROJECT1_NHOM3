"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validations/forms";
import { z } from "zod";
import { toast } from "react-hot-toast";
import Link from "next/link";
import SubmitButton from "@/Components/Buttons/SubmitButton";
import ActionButton from "@/Components/Buttons/ActionButton";
import { Input } from "@/Components/ui/input";
import { FormLabel } from "@/Components/FormLabel";
import { signIn } from "next-auth/react";
import SocialLoginButtons from "@/Components/Auth/SocialLoginButtons";
import { motion } from "framer-motion";

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const sectionVariants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 }
  }
};

const fieldVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

const buttonVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 }
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.95 }
};

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
    <motion.main
      className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="container mx-auto px-4 py-10 md:py-16 max-w-4xl"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.h1
          className="text-xl md:text-2xl font-semibold tracking-widest uppercase mb-10"
          variants={sectionVariants}
        >
          Tạo tài khoản
        </motion.h1>
        <motion.div
          className="bg-gray-50 p-8 md:p-12"
          variants={sectionVariants}
        >
          <motion.form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={sectionVariants}>
              <motion.h2
                className="text-lg font-semibold mb-6 uppercase"
                variants={fieldVariants}
              >
                Thông tin cá nhân
              </motion.h2>
              <div className="space-y-4">
                <motion.div className="space-y-2" variants={fieldVariants}>
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
                </motion.div>
                <motion.div className="space-y-2" variants={fieldVariants}>
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
                </motion.div>
                <motion.div className="space-y-2" variants={fieldVariants}>
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
                </motion.div>
              </div>
            </motion.div>
            <motion.div variants={sectionVariants}>
              <motion.h2
                className="text-lg font-semibold mb-6 uppercase"
                variants={fieldVariants}
              >
                Thông tin đăng nhập
              </motion.h2>
              <div className="space-y-4">
                <motion.div className="space-y-2" variants={fieldVariants}>
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
                </motion.div>
                <motion.div className="space-y-2" variants={fieldVariants}>
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
                </motion.div>
                <motion.div className="space-y-2" variants={fieldVariants}>
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
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              className="flex items-center justify-between pt-4 gap-4"
              variants={fieldVariants}
            >
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <SubmitButton content="Đăng ký" className="w-40" />
              </motion.div>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <ActionButton variant="destructive">
                  <Link href="/login">Quay lại</Link>
                </ActionButton>
              </motion.div>
            </motion.div>
          </motion.form>
          <motion.div variants={sectionVariants}>
            <SocialLoginButtons />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.main>
  );
}
