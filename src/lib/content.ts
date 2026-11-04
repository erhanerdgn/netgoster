/** Vite md eklentisinin (vite.config.ts → mdPlugin) ürettiği içerik modülü */
export interface ContentModule {
  /** İçerik H2 sınırlarından 1–3 parçaya bölünür; parçaların arasına içerik reklamları girer */
  body: string[];
  toc: { id: string; text: string }[];
  faqs: { q: string; a: string }[];
  words: number;
}
