'use client'

import { memo } from "react"
import { Badge } from "@/Components/ui/badge"
import { Product } from "@/types/product"

interface StatusBadgeProps {
  product: Product
}

function StatusBadge({ product }: StatusBadgeProps) {
  if (!product.isActive) {
    return <Badge variant="destructive">Vô hiệu hóa</Badge>
  }
  if (product.stock === 0) {
    return <Badge variant="secondary">Hết hàng</Badge>
  }
  return <Badge variant="default">Hoạt động</Badge>
}

export const MemoizedStatusBadge = memo(StatusBadge);
export { MemoizedStatusBadge as StatusBadge };
