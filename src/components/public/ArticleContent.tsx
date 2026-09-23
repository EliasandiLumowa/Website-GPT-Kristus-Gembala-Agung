"use client";

import React from "react";

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  if (!content) return null;

  // Pisahkan konten berdasarkan baris baru
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];

  const flushParagraph = (key: string | number) => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join("\n");
      elements.push(
        <p
          key={`p-${key}`}
          style={{
            marginBottom: "var(--space-lg)",
            lineHeight: 1.9,
            whiteSpace: "pre-line",
          }}
        >
          {text}
        </p>
      );
      currentParagraph = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    // Cek apakah baris adalah markdown image ![alt](url)
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);

    if (imgMatch) {
      flushParagraph(index);
      const alt = imgMatch[1] || "Gambar";
      const src = imgMatch[2];

      elements.push(
        <figure
          key={`img-${index}`}
          style={{
            margin: "var(--space-2xl) 0",
            textAlign: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            style={{
              maxWidth: "100%",
              maxHeight: "650px",
              height: "auto",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
              display: "inline-block",
            }}
          />
          {alt && alt !== "Gambar" && alt !== "gambar" && (
            <figcaption
              style={{
                fontSize: "0.85rem",
                color: "var(--color-text-secondary)",
                marginTop: "var(--space-sm)",
                fontStyle: "italic",
              }}
            >
              {alt}
            </figcaption>
          )}
        </figure>
      );
    } else if (trimmed === "") {
      flushParagraph(index);
    } else {
      currentParagraph.push(line);
    }
  });

  flushParagraph("last");

  return <div className="article-body">{elements}</div>;
}
