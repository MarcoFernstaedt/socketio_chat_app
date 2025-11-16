import { useCallback } from "react";

const keyStrokeSounds: HTMLAudioElement[] =
  typeof window !== "undefined"
    ? [
        new Audio("/sounds/keystroke1.mp3"),
        new Audio("/sounds/keystroke2.mp3"),
        new Audio("/sounds/keystroke3.mp3"),
        new Audio("/sounds/keystroke4.mp3"),
      ]
    : [];

export const useKeyboardSound = () => {
  const playRandomKeyStrokeSound = useCallback((): void => {
    if (keyStrokeSounds.length === 0) return;

    const random = Math.floor(Math.random() * keyStrokeSounds.length);
    const sound = keyStrokeSounds[random];

    sound.currentTime = 0;

    sound.play().catch((err) =>
      console.error("Audio play error:", err)
    );
  }, []);

  return { playRandomKeyStrokeSound };
};