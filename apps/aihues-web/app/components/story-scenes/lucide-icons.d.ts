// Lets scenes import a lucide icon's raw node array for RoughIcon:
//   import { __iconNode as fooNode } from 'lucide-react/dist/esm/icons/foo.mjs';
// (lucide-react has no `exports` map, so deep imports resolve fine.)
declare module 'lucide-react/dist/esm/icons/*' {
  export const __iconNode: [string, Record<string, string | number>][];
  const Icon: unknown;
  export default Icon;
}
