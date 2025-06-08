import type { Arrayable, Booleanable } from "unhead/types";

type MetaFlatSerializable = {
  description: string | undefined;
  themeColor:
    | string
    | Arrayable<{
        content?: string;
        media?:
          | "(prefers-color-scheme?: dark)"
          | "(prefers-color-scheme?: light)"
          | string;
      }>
    | undefined;
  twitterCreator: string | undefined;
  twitterSite: string | undefined;
  author: string | undefined;
  colorScheme:
    | "dark light"
    | "normal"
    | "light dark"
    | "only light"
    | (string & Record<never, never>)
    | undefined;
  applicationName: string | undefined;
  ogSiteName: string | undefined;
  ogLocale: string | undefined;
  ogType:
    | "website"
    | "article"
    | "book"
    | "profile"
    | "music.song"
    | "music.album"
    | "music.playlist"
    | "music.radio_status"
    | "video.movie"
    | "video.episode"
    | "video.tv_show"
    | "video.other"
    | undefined;
  ogUrl: string;
  ogTitle: string;
  ogImage:
    | string
    | Arrayable<{
        url?: string;
        secureUrl?: string;
        type?: "image/jpeg" | "image/gif" | "image/png";
        width?: "1200" | string | number;
        height?: "630" | string | number;
        alt?: string;
      }>
    | undefined;
  //son mas cosas
  robots:
    | string
    | Partial<{
        index?: Booleanable;
        follow?: Booleanable;
        all?: Booleanable;
        noindex?: Booleanable;
        noimageindex?: Booleanable;
        nofollow?: Booleanable;
        noarchive?: Booleanable;
        nosnippet?: Booleanable;
        noodp?: Booleanable;
        notranslate?: Booleanable;
        unavailable_after?: string;
        max_snippet?: string;
        max_image_preview?: string;
        max_video_preview?: string;
      }>
    | undefined;
};
export type { MetaFlatSerializable };
