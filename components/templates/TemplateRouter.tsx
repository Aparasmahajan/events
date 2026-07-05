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
import { MoonlitTemplate } from "./moonlit";
import { OceanpalaceTemplate } from "./oceanpalace";
import { GardenTemplate } from "./garden";
import { CarnivalTemplate } from "./carnival";
import { GenesisTemplate } from "./genesis";
import { LibraryTemplate } from "./library";
import { SkytempleTemplate } from "./skytemple";
import { SymphonyTemplate } from "./symphony";
import { InfinityTemplate } from "./infinity";
import { LovestarsTemplate } from "./lovestars";
import { HorizonTemplate } from "./horizon";
import { ToyboxTemplate } from "./toybox";
import { TimemachineTemplate } from "./timemachine";
import { DreamfactoryTemplate } from "./dreamfactory";
import { QuantumTemplate } from "./quantum";
import { ImmortalsTemplate } from "./immortals";
import { EcosystemTemplate } from "./ecosystem";
import { InfinityclubTemplate } from "./infinityclub";
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
    // Templates below have metadata + demo bundles + preview entries, but no
    // dedicated component yet — they fall back to the closest existing template
    // (chosen so palette + event-type story feel right) until the real one
    // ships. Update these cases as components land.
    case "moonlit":
      return <MoonlitTemplate {...rest} />;
    case "oceanpalace":
      return <OceanpalaceTemplate {...rest} />;
    case "garden":
      return <GardenTemplate {...rest} />;
    case "carnival":
      return <CarnivalTemplate {...rest} />;
    case "genesis":
      return <GenesisTemplate {...rest} />;
    case "library":
      return <LibraryTemplate {...rest} />;
    case "skytemple":
      return <SkytempleTemplate {...rest} />;
    case "symphony":
      return <SymphonyTemplate {...rest} />;
    case "infinity":
      return <InfinityTemplate {...rest} />;
    case "lovestars":
      return <LovestarsTemplate {...rest} />;
    case "horizon":
      return <HorizonTemplate {...rest} />;
    case "toybox":
      return <ToyboxTemplate {...rest} />;
    case "timemachine":
      return <TimemachineTemplate {...rest} />;
    case "dreamfactory":
      return <DreamfactoryTemplate {...rest} />;
    case "quantum":
      return <QuantumTemplate {...rest} />;
    case "immortals":
      return <ImmortalsTemplate {...rest} />;
    case "ecosystem":
      return <EcosystemTemplate {...rest} />;
    case "infinityclub":
      return <InfinityclubTemplate {...rest} />;
    case "royal":
    default:
      return <RoyalTemplate {...rest} />;
  }
}
