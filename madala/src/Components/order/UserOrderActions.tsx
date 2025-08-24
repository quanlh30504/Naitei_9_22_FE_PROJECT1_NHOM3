"use client";

import { useTransition } from "react";
import { IOrder } from "@/models/Order";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { confirmDelivery } from "@/lib/actions/order";
import CancelOrderDialog from './CancelOrderDialog';

interface UserOrderActionsProps {
  order: IOrder;
  onOrderUpdate: (updatedOrder: IOrder) => void;
}

export default function UserOrderActions({
  order,
  onOrderUpdate,
}: UserOrderActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleAction = (action: Function) => {
    startTransition(async () => {
      const result = await action(order._id.toString());
      if (result.success && result.data) {
        toast.success(result.message);
        onOrderUpdate(result.data);
      } else {
        toast.error(result.message);
      }
    });
  };


  // Button cho hành động chính (có màu nền)
  const PrimaryButton = ({
    children,
    ...props
  }: React.ComponentProps<typeof Button>) => (
    <Button className="w-full justify-center" {...props}>
      {children}
    </Button>
  );

  const SecondaryButton = ({
    children,
    ...props
  }: React.ComponentProps<typeof Button>) => (
    <Button variant="outline" className="w-full justify-center" {...props}>
      {children}
    </Button>
  );

  const renderActions = () => {
    const actionListClasses =
      "flex flex-col gap-3 w-full sm:w-auto sm:min-w-[200px]";

    switch (order.status) {
      case "pending":
        return (
          <div className={actionListClasses}>
            <CancelOrderDialog order={order} onOrderUpdate={onOrderUpdate} />
            <SecondaryButton asChild>
              <Link href="/lien-he">Liên hệ Người bán</Link>
            </SecondaryButton>
          </div>
        );

      case "shipped":
        return (
          <div className={actionListClasses}>
            <PrimaryButton asChild>
              <Link href={`/tracking?code=${order.shipping.trackingNumber}`}>
                Theo dõi đơn hàng
              </Link>
            </PrimaryButton>
            <SecondaryButton asChild>
              <Link href="/lien-he">Liên hệ Người bán</Link>
            </SecondaryButton>
          </div>
        );

      case "delivered":
        return (
          <div className={actionListClasses}>
            <PrimaryButton
              onClick={() => handleAction(confirmDelivery)}
              disabled={isPending}
            >
              Đã nhận được hàng
            </PrimaryButton>
            <SecondaryButton>Yêu cầu Trả hàng/Hoàn tiền</SecondaryButton>
            <SecondaryButton>Đánh giá sản phẩm</SecondaryButton>
          </div>
        );
      case "completed":
      case "cancelled":
      case "returned":
        return (
          <div className={actionListClasses}>
            <PrimaryButton>Mua lại</PrimaryButton>
            {order.status === "completed" && (
              <SecondaryButton>Đánh giá</SecondaryButton>
            )}
          </div>
        );
      default: 
        return (
          <div className={actionListClasses}>
            <PrimaryButton asChild>
              <Link href="/lien-he">Liên hệ Người bán</Link>
            </PrimaryButton>
          </div>
        );
    }
  };

  return (
    <Card className="mt-6 bg-transparent border-none shadow-none">
      <CardContent className="p-0 flex justify-end">
        {renderActions()}
      </CardContent>
    </Card>
  );
}
