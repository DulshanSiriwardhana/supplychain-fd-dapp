// global.d.ts
export {};

declare global {
  interface Window {
    ethereum?: any;
  }
}

declare module '*.css';
