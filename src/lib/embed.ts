/*
 * Gömülü mod — /gom/<araç>: başka sitelerin <iframe>'inde çalışan sade hesaplayıcı.
 *
 * Neden var: netgoster'in bağımsız backlink'i yok (Kasım 2026: 90 dış bağlantının hepsi kendi
 * sitelerimizden). Hesaplama sitelerinin bağlantı kazandığı en sağlam yol, hesaplayıcıyı başka
 * sitelere gömülebilir vermek. Gömme kodundaki bağlantı iframe'in DIŞINDA, ev sahibi sayfanın
 * kendi HTML'inde durur — backlink sayılan o bağlantıdır (iframe içindekiler sayılmaz).
 *
 * Gömülü sayfada: başlık/altbilgi/piyasa şeridi yok, reklam yok (AdSense başka sitenin
 * çerçevesinde reklama izin vermez), analitik/çerez bandı yok, tema her zaman açık.
 * Dizinlenmez (worker X-Robots-Tag + <meta robots>), sitemap'e girmez.
 */
import { createContext, useContext } from 'react';
import { site } from '@/config/site';

export const GOM_ONEK = '/gom/';

export const isEmbedPath = (pathname: string) => pathname.startsWith(GOM_ONEK);

export const EmbedContext = createContext(false);

export const useEmbed = () => useContext(EmbedContext);

/** Gömülü sayfanın ebeveyne gönderdiği yükseklik mesajının türü. */
export const YUKSEKLIK_MESAJI = 'netgoster:yukseklik';

/** Yükseklik betiği yüklenmezse kullanılan sabit yükseklik (px). */
export const VARSAYILAN_YUKSEKLIK = 760;

/**
 * Ev sahibi siteye verilen gömme kodu.
 * 1) iframe — hesaplayıcının kendisi.
 * 2) <p><a> — iframe'in DIŞINDA, ev sahibinin HTML'inde. Backlink budur; kaldırılırsa proje amacını yitirir.
 * 3) <script> — iframe'i içeriğin boyuna göre büyütür. İsteğe bağlı: CMS betiği silerse sabit yükseklik kalır.
 *    Kaynak (origin) denetimi var; başka bir çerçevenin mesajıyla ev sahibinin iframe'i yeniden boyutlanmaz.
 */
export function gommeKodu(slug: string, ad: string): string {
  const src = `${site.url}${GOM_ONEK}${slug}`;
  const sayfa = `${site.url}/${slug}`;
  return [
    `<iframe src="${src}" title="${ad} — NetGöster" width="100%" height="${VARSAYILAN_YUKSEKLIK}" style="border:0;max-width:100%" loading="lazy"></iframe>`,
    `<p style="font-size:13px;margin:4px 0 0">Hesaplayıcı: <a href="${sayfa}">${ad}</a> — NetGöster</p>`,
    `<script>addEventListener("message",function(e){var d=e.data;if(e.origin!=="${site.url}"||!d||d.tur!=="${YUKSEKLIK_MESAJI}")return;var f=document.querySelector('iframe[src="${src}"]');if(f&&d.slug==="${slug}")f.style.height=d.h+"px"})</script>`,
  ].join('\n');
}
