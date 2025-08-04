import OrderTabs from "@/Components/order/OrderTabs";
import OrderList from "@/Components/order/OrderList";
import { Input } from "@/Components/ui/input";
import { Search } from "lucide-react";

export default function MyOrdersPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Đơn hàng của tôi</h1>
            
            <OrderTabs />

            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input placeholder="Tìm đơn hàng..." className="pl-10" />
            </div>

            <OrderList />
        </div>
    );
}
