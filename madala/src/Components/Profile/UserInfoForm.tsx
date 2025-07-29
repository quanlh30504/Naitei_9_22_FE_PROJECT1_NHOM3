"use client";

import { useFormState } from "react-dom";
import type { IUser } from "@/models/User";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import SubmitButton from "@/Components/Buttons/SubmitButton";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { updateProfile } from "@/lib/actions/user";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { countries } from "@/lib/data";

// --- shadcn ui ---
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

interface UserInfoFormProps {
  user: IUser;
}

const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - 1899 },
  (_, i) => currentYear - i
);
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

export default function UserInfoForm({ user }: UserInfoFormProps) {
  const { data: session, update } = useSession();

  const router = useRouter();
  const [state, dispatch] = useFormState(updateProfile, undefined);

  const birthDate = user.birthDate ? new Date(user.birthDate) : null;
  const defaultDay = birthDate ? birthDate.getDate() : undefined;
  const defaultMonth = birthDate ? birthDate.getMonth() + 1 : undefined;
  const defaultYear = birthDate ? birthDate.getFullYear() : undefined;

  const [selectedDay, setSelectedDay] = useState(defaultDay || "");
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth || "");
  const [selectedYear, setSelectedYear] = useState(defaultYear || "");
  const [selectedCountry, setSelectedCountry] = useState(user.country || "");

  useEffect(() => {
    setSelectedDay(defaultDay || "");
    setSelectedMonth(defaultMonth || "");
    setSelectedYear(defaultYear || "");
    setSelectedCountry(user.country || "");
  }, [defaultDay, defaultMonth, defaultYear, user.country]);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      console.log("session: " + session?.user);
      router.refresh();
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form action={dispatch} className="space-y-8">
      {/* --- Phần thông tin cá nhân --- */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={user.image || ""}
            alt={user.name || "User Avatar"}
          />
          <AvatarFallback className="bg-blue-100">
            <User className="w-12 h-12 text-blue-500" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow space-y-4 w-full">
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ & Tên</Label>
            <Input
              id="fullName"
              name="fullName"
              defaultValue={user.name || ""}
              required
              placeholder="Nhập họ và tên của bạn"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              name="nickname"
              defaultValue={user.nickname || ""}
              placeholder="Thêm nickname (tùy chọn)"
            />
          </div>
        </div>
      </div>

      {/* --- Ngày sinh --- */}
      <div className="space-y-2">
        <Label>Ngày sinh</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex w-full justify-center sm:w-1/4">
            <Select
              name="day"
              value={selectedDay.toString()}
              onValueChange={setSelectedDay}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ngày" />
              </SelectTrigger>
              <SelectContent>
                {days.map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-1/4">
            <Select
              name="month"
              value={selectedMonth.toString()}
              onValueChange={setSelectedMonth}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tháng" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem
                    key={month}
                    value={month.toString()}
                  >{`Tháng ${month}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-1/4">
            <Select
              name="year"
              value={selectedYear.toString()}
              onValueChange={setSelectedYear}
            >
              <SelectTrigger>
                <SelectValue placeholder="Năm" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* --- Giới tính --- */}
      <div className="space-y-2">
        <Label>Giới tính</Label>
        <RadioGroup
          name="gender"
          defaultValue={user.gender}
          className="flex items-center gap-6 pt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">Nam</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Nữ</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other">Khác</Label>
          </div>
        </RadioGroup>
      </div>

      {/* --- Quốc tịch --- */}
      <div className="space-y-2">
        <Label htmlFor="country">Quốc tịch</Label>
        <Select
          id="country"
          name="country"
          value={selectedCountry}
          onValueChange={setSelectedCountry}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn quốc tịch" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4">
        <SubmitButton content="Lưu thay đổi" />
      </div>
    </form>
  );
}
