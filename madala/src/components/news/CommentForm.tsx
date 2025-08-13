"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CommentFormData {
  name: string;
  email: string;
  comment: string;
}

interface CommentFormProps {
  formData: CommentFormData;
  onFormChange: (field: keyof CommentFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

export const CommentForm = ({
  formData,
  onFormChange,
  onSubmit,
  isSubmitting = false,
}: CommentFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Đóng góp ý kiến của bạn</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Tên của bạn *
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => onFormChange("name", e.target.value)}
                required
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email *
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => onFormChange("email", e.target.value)}
                required
                placeholder="email@example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Ý kiến *
            </label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => onFormChange("comment", e.target.value)}
              required
              rows={5}
              placeholder="Để lại bình luận của bạn tại đây..."
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang gửi..." : "Gửi ý kiến"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
