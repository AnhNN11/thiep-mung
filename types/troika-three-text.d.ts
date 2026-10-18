declare module "troika-three-text" {
  import { Mesh, Material } from "three";
  export class Text extends Mesh {
    text: string;
    font: string;
    fontSize: number;
    letterSpacing: number;
    anchorX: string | number;
    anchorY: string | number;
    textAlign: string;
    material: Material;
    sync(callback?: () => void): void;
    dispose(): void;
  }
}
