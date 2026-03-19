import { existsSync, readFileSync } from "node:fs";
import { join as pathJoin } from "node:path";

export interface OpenStreamConfig {
  streaming?: {
    mode?: "standard" | "enhanced" | "ultra";
    bufferSize?: number;
    throttleDelay?: number;
    enableThinkingOutput?: boolean;
    streamInterval?: number;
  };
  context?: {
    enableMegaContext?: boolean;
    maxContextWindow?: number;
    autoDetectContext?: boolean;
  };
}

/**
 * Load OpenStream configuration from config file
 * @param configPath Path to the OpenClaw config directory
 * @returns OpenStreamConfig or default config if not found
 */
export function loadOpenStreamConfig(configPath?: string): OpenStreamConfig {
  // Try to find config file in common locations
  const possiblePaths = [
    configPath ? pathJoin(configPath, "openstream-streaming.json") : "",
    pathJoin(process.cwd(), "config", "openstream-streaming.json"),
    pathJoin(process.cwd(), "openstream-streaming.json"),
    "/etc/openclaw/openstream-streaming.json",
  ].filter(Boolean) as string[];

  for (const configFilePath of possiblePaths) {
    if (existsSync(configFilePath)) {
      try {
        const configFile = readFileSync(configFilePath, "utf8");
        const config = JSON.parse(configFile) as OpenStreamConfig;
        console.log(`[openstream] Loaded config from ${configFilePath}`);
        return config;
      } catch (err) {
        console.warn(`[openstream] Failed to parse config file ${configFilePath}:`, err);
      }
    }
  }

  // Return default config if no file found
  console.log("[openstream] Using default configuration");
  return {
    streaming: {
      mode: "standard",
      bufferSize: 1024,
      throttleDelay: 10,
      enableThinkingOutput: false,
      streamInterval: 50,
    },
    context: {
      enableMegaContext: false,
      maxContextWindow: 262144,
      autoDetectContext: true,
    },
  };
}

/**
 * Apply streaming mode presets to config
 * @param config Base configuration
 * @returns Configuration with streaming mode applied
 */
export function applyStreamingMode(config: OpenStreamConfig): OpenStreamConfig {
  const mode = config.streaming?.mode || "standard";
  
  switch (mode) {
    case "enhanced":
      return {
        ...config,
        streaming: {
          ...config.streaming,
          bufferSize: 2048,
          throttleDelay: 5,
          streamInterval: 25,
        },
      };
    case "ultra":
      return {
        ...config,
        streaming: {
          ...config.streaming,
          bufferSize: 4096,
          throttleDelay: 1,
          streamInterval: 10,
          enableThinkingOutput: true,
        },
      };
    case "standard":
    default:
      return {
        ...config,
        streaming: {
          ...config.streaming,
          bufferSize: 1024,
          throttleDelay: 10,
          streamInterval: 50,
        },
      };
  }
}