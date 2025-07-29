import CartItemsList from "./components/CartItemsList";
import OrderSummary from "./components/OrderSummary";
import { CartProduct } from "./components/CartItem";
import { CartProvider } from "./context/CartContext";

const mockUserAddress = {
  name: "Nguyễn Văn A",
  phone: "0918651345",
  location:
    "Nhà, số 25, ngõ Tân Lập, thôn Thượng Trì, Xã Đan Phượng, Huyện Đan Phượng, Hà Nội",
};

export default async function CartPage() {
  const userAddress = mockUserAddress;

  return (
    <CartProvider>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">GIỎ HÀNG</h1>
          <div className="flex flex-col lg:flex-row gap-8">
            <CartItemsList/>
            <OrderSummary address={userAddress} />
          </div>
        </div>
      </div>
    </CartProvider>
  );
}
