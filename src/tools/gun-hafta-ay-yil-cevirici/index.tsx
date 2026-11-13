import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { DateField, NumberField, SelectField } from '@/components/calc/fields';
import type { ResultRow, ResultView } from '@/components/calc/ResultCard';
import {
  BIRIM_AD,
  BIRIMLER,
  calculateZamanCevirici,
  sayi,
  zamanCeviriciSchema,
  type Birim,
  type ZamanCeviriciInput,
  type ZamanCeviriciResult,
  type ZamanCeviriciValues,
} from '@/calculators/zamanCevirici';
import { todayISO } from '@/config/period';
import { dateLong, num } from '@/lib/format';
import content from './content.md';

const defaults: Partial<ZamanCeviriciInput> = { deger: 249, birim: 'gun', baslangic: '' };
const example: ZamanCeviriciInput = { deger: 40, birim: 'hafta', baslangic: todayISO() };

const BASLIK: Record<Birim, string> = {
  saniye: 'Saniye',
  dakika: 'Dakika',
  saat: 'Saat',
  gun: 'Gün',
  hafta: 'Hafta',
  ay: 'Ay (ortalama)',
  yil: 'Yıl (ortalama)',
};

const birimOptions = BIRIMLER.map((b) => ({ value: b, label: BASLIK[b].replace(' (ortalama)', '') }));

/** Ana sonuç: girilen birime göre en çok aranan karşılık ("249 gün kaç ay?" → "8 ay 6 gün") */
function ana(v: ZamanCeviriciValues, r: ZamanCeviriciResult): ResultView['main'] {
  const k = r.karsilik;
  const soru = (hedef: string) => `${num(v.deger, 4)} ${BIRIM_AD[v.birim]} kaç ${hedef}?`;
  const ayForm = { label: soru('ay'), value: r.ayGun, caption: `≈ ${sayi(k.ay)} ay · ${r.haftaGun}` };
  const yilForm = { label: soru('yıl'), value: r.yilAyGun, caption: `≈ ${sayi(k.yil)} yıl · ${sayi(k.ay)} ay` };
  switch (v.birim) {
    case 'saniye':
    case 'dakika':
    case 'saat': {
      // Bileşik gösterim ("4 gün 4 saat", "1 saat 30 dakika") girilen birimden büyük bir birime ulaşınca anlamlı
      if (r.gun >= 1) return { label: soru('gün'), value: r.gunSaat, caption: `= ${sayi(k.gun)} gün` };
      if (v.birim !== 'saat' && k.saat >= 1) return { label: soru('saat'), value: r.gunSaat, caption: `= ${sayi(k.saat)} saat` };
      if (v.birim === 'saniye' && k.dakika >= 1)
        return { label: soru('dakika'), value: r.gunSaat, caption: `= ${sayi(k.dakika)} dakika` };
      const alt: Birim = v.birim === 'dakika' ? 'saniye' : 'dakika';
      const ust: Birim = v.birim === 'saat' ? 'gun' : 'saat';
      return {
        label: soru(BIRIM_AD[alt]),
        value: `${sayi(k[alt])} ${BIRIM_AD[alt]}`,
        caption: `= ${sayi(k[ust])} ${BIRIM_AD[ust]}`,
      };
    }
    case 'gun':
      if (r.gun < 7) return { label: soru('saat'), value: `${sayi(k.saat)} saat`, caption: `${sayi(k.dakika)} dakika` };
      if (r.gun < 30) return { label: soru('hafta'), value: r.haftaGun, caption: `≈ ${sayi(k.ay)} ay · ${sayi(k.saat)} saat` };
      return r.gun < 365 ? ayForm : yilForm;
    case 'hafta':
      if (r.gun < 30) return { label: soru('gün'), value: `${sayi(k.gun)} gün`, caption: `≈ ${sayi(k.ay)} ay` };
      return r.gun < 365 ? ayForm : yilForm;
    case 'ay':
      if (v.deger >= 12) return { ...yilForm, caption: `≈ ${sayi(k.gun)} gün · ${sayi(k.hafta)} hafta` };
      return {
        label: soru('gün'),
        value: `${sayi(k.gun)} gün`,
        caption: `30 günlük ayla ${sayi(r.gunGelenek!)} gün · ${r.haftaGun}`,
      };
    case 'yil':
      return {
        label: soru('gün'),
        value: `${sayi(k.gun)} gün`,
        caption: `365 günlük yılla ${sayi(r.gunGelenek!)} gün · ${sayi(k.hafta)} hafta`,
      };
  }
}

