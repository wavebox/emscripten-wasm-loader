type stringToUTF8Signature = (str: string, outPtr: number, maxBytesToWrite: number) => void;
type cwrapArgType = 'number' | 'string' | 'array' | 'boolean';
/** @internal */
type cwrapSignature = <T = Function>(
  fn: string,
  returnType: cwrapArgType | null,
  parameterType?: Array<cwrapArgType>
) => T;

type FILESYSTEMS = {
  NODEFS: any;
  MEMFS: any;
};

/**
 * Subset of internal filesystem api for wasm module.
 */
type FS = {
  filesystems: FILESYSTEMS;
  stat: (path: string) => import('fs').Stats;
  isDir: (mode: number) => boolean;
  isFile: (mode: number) => boolean;
  mkdir: (path: string, mode?: number) => void;
  mount: (type: FILESYSTEMS, option: { root?: string }, mountpoint: string) => void;
  writeFile: (path: string, data: ArrayBufferView, opts: { encoding?: string; flags?: string }) => void;
  unlink: (path: string) => void;
  unmount: (mountpoint: string) => void;
  rmdir: (path: string) => void;
};

interface AsmModule {
  cwrap: cwrapSignature;
  FS: FS;
  stringToUTF8: stringToUTF8Signature;
  stackAlloc: (length: number) => number;
  stackSave: () => number;
  stackRestore: (stack: number) => void;
  getValue: <T = any>(ptr: number, type: string, nosafe?: boolean) => T;
  Pointer_stringify: (ptr: number) => string;
  _free: (ptr: number) => void;
}

/**
 *
 * Base interface for module generated by emscripten to load wasm binary.
 * https://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html
 */
type BaseAsmModule = Partial<AsmModule> & { initializeRuntime(): Promise<boolean> };

export { stringToUTF8Signature, cwrapSignature, FILESYSTEMS, FS, BaseAsmModule };
