/* eslint-disable @typescript-eslint/consistent-type-definitions */
/// <reference types="vite/client" />

interface Window {
    reactRoot:
        | {
              render(children: React.ReactNode): void;
              unmount(): void;
          }
        | undefined;
}
