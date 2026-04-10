import { jsPDF } from "jspdf";

export interface ContractPdfMilestone {
  title: string;
  amount: number;
}

export interface ContractPdfInput {
  title: string;
  effectiveDate?: string;
  clientLabel: string;
  contractorLabel: string;
  bodyText: string;
  milestones: ContractPdfMilestone[];
  totalAmount: number;
  currency: string;
  generatedAt?: Date;
}

function formatDate(value?: string): string {
  if (!value) return "Not specified";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatMoney(amount: number, currency: string): string {
  return `${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

function sanitizeFileName(title: string): string {
  const normalized = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "ricardian-contract";
}

export function buildContractPdfFilename(title: string): string {
  return `${sanitizeFileName(title)}.pdf`;
}

export function downloadContractPdf(input: ContractPdfInput): void {
  const doc = new jsPDF({
    unit: "pt",
    format: "letter",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 54;
  const marginTop = 56;
  const contentWidth = pageWidth - marginX * 2;
  let y = marginTop;

  const ensureRoom = (requiredHeight = 18) => {
    if (y + requiredHeight <= pageHeight - 56) {
      return;
    }

    doc.addPage();
    y = marginTop;
  };

  const drawWrappedText = (
    text: string,
    fontSize: number,
    lineHeight: number,
    options?: { bold?: boolean; color?: [number, number, number] },
  ) => {
    ensureRoom(lineHeight);
    doc.setFont("helvetica", options?.bold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    if (options?.color) {
      doc.setTextColor(...options.color);
    } else {
      doc.setTextColor(28, 28, 28);
    }
    const lines = doc.splitTextToSize(text, contentWidth);
    const blockHeight = lines.length * lineHeight;
    ensureRoom(blockHeight);
    doc.text(lines, marginX, y);
    y += blockHeight;
  };

  const addGap = (height: number) => {
    y += height;
  };

  drawWrappedText(input.title, 20, 24, { bold: true });
  addGap(8);
  drawWrappedText(
    `Effective Date: ${formatDate(input.effectiveDate)}`,
    11,
    16,
    { color: [90, 90, 90] },
  );
  drawWrappedText(`Client: ${input.clientLabel}`, 11, 16, {
    color: [90, 90, 90],
  });
  drawWrappedText(`Contractor: ${input.contractorLabel}`, 11, 16, {
    color: [90, 90, 90],
  });

  addGap(14);
  doc.setDrawColor(220, 224, 230);
  doc.line(marginX, y, pageWidth - marginX, y);
  addGap(20);

  drawWrappedText(input.bodyText, 11, 17);
  addGap(16);

  drawWrappedText("Milestone Schedule", 13, 18, { bold: true });
  addGap(6);
  if (input.milestones.length === 0) {
    drawWrappedText("No milestone schedule provided.", 11, 16);
  } else {
    input.milestones.forEach((milestone, index) => {
      drawWrappedText(
        `${index + 1}. ${milestone.title} — ${formatMoney(
          milestone.amount,
          input.currency,
        )}`,
        11,
        16,
      );
    });
  }

  addGap(16);
  drawWrappedText(
    `Total Contract Value: ${formatMoney(input.totalAmount, input.currency)}`,
    12,
    18,
    { bold: true },
  );

  const generatedAt = (input.generatedAt ?? new Date()).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(110, 110, 110);
  doc.text(
    `Ricardian contract export • ${input.title} • Generated ${generatedAt}`,
    marginX,
    pageHeight - 28,
  );

  doc.save(buildContractPdfFilename(input.title));
}
