import * as React from "react";
import { PDFAnnotation } from "../../lib/types/pdf";
import { Button } from "../ui/button";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { formatDate } from "../../lib/utils";

interface PDFNoteCardProps {
  annotation: PDFAnnotation;
  onEdit?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
}

export function PDFNoteCard({ annotation, onEdit, onDelete }: PDFNoteCardProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editContent, setEditContent] = React.useState(annotation.content);

  const handleSave = () => {
    if (editContent.trim()) {
      onEdit?.(annotation.id, editContent.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="p-3 rounded-md border bg-card group transition-all hover:shadow-sm">
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editContent}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditContent(e.target.value)}
            className="w-full min-h-[80px] text-sm p-2 border rounded-md bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            autoFocus
          />
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)} className="h-7 w-7"><X className="h-3.5 w-3.5" /></Button>
            <Button variant="default" size="icon" onClick={handleSave} className="h-7 w-7"><Check className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm whitespace-pre-wrap">{annotation.content}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">Page {annotation.page} • {formatDate(annotation.updatedAt)}</span>
            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsEditing(true)}><Pencil className="h-3 w-3" /></Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-destructive" onClick={() => onDelete?.(annotation.id)}><Trash2 className="h-3 w-3" /></Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
