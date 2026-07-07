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
import { SkyrealmTemplate } from "./skyrealm";
import { CathedralTemplate } from "./cathedral";
import { SakuraTemplate } from "./sakura";
import { VersaillesTemplate } from "./versailles";
import { FrescoTemplate } from "./fresco";
import { MirageTemplate } from "./mirage";
import { IcepalaceTemplate } from "./icepalace";
import { GalaxyoperaTemplate } from "./galaxyopera";
import { TworiversTemplate } from "./tworivers";
import { MirrorworldsTemplate } from "./mirrorworlds";
import { InfinitytrainTemplate } from "./infinitytrain";
import { LanternsTemplate } from "./lanterns";
import { GlassroseTemplate } from "./glassrose";
import { SecretgalaxyTemplate } from "./secretgalaxy";
import { CartoonTemplate } from "./cartoon";
import { BricktownTemplate } from "./bricktown";
import { TreasureTemplate } from "./treasure";
import { ThemeparkTemplate } from "./themepark";
import { CandylandTemplate } from "./candyland";
import { RobocityTemplate } from "./robocity";
import { SpacemissionTemplate } from "./spacemission";
import { JungleTemplate } from "./jungle";
import { TimecapsuleTemplate } from "./timecapsule";
import { TreeoflifeTemplate } from "./treeoflife";
import { EndlessclockTemplate } from "./endlessclock";
import { DigitalcityTemplate } from "./digitalcity";
import { QuantumlabTemplate } from "./quantumlab";
import { MissioncontrolTemplate } from "./missioncontrol";
import { SecretlabTemplate } from "./secretlab";
import { PortalTemplate } from "./portal";
import { EvolutionTemplate } from "./evolution";
import { GoldenuniverseTemplate } from "./goldenuniverse";
import { HalloffameTemplate } from "./halloffame";
import { SynapseTemplate } from "./synapse";
import { FuturecityTemplate } from "./futurecity";
import { FestivalTemplate } from "./festival";
import { NeonjungleTemplate } from "./neonjungle";
import { MidnighttokyoTemplate } from "./midnighttokyo";
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
    // Batch-3 templates: metadata + demo bundles + preview entries exist, the
    // dedicated component doesn't yet. Each falls back to the closest existing
    // template (nearest palette/motif). Swap in real components as they land.
    case "skyrealm":
      return <SkyrealmTemplate {...rest} />;
    case "cathedral":
      return <CathedralTemplate {...rest} />;
    case "sakura":
      return <SakuraTemplate {...rest} />;
    case "versailles":
      return <VersaillesTemplate {...rest} />;
    case "fresco":
      return <FrescoTemplate {...rest} />;
    case "mirage":
      return <MirageTemplate {...rest} />;
    case "icepalace":
      return <IcepalaceTemplate {...rest} />;
    case "galaxyopera":
      return <GalaxyoperaTemplate {...rest} />;
    case "tworivers":
      return <TworiversTemplate {...rest} />;
    case "mirrorworlds":
      return <MirrorworldsTemplate {...rest} />;
    case "infinitytrain":
      return <InfinitytrainTemplate {...rest} />;
    case "lanterns":
      return <LanternsTemplate {...rest} />;
    case "glassrose":
      return <GlassroseTemplate {...rest} />;
    case "secretgalaxy":
      return <SecretgalaxyTemplate {...rest} />;
    case "cartoon":
      return <CartoonTemplate {...rest} />;
    case "bricktown":
      return <BricktownTemplate {...rest} />;
    case "treasure":
      return <TreasureTemplate {...rest} />;
    case "themepark":
      return <ThemeparkTemplate {...rest} />;
    case "candyland":
      return <CandylandTemplate {...rest} />;
    case "robocity":
      return <RobocityTemplate {...rest} />;
    case "spacemission":
      return <SpacemissionTemplate {...rest} />;
    case "jungle":
      return <JungleTemplate {...rest} />;
    case "timecapsule":
      return <TimecapsuleTemplate {...rest} />;
    case "treeoflife":
      return <TreeoflifeTemplate {...rest} />;
    case "endlessclock":
      return <EndlessclockTemplate {...rest} />;
    case "digitalcity":
      return <DigitalcityTemplate {...rest} />;
    case "quantumlab":
      return <QuantumlabTemplate {...rest} />;
    case "missioncontrol":
      return <MissioncontrolTemplate {...rest} />;
    case "secretlab":
      return <SecretlabTemplate {...rest} />;
    case "portal":
      return <PortalTemplate {...rest} />;
    case "evolution":
      return <EvolutionTemplate {...rest} />;
    case "goldenuniverse":
      return <GoldenuniverseTemplate {...rest} />;
    case "halloffame":
      return <HalloffameTemplate {...rest} />;
    case "synapse":
      return <SynapseTemplate {...rest} />;
    case "futurecity":
      return <FuturecityTemplate {...rest} />;
    case "festival":
      return <FestivalTemplate {...rest} />;
    case "neonjungle":
      return <NeonjungleTemplate {...rest} />;
    case "midnighttokyo":
      return <MidnighttokyoTemplate {...rest} />;
    case "royal":
    default:
      return <RoyalTemplate {...rest} />;
  }
}
