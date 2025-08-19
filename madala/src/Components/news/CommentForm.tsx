'use client';

import React, { useCallback } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

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

export const CommentForm = ({ formData, onFormChange, onSubmit, isSubmitting = false }: CommentFormProps) => {
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFormChange('name', e.target.value);
  }, [onFormChange]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFormChange('email', e.target.value);
  }, [onFormChange]);

  const handleCommentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onFormChange('comment', e.target.value);
  }, [onFormChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đóng góp ý kiến của bạn</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Tên của bạn *</label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                required
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email *</label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleEmailChange}
                required
                placeholder="email@example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">Ý kiến *</label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={handleCommentChange}
              required
              rows={5}
              placeholder="Để lại bình luận của bạn tại đây..."
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang gửi...' : 'Gửi ý kiến'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default React.memo(CommentForm);
