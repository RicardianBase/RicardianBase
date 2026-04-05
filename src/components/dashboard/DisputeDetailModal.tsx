import { useState } from "react";
import { X, Loader2, Paperclip } from "lucide-react";
import type { Dispute } from "@/types/api";
import { useDisputeEvidence, useAddEvidence } from "@/hooks/api/useDisputes";

interface Props {
  dispute: Dispute | null;
  onClose: () => void;
}

const statusLabels: Record<string, string> = {
  under_review: "Under Review",
  evidence_required: "Evidence Required",
  resolved: "Resolved",
  escalated: "Escalated",
};

const DisputeDetailModal = ({ dispute, onClose }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const { data: evidence, isLoading } = useDisputeEvidence(dispute?.id ?? null);
  const addEvidenceMutation = useAddEvidence(dispute?.id ?? "");

  if (!dispute) return null;

  const handleSubmit = async () => {
    if (!content.trim()) return;
    await addEvidenceMutation.mutateAsync({
      content: content.trim(),
      attachment_url: attachmentUrl.trim() || undefined,
    });
    setContent("");
    setAttachmentUrl("");
    setShowForm(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[hsl(230,20%,94%)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium bg-[hsl(340,40%,94%)] text-[hsl(340,60%,40%)] px-2.5 py-1 rounded-full">
                {statusLabels[dispute.status] ?? dispute.status}
              </span>
            </div>
            <h2 className="text-lg font-medium text-foreground">{dispute.title}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {dispute.description && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Description</p>
              <p className="text-sm text-foreground">{dispute.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Amount Locked</p>
              <p className="text-xl font-semibold text-foreground">
                ${dispute.amount_locked ? parseFloat(dispute.amount_locked).toLocaleString("en-US", { minimumFractionDigits: 0 }) : "0"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Opened</p>
              <p className="text-sm text-foreground">{new Date(dispute.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Evidence Timeline</p>
              {dispute.status !== "resolved" && (
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                >
                  {showForm ? "Cancel" : "+ Add Evidence"}
                </button>
              )}
            </div>

            {showForm && (
              <div className="bg-[hsl(230,25%,97%)] rounded-xl p-4 space-y-3 mb-4">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe the evidence you're submitting..."
                  rows={3}
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
                />
                <input
                  type="text"
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                  placeholder="Attachment URL (optional)"
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
                <button
                  onClick={handleSubmit}
                  disabled={addEvidenceMutation.isPending || !content.trim()}
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600 transition-colors disabled:opacity-50"
                >
                  {addEvidenceMutation.isPending ? <><Loader2 size={12} className="animate-spin" /> Submitting...</> : "Submit"}
                </button>
              </div>
            )}

            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading evidence...</p>
            ) : !evidence?.length ? (
              <p className="text-sm text-muted-foreground text-center py-6">No evidence submitted yet</p>
            ) : (
              <div className="space-y-3">
                {evidence.map((e) => (
                  <div key={e.id} className="border border-[hsl(230,20%,94%)] rounded-xl p-4">
                    <p className="text-sm text-foreground whitespace-pre-wrap">{e.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{new Date(e.created_at).toLocaleString()}</span>
                      {e.attachment_url && (
                        <a
                          href={e.attachment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700"
                        >
                          <Paperclip size={10} /> Attachment
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeDetailModal;
