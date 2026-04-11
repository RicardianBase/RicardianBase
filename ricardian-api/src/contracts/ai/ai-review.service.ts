import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText, Output } from 'ai';
import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';
import { AiReviewResponse } from '../dto/ai-review.dto';

const SYSTEM_PROMPT = `You are a senior contract lawyer reviewing a freelance / services contract that will be executed on-chain as a Ricardian contract with USDC escrow on Base.

Your job: read the contract text and emit a structured review.

Focus on:
- Missing or ambiguous payment / milestone terms
- Missing termination, kill-fee, and IP ownership clauses
- Unfavorable or one-sided language
- Regulatory or KYC red flags
- Vague deliverables or acceptance criteria
- Mismatch between the legal prose and the on-chain milestone structure

Rules:
- Return AT MOST 8 flags, most severe first.
- Be specific and actionable; do not hedge.
- If the contract is solid, return an empty flags array and overall_risk = "low".`;

const reviewSchema = z.object({
  summary: z
    .string()
    .describe('One paragraph plain-english summary of what the contract does'),
  overall_risk: z
    .enum(['low', 'medium', 'high'])
    .describe('Overall risk rating for the party reviewing the contract'),
  flags: z
    .array(
      z.object({
        severity: z.enum(['info', 'warning', 'critical']),
        clause: z
          .string()
          .max(120)
          .describe('Short name or quote of the clause (<= 80 chars preferred)'),
        issue: z
          .string()
          .describe('What is wrong or missing (1-2 sentences)'),
        suggestion: z
          .string()
          .describe('Concrete replacement or fix (1-2 sentences)'),
      }),
    )
    .max(8),
});

@Injectable()
export class AiReviewService {
  private readonly logger = new Logger(AiReviewService.name);
  private readonly model: ReturnType<
    ReturnType<typeof createAnthropic>
  > | null;
  private readonly modelId: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('ai.anthropicApiKey') || '';
    this.modelId =
      this.config.get<string>('ai.anthropicModel') || 'claude-opus-4-6';
    this.model = apiKey
      ? createAnthropic({ apiKey })(this.modelId)
      : null;
  }

  isEnabled(): boolean {
    return this.model !== null;
  }

  async review(text: string, title?: string): Promise<AiReviewResponse> {
    if (!this.model) {
      throw new ServiceUnavailableException(
        'AI contract review is not configured on this deployment',
      );
    }

    const userMessage = title
      ? `Contract title: ${title}\n\nContract text:\n\n${text}`
      : `Contract text:\n\n${text}`;

    try {
      const { output } = await generateText({
        model: this.model,
        system: SYSTEM_PROMPT,
        prompt: userMessage,
        output: Output.object({ schema: reviewSchema }),
        maxRetries: 1,
      });

      return { ...output, model: this.modelId };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`AI review failed: ${message}`);
      throw new InternalServerErrorException(
        'Failed to generate AI contract review',
      );
    }
  }
}
