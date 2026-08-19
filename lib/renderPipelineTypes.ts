/** Types for the RENDER_PACKAGE JSON produced by the video batch prompt.
 *  These are consumed by scripts/render-pipeline.mjs (the CLI orchestrator)
 *  and its adapter modules.
 */

export type RenderScene = {
  start_s: number;
  end_s: number;
  visual_prompt: string;
  motion: string;
  caption: string;
  caption_style: string;
};

export type RenderVoiceover = {
  script: string;
  voice: {
    gender: string;
    age: string;
    accent: string;
    tone: string;
    pace: "slow" | "medium" | "fast";
    energy: "low" | "medium" | "high";
  };
};

export type RenderMusic = {
  genre: string;
  bpm: number;
  mood: string;
  reference: string;
  energy_curve: "build" | "drop" | "steady" | "swell";
};

export type RenderSfx = {
  t_s: number;
  cue: string;
};

export type RenderCaption = {
  in_s: number;
  out_s: number;
  text: string;
  style: string;
};

export type RenderPackage = {
  id: string;
  aspect: "9:16";
  duration_s: number;
  accent: string;
  scenes: RenderScene[];
  voiceover: RenderVoiceover;
  music: RenderMusic;
  sfx: RenderSfx[];
  captions: RenderCaption[];
};

/** Video generation backend config */
export type VideoBackend = "runway" | "pika" | "playwright";

/** Pipeline run options */
export type PipelineOptions = {
  input: string;               // path to RENDER_PACKAGE JSON
  outputDir: string;           // output directory for rendered files
  videoBackend: VideoBackend;  // which text-to-video provider
  voiceBackend: "elevenlabs" | "edge-tts" | "none";
  concurrency: number;         // parallel scene renders
  dryRun: boolean;             // print plan without executing
  skipScenes: boolean;         // skip video gen (useful for audio-only)
  skipAudio: boolean;          // skip TTS/music (useful for video-only)
};
