import type { Options } from "typewriter-effect";

declare module "typewriter-effect" {
  interface TypewriterOptions {
    pauseFor: number & Options;
  }
}
