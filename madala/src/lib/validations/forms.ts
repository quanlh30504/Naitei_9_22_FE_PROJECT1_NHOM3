import { z } from "zod"

// Schema cho User Info Form
export const userInfoSchema = z.object({
    fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự").max(50, "Họ tên không được quá 50 ký tự"),
    nickname: z.string().max(30, "Nickname không được quá 30 ký tự").optional(),
    birthDate: z.date().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    country: z.string().optional(),
});

// Schema cho Address Form
export const addressSchema = z.object({
    fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
    phoneNumber: z.string().min(10, "Số điện thoại phải có ít nhất 10 số"),
    street: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
    city: z.string().min(2, "Tên thành phố phải có ít nhất 2 ký tự"),
    district: z.string().min(2, "Tên quận/huyện phải có ít nhất 2 ký tự"),
    ward: z.string().min(2, "Tên phường/xã phải có ít nhất 2 ký tự"),
    isDefault: z.boolean(),
})

// Schema cho Register Form
export const registerSchema = z.object({
    firstName: z.string().min(2, "Tên trước phải có ít nhất 2 ký tự"),
    lastName: z.string().min(2, "Tên sau phải có ít nhất 2 ký tự"),
    phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 số").max(11, "Số điện thoại không được quá 11 số").regex(/^\d+$/, "Số điện thoại chỉ được chứa số"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Mật khẩu xác nhận phải có ít nhất 6 ký tự"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

// Schema cho Contact Form (dynamic validate for email/phone)
export const contactSchema = z.object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    method: z.enum(["email", "phone", "zalo"]),
    contact: z.string(),
    message: z.string().min(10, "Tin nhắn phải có ít nhất 10 ký tự"),
}).superRefine((data, ctx) => {
    if (data.method === "email") {
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.contact)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["contact"],
                message: "Email không hợp lệ",
            });
        }
    } else {
        if (!/^\d{10,}$/.test(data.contact)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["contact"],
                message: "Số điện thoại phải có ít nhất 10 số",
            });
        }
    }
});

// Schema cho Subscribe Form
export const subscribeSchema = z.object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 số"),
    email: z.string().email("Email không hợp lệ"),
})

// Schema cho Comment Form
export const commentFormSchema = z.object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    comment: z.string().min(5, "Bình luận phải có ít nhất 5 ký tự"),
});

// Schema cho Blog Form
export const blogFormSchema = z.object({
    title: z.string().min(3, "Tiêu đề phải có ít nhất 3 ký tự"),
    slug: z.string().min(3, "Slug phải có ít nhất 3 ký tự"),
    content: z.string().min(10, "Nội dung phải có ít nhất 10 ký tự"),
    excerpt: z.string().optional(),
    featuredImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
});


// Export types
export type UserInfoFormData = z.infer<typeof userInfoSchema>
export type AddressFormData = z.infer<typeof addressSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ContactFormData = z.infer<typeof contactSchema>
export type SubscribeFormData = z.infer<typeof subscribeSchema>
export type CommentFormData = z.infer<typeof commentFormSchema>;
export type BlogFormData = z.infer<typeof blogFormSchema>;
