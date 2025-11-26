"use client";
import { useState, useEffect } from "react";

type Props = { text: string };

export default function ApodDescription({ text }: Props) {
  const [translated, setTranslated] = useState("");
  const [showTranslation, setShowTranslation] = useState(false); // false = 原文表示
  const [speaking, setSpeaking] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // 初回に翻訳を取得
  useEffect(() => {
    const fetchTranslation = async () => {
      const res = await fetch(`/api/translate?text=${encodeURIComponent(text)}`);
      const data = await res.json();
      if (data.translated) setTranslated(data.translated);
    };
    fetchTranslation();
  }, [text]);

  // ボタン押下で表示切替
  const toggleText = () => {
    setShowTranslation(prev => !prev);
  };

  // 音声再生
  const speak = () => {
    const content = showTranslation ? translated : text;
    if (!content) return;

    const u = new SpeechSynthesisUtterance(content);
    u.lang = showTranslation ? "ja-JP" : "en-US"; // 状態に応じて言語切替
    u.rate = 1;
    u.pitch = 1;
    u.onend = () => setSpeaking(false);

    setUtterance(u);
    setSpeaking(true);
    speechSynthesis.speak(u);
  };

  const stop = () => {
    if (utterance) {
      speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  return (
    <div className="mt-4">
      <button onClick={toggleText} className="mr-2 px-2 py-1 border rounded">
        {showTranslation ? "原文" : "翻訳"} {/* 切り替え先を表示 */}
      </button>
      <button
        onClick={speak}
        className="mr-2 px-2 py-1 border rounded"
        disabled={showTranslation && !translated || speaking}
      >
        再生
      </button>
      <button onClick={stop} className="px-2 py-1 border rounded" disabled={!speaking}>
        停止
      </button>

      <p className="mt-2">{showTranslation ? translated || "翻訳中..." : text}</p>
    </div>
  );
}
