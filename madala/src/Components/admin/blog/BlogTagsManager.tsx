import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";

interface BlogTagsManagerProps {
    tags: string[];
    onTagsChange: (tags: string[]) => void;
}

export default function BlogTagsManager({ tags, onTagsChange }: BlogTagsManagerProps) {
    const [tagInput, setTagInput] = useState('');

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim().toLowerCase();
            if (!tags.includes(newTag)) {
                onTagsChange([...tags, newTag]);
            }
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        onTagsChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input
                    placeholder="Nhập tag và nhấn Enter..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                />
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => handleRemoveTag(tag)}
                        >
                            {tag} ×
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}