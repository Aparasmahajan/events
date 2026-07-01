"use client";

import { RoyalTemplate } from "./royal";
import { MinimalTemplate } from "./minimal";
import { ModernTemplate } from "./modern";
import { VibrantTemplate } from "./vibrant";
import { PastelTemplate } from "./pastel";
import { AuroraTemplate } from "./aurora";
import { ObsidianTemplate } from "./obsidian";
import { CelestiaTemplate } from "./celestia";
import type { TemplateProps } from "@/lib/types";

type Props = TemplateProps & { templateId: string };

export function TemplateRouter({ templateId, ...rest }: Props) {
  switch (templateId) {
    case "minimal":
      return <MinimalTemplate {...rest} />;
    case "modern":
      return <ModernTemplate {...rest} />;
    case "vibrant":
      return <VibrantTemplate {...rest} />;
    case "pastel":
      return <PastelTemplate {...rest} />;
    case "aurora":
      return <AuroraTemplate {...rest} />;
    case "obsidian":
      return <ObsidianTemplate {...rest} />;
    case "celestia":
      return <CelestiaTemplate {...rest} />;
    case "royal":
    default:
      return <RoyalTemplate {...rest} />;
  }
}
