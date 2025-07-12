
declare global {
  interface Window {
    particlesJS: (elementId: string, config: any) => void;
  }
}

export {};
