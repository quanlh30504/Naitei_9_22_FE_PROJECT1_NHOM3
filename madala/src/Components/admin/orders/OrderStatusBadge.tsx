import React from "react";
import { Badge } from "@/Components/ui/badge";
import { OrderStatus } from "@/models/Order";

interface OrderStatusBadgeProps {
    status: OrderStatus;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
    switch (status) {
        case "pending":
            return <Badge variant="secondary">Chờ thanh toán</Badge>;
        case "processing":
            return <Badge className="bg-blue-100 text-blue-800">Đang xử lý</Badge>;
        case "shipped":
            return <Badge className="bg-yellow-100 text-yellow-800">Đang vận chuyển</Badge>;
        case "delivered":
            return <Badge className="bg-green-100 text-green-800">Đã giao</Badge>;
        case "cancelled":
            return <Badge variant="destructive">Đã hủy</Badge>;
        default:
            return <Badge>{status}</Badge>;
    }
};

export default OrderStatusBadge;
