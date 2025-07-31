import CartItemsList from "./components/CartItemsList";
import OrderSummary from "./components/OrderSummary";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const mockUserAddress = {
  name: "Nguyễn Văn A",
  phone: "0918651345",
  location:
    "Nhà, số 25, ngõ Tân Lập, thôn Thượng Trì, Xã Đan Phượng, Huyện Đan Phượng, Hà Nội",
};

export default async function CartPage() {
  const userAddress = mockUserAddress;
  const session = await auth();
  if (!session?.user) {
    redirect("/login?error=CartAuthRequired");
  }

  return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">GIỎ HÀNG</h1>
          <div className="flex flex-col lg:flex-row gap-8">
            <CartItemsList />
            <OrderSummary address={userAddress} />
          </div>
        </div>
      </div>
  );
}
