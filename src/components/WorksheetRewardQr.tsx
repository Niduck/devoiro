import { QRCodeSVG } from "qrcode.react";
import type { Reward } from "../types";

export function WorksheetRewardQr({ reward }: { reward: Reward | null }) {
  if (!reward) return null;

  return <aside className="worksheet-reward-qr">
    <QRCodeSVG value={`Devoiro — Récompense : ${reward.label}`} size={80} level="M" marginSize={1} title="QR code de la récompense" />
    <span><strong>Récompense</strong>À scanner par un adulte</span>
  </aside>;
}
