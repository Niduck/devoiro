import { useCallback, useEffect, useRef, useState } from "react";
import { normalize } from "../lib/reading";

type ResultEvent = Event & { results: { length: number; [index: number]: { isFinal: boolean; [index: number]: { transcript: string } } } };
type Recognition = { lang: string; continuous: boolean; interimResults: boolean; onresult: ((event: ResultEvent) => void) | null; onerror: (() => void) | null; onend: (() => void) | null; start(): void; abort(): void };

declare global { interface Window { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition } }

export function useSpeechRecognition(onSpeech: (transcript: string, context: string, isFinal: boolean) => void) {
  const [heard, setHeard] = useState("");
  const [supported] = useState(() => typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));
  const [problem, setProblem] = useState(false);
  const recognition = useRef<Recognition | null>(null);
  const buffer = useRef("");
  const active = useRef(false);
  const onSpeechRef = useRef(onSpeech);
  useEffect(() => { onSpeechRef.current = onSpeech; }, [onSpeech]);

  const stop = useCallback(() => {
    active.current = false;
    if (recognition.current) { recognition.current.onend = null; recognition.current.abort(); recognition.current = null; }
  }, []);

  const reset = useCallback(() => { buffer.current = ""; setHeard(""); }, []);

  const start = useCallback(() => {
    const Constructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Constructor) return;
    stop(); active.current = true; setProblem(false);
    const instance = new Constructor();
    instance.lang = "fr-FR"; instance.continuous = true; instance.interimResults = true;
    instance.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript.trim();
      const context = `${buffer.current} ${transcript}`.trim();
      console.log("[Devoiro · Speech]", { transcript, context, final: result.isFinal });
      setHeard(transcript);
      onSpeechRef.current(transcript, context, result.isFinal);
      if (result.isFinal) buffer.current = normalize(context).split(" ").slice(-22).join(" ");
    };
    instance.onerror = () => setProblem(true);
    instance.onend = () => { if (active.current) window.setTimeout(() => { try { instance.start(); } catch { /* reprise suivante */ } }, 180); };
    recognition.current = instance;
    try { instance.start(); } catch { setProblem(true); }
  }, [stop]);

  return { heard, supported, problem, start, stop, reset };
}