function present(v: ZamanCeviriciValues): ResultView {
  const r = calculateZamanCevirici(v);
  const k = r.karsilik;
  const rows: ResultRow[] = BIRIMLER.filter((b) => b !== v.birim).map((b) => ({
    label: BASLIK[b],
    value: `${sayi(k[b])} ${BIRIM_AD[b]}`,
    hint: b === 'ay' ? '1 ay = 30,44 gün' : b === 'yil' ? '1 yıl = 365,24 gün' : undefined,
  }));
  if (r.gun >= 7 && v.birim !== 'hafta') rows.push({ label: 'Hafta ve gün', value: r.haftaGun, tone: 'total' });
  if (r.gun >= 30) rows.push({ label: 'Ay ve gün', value: r.ayGun, tone: 'total', hint: 'Ortalama ay uzunluğuyla' });
  if (r.gun >= 365) rows.push({ label: 'Yıl, ay ve gün', value: r.yilAyGun, tone: 'total' });
  if (v.birim === 'ay' || v.birim === 'yil')
    rows.push({
      label: v.birim === 'ay' ? '30 günlük ayla' : '365 günlük yılla',
      value: `${sayi(r.gunGelenek!)} gün`,
      tone: 'muted',
      hint: 'Ticari ve günlük hesaplardaki yuvarlak kabul',
    });
  else if (r.gun >= 1)
    rows.push(
      { label: '30 günlük ayla', value: `${sayi(r.ay30)} ay`, tone: 'muted' },
      { label: '365 günlük yılla', value: `${sayi(r.yil365)} yıl`, tone: 'muted' },
    );

  const t = r.takvim;
  if (t)
    rows.push(
      { label: 'Bitiş tarihi (takvime göre)', value: dateLong(t.bitis), tone: 'total' },
      { label: 'Takvime göre süre', value: t.metin, tone: 'total' },
      {
        label: 'Takvim günü',
        value: `${num(t.gun, 0)} gün`,
        hint:
          v.birim === 'ay' || v.birim === 'yil'
            ? `Ortalamaya göre ${t.fark > 0 ? '+' : ''}${num(t.fark, 2)} gün`
            : r.gun % 1
              ? 'Gün altı kısım tarihe eklenmez'
              : undefined,
      },
    );

  return {
    main: ana(v, r),
    rows,
    status: t
      ? {
          tone: 'info',
          text: `${dateLong(t.baslangic)} başlangıcıyla süre ${dateLong(t.bitis)} tarihinde dolar; takvime göre ${t.metin}${
            r.gun >= 30 && v.birim !== 'ay' && v.birim !== 'yil' && t.metin !== r.ayGun && r.gun < 365
              ? ` (ortalama ayla ${r.ayGun})`
              : ''
          }.`,
        }
      : r.takvimNot
        ? { tone: 'warn', text: r.takvimNot }
        : undefined,
    notes: [
      'Ay ve yıl, Gregoryen takvimin ortalamasıyla hesaplanır: 1 yıl = 365,2425 gün, 1 ay = 30,436875 gün. Takvimde aylar 28–31 gün çektiği için gerçek sonuç başlangıç tarihine göre 1–3 gün farklı olabilir; kesin sonuç için başlangıç tarihi girin.',
    ],
  };
}

export default function GunHaftaAyYilCeviriciPage() {
  return (
    <CalculatorLayout
      slug="gun-hafta-ay-yil-cevirici"
      schema={zamanCeviriciSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Bir süre ve birimini girin; saniyeden yıla tüm karşılıkları anında görün."
    >
      <NumberField<ZamanCeviriciInput>
        name="deger"
        label="Süre"
        decimals={4}
        placeholder="Örn. 249"
        help="Çevirmek istediğiniz süre. Ondalık da girebilirsiniz (ör. 1,5 hafta)."
      />
      <SelectField<ZamanCeviriciInput>
        name="birim"
        label="Birim"
        options={birimOptions}
        help="Girdiğiniz sürenin birimi. Sonuçta diğer tüm birimlerdeki karşılığı gösterilir."
      />
      <DateField<ZamanCeviriciInput>
        name="baslangic"
        label="Başlangıç tarihi (isteğe bağlı)"
        className="sm:col-span-2"
        fromYear={1900}
        toYear={new Date().getFullYear() + 50}
        help="Girerseniz süre bu tarihten itibaren takvim üzerinde sayılır: bitiş tarihi ve aylar 28–31 gün çektiği hesaba katılarak kesin ‘X ay Y gün’ bulunur."
        hint="Boş bırakırsanız ortalama ay (30,44 gün) ve yıl (365,24 gün) kullanılır."
      />
    </CalculatorLayout>
  );
}
