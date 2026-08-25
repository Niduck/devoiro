import type { CSSProperties } from "react";
import type { DevoirosId } from "../types";
import devoiros1 from "../assets/illustrations/devoiros/devoiros-1.svg";
import devoiros2 from "../assets/illustrations/devoiros/devoiros-2.svg";
import devoiros3 from "../assets/illustrations/devoiros/devoiros-3.svg";
import devoiros4 from "../assets/illustrations/devoiros/devoiros-4.svg";
import devoiros5 from "../assets/illustrations/devoiros/devoiros-5.svg";

export const DEVOIROS_OPTIONS: Array<{ id: DevoirosId; src: string; label: string }> = [
  { id: "devoiros-1", src: devoiros1, label: "Cœur rose" },
  { id: "devoiros-2", src: devoiros2, label: "Pentagone étoilé" },
  { id: "devoiros-3", src: devoiros3, label: "Carré couronné turquoise" },
  { id: "devoiros-4", src: devoiros4, label: "Carré couronné crème" },
  { id: "devoiros-5", src: devoiros5, label: "Triangle jaune" },
];

export function DevoirosAvatar({ id = "devoiros-1", className = "", style }: { id?: DevoirosId; className?: string; style?: CSSProperties }) {
  const option = DEVOIROS_OPTIONS.find((item) => item.id === id) || DEVOIROS_OPTIONS[0];
  return <img className={`devoiros-avatar ${className}`} src={option.src} alt={option.label} style={style} />;
}
