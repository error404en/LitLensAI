import * as React from "react";
import { PDFAnnotation } from "../../lib/types/pdf";
import { PDFNoteCard } from "./PDFNoteCard";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { usePDFAnnotations } from "../../hooks/usePDFAnnotations";
import { usePDFNavigation } from "../../hooks/usePDFNavigation";

export function PDFAnnotationPanel() {
  const { annotations, addAnnotation, editAnnotation, deleteAnnotation } = usePDFAnnotations();
  const { currentPage } = usePDFNavigation();
  const [isAdding, setIsAdding] = React.useState(false);
  const [newNote, setNewNote] = React.useState("");

  const handleAdd = async () => {
    if (!newNote.trim()) return;
    await addAnnotation(currentPage, newNote.trim());
    setNewNote("");
    setIsAdding(false);
  };

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">Notes ({annotations.length})</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsAdding(true)} className="text-xs">
          <Plus className="mr-1 h-3 w-3" /> Add Note
        </Button>
      </div>

      {isAdding && (
        <div className="space-y-2 p-3 border rounded-md bg-muted/20">
          <textarea
            value={newNote}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewNote(e.target.value)}
            placeholder="Write a note for this page..."
            className="w-full min-h-[80px] text-sm p-2 border rounded-md bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setIsAdding(false); setNewNote(""); }}>Cancel</Button>
            <Button size="sm" onClick={handleAdd} disabled={!newNote.trim()}>Save Note</Button>
          </div>
        </div>
      )}

      {annotations.length === 0 && !isAdding ? (
        <p className="text-xs text-muted-foreground text-center py-8">No notes yet. Click above to add one.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {annotations.map((a) => (
            <PDFNoteCard key={a.id} annotation={a} onEdit={editAnnotation} onDelete={deleteAnnotation} />
          ))}
        </div>
      )}
    </div>
  );
}
