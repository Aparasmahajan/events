"use client";

import { RoyalTemplate } from "./royal";
import { MinimalTemplate } from "./minimal";
import { ModernTemplate } from "./modern";
import { VibrantTemplate } from "./vibrant";
import { PastelTemplate } from "./pastel";
import { AuroraTemplate } from "./aurora";
import { ObsidianTemplate } from "./obsidian";
import { CelestiaTemplate } from "./celestia";
import { NexusTemplate } from "./nexus";
import { PinnacleTemplate } from "./pinnacle";
import { LuminaryTemplate } from "./luminary";
import { ConvergeTemplate } from "./converge";
import { AfterTemplate } from "./after";
import { EmpyreanTemplate } from "./empyrean";
import { PrismTemplate } from "./prism";
import { OrbitTemplate } from "./orbit";
import { ArcadeTemplate } from "./arcade";
import { PromiseTemplate } from "./promise";
import { ChaptersTemplate } from "./chapters";
import { NeuralTemplate } from "./neural";
import { UnveilTemplate } from "./unveil";
import { OdeonTemplate } from "./odeon";
import { ConstellaTemplate } from "./constella";
import { MetropolisTemplate } from "./metropolis";
import type { TemplateProps } from "@/lib/types";

type Props = TemplateProps & { templateId: string };

export function TemplateRouter({ templateId, ...rest }: Props) {
  switch (templateId) {
    case "empyrean":
      return <EmpyreanTemplate {...rest} />;
    case "prism":
      return <PrismTemplate {...rest} />;
    case "orbit":
      return <OrbitTemplate {...rest} />;
    case "arcade":
      return <ArcadeTemplate {...rest} />;
    case "promise":
      return <PromiseTemplate {...rest} />;
    case "chapters":
      return <ChaptersTemplate {...rest} />;
    case "neural":
      return <NeuralTemplate {...rest} />;
    case "unveil":
      return <UnveilTemplate {...rest} />;
    case "odeon":
      return <OdeonTemplate {...rest} />;
    case "constella":
      return <ConstellaTemplate {...rest} />;
    case "metropolis":
      return <MetropolisTemplate {...rest} />;
    case "nexus":
      return <NexusTemplate {...rest} />;
    case "pinnacle":
      return <PinnacleTemplate {...rest} />;
    case "luminary":
      return <LuminaryTemplate {...rest} />;
    case "converge":
      return <ConvergeTemplate {...rest} />;
    case "after":
      return <AfterTemplate {...rest} />;
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
