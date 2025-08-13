import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogFormData } from "@/types/blog";

interface BlogContentEditorProps {
  content: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function BlogContentEditor({
  content,
  onChange,
}: BlogContentEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nội dung bài viết</CardTitle>
      </CardHeader>
      <CardContent>
        <textarea
          placeholder="Viết nội dung bài viết ở đây..."
          value={content}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={15}
        />
      </CardContent>
    </Card>
  );
}
