import { describe, expect, it } from "vitest";
import {
  getInitialTemplateValues,
  templateLibrary,
} from "@/lib/contractTemplates";

describe("contract template library", () => {
  it("renders each template with interpolated required values", () => {
    for (const template of templateLibrary) {
      const values = {
        ...getInitialTemplateValues(template.fields),
      };

      template.fields.forEach((field) => {
        if (!values[field.name]) {
          values[field.name] = `${field.label} value`;
        }
      });

      const rendered = template.renderLegalText(
        values,
        {
          contractTitle: `${template.title} Launch`,
          effectiveDate: "2026-04-10",
          endDate: "2026-12-31",
          clientLabel: "Acme Inc.",
          contractorLabel: "@builder",
          currency: "USDC",
          totalAmount: 5000,
          additionalContext: "Custom launch context",
        },
        [
          { title: "Milestone One", amount: 2500 },
          { title: "Milestone Two", amount: 2500 },
        ],
      );

      expect(rendered).toContain(`${template.title} Launch`);
      expect(rendered).toContain("Acme Inc.");
      expect(rendered).toContain("@builder");
      expect(rendered).toContain("Milestone One");
      expect(rendered).toContain("5,000.00 USDC");
      expect(rendered).toContain("Custom launch context");
    }
  });

  it("falls back cleanly when optional fields are blank", () => {
    const nda = templateLibrary.find((template) => template.slug === "nda");
    expect(nda).toBeDefined();

    const rendered = nda!.renderLegalText(
      {
        disclosingParty: "Mutual",
        confidentialPurpose: "evaluating a software deal",
        termMonths: "18",
        exclusions: "",
        governingLaw: "Ontario, Canada",
      },
      {
        contractTitle: "Mutual NDA",
        effectiveDate: "2026-04-10",
        clientLabel: "Client",
        contractorLabel: "Contractor",
        currency: "USDC",
        totalAmount: 0,
      },
      [{ title: "Agreement Execution", amount: 0 }],
    );

    expect(rendered).toContain("information that is public");
    expect(rendered).toContain("does not require an escrow funding event");
  });
});
