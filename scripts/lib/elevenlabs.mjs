/**
 * ElevenLabs text-to-speech adapter.
 *
 * Requires: ELEVENLABS_API_KEY env var.
 *
 * API flow:
 *   1. POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
 *      with { text, model_id, voice_settings }
 *   2. Response is raw audio bytes (mp3 by default)
 *   3. Save to disk
 *
 * Docs: https://elevenlabs.io/docs/api-reference/text-to-speech
 */

const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1";

function apiKey() {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("ELEVENLABS_API_KEY is not set. Get one at https://elevenlabs.io/");
  return key;
}

/**
 * Voice presets — maps the RENDER_PACKAGE voice fields to ElevenLabs voice IDs.
 * Override any with ELEVENLABS_VOICE_<GENDER> env vars.
 */
const VOICE_MAP = {
  female: {
    "20s": "EXAVITQu4vr4xnSDxMaL",  // Bella
    "30s": "21m00Tcm4TlvDq8ikWAM",  // Rachel
    "40s": "21m00Tcm4TlvDq8ikWAM",  // Rachel (mature)
  },
  male: {
    "20s": "pNInz6obpgDQGcFmaJgB",  // Adam
    "30s": "ErXwobaYiN019PkySvjV",  // Antoni
    "40s": "ErXwobaYiN019PkySvjV",  // Antoni (mature)
  },
};

function resolveVoiceId(voice) {
  // Check for env override first
  const overrideKey = `ELEVENLABS_VOICE_${(voice.gender || "female").toUpperCase()}`;
  if (process.env[overrideKey]) return process.env[overrideKey];

  const gender = VOICE_MAP[voice.gender] || VOICE_MAP.female;
  return gender[voice.age] || gender["30s"] || "21m00Tcm4TlvDq8ikWAM";
}

/**
 * Pace → stability/exilarity mapping.
 * slower pace = higher stability (slower, more measured)
 * faster pace = lower stability + higher expressiveness
 */
function paceToSettings(voice) {
  const paceMap = { slow: 0.75, medium: 0.65, fast: 0.5 };
  const energyMap = { low: 0.3, medium: 0.5, high: 0.7 };
  return {
    stability: paceMap[voice.pace] || 0.65,
    similarity_boost: 0.8,
    style: energyMap[voice.energy] || 0.5,
    use_speaker_boost: true,
  };
}

/**
 * Generate speech audio from text.
 *
 * @param {object} opts
 * @param {string} opts.text       - Text to speak
 * @param {object} opts.voice      - Voice descriptor from RENDER_PACKAGE
 * @param {string} opts.outPath    - Where to save the .mp3
 * @returns {Promise<string>}      - Path to saved audio file
 */
export async function generateSpeech({ text, voice, outPath }) {
  const voiceId = resolveVoiceId(voice);
  const settings = paceToSettings(voice);

  console.log(`  [tts] Generating speech: voice=${voiceId}, pace=${voice.pace}, energy=${voice.energy}`);
  console.log(`  [tts] Script length: ${text.length} chars (~${Math.round(text.split(/\s+/).length / 2.2)}s at 2.2 wps)`);

  const res = await fetch(`${ELEVENLABS_BASE}/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey(),
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_turbo_v2_5",
      voice_settings: settings,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ElevenLabs TTS failed (${res.status}): ${body}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const { writeFileSync, mkdirSync } = await import("fs");
  const { dirname } = await import("path");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, buffer);

  console.log(`  [tts] Saved ${outPath} (${(buffer.length / 1024).toFixed(0)} KB)`);
  return outPath;
}

/**
 * Get available voices (for debugging / selection).
 */
export async function listVoices() {
  const res = await fetch(`${ELEVENLABS_BASE}/voices`, {
    headers: { "xi-api-key": apiKey() },
  });
  if (!res.ok) throw new Error(`Failed to list voices: ${res.status}`);
  const data = await res.json();
  return data.voices.map((v) => ({ id: v.voice_id, name: v.name, gender: v.labels?.gender }));
}

/**
 * Check if ElevenLabs is configured.
 */
export function isConfigured() {
  return !!process.env.ELEVENLABS_API_KEY;
}
