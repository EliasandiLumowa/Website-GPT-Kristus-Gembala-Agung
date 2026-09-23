import { extractYouTubeId } from "@/lib/utils";

interface YouTubeEmbedProps {
  url: string;
  title?: string;
}

export default function YouTubeEmbed({ url, title = "Video" }: YouTubeEmbedProps) {
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    return (
      <div className="youtube-embed" style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 0, height: "300px" }}>
        <p style={{ color: "var(--color-text-muted)" }}>Video tidak tersedia</p>
      </div>
    );
  }

  return (
    <div className="youtube-embed">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
