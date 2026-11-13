import { useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, DateField, NumberField, SelectField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import {
  CIHAZLAR,
  cihazTuketimi,
  elektrikFaturasi,
  elektrikTuketimiSchema,
  meskenBirimFiyat,
  type CihazKodu,
  type ElektrikTuketimiInput,
  type ElektrikTuketimiValues,
} from '@/calculators/elektrikTuketimi';
import { todayISO } from '@/config/period';
import { dateTR, num, pct, tl } from '@/lib/format';
import content from './content.md';

const today = todayISO();
const fiyatDusuk = meskenBirimFiyat(today);
const fiyatYuksek = meskenBirimFiyat(today, 'yuksek');

const defaults: Partial<ElektrikTuketimiInput> = {
  mod: 'cihaz',
  cihaz: 'klima12',
  guc: CIHAZLAR.klima12.watt,
  saat: CIHAZLAR.klima12.saat,
  gun: 30,
  birimFiyat: fiyatDusuk,
  tarife: 'tek',
  tarih: today,
};
const example: ElektrikTuketimiInput = {
  mod: 'fatura',
  cihaz: 'ozel',
  guc: 2000,
  saat: 3,
  gun: 30,
  birimFiyat: fiyatDusuk,
  tarife: 'tek',
  tarih: today,
  kwh: 300,
  gunduz: 150,
  puant: 80,
  gece: 70,
};

const kr = (n: number) => `${num(n, 4)} kr`;

function presentCihaz(v: ElektrikTuketimiValues): ResultView {
  const r = cihazTuketimi(v.guc!, v.saat!, v.gun, v.birimFiyat!);
  const yil = cihazTuketimi(v.guc!, v.saat!, 365, v.birimFiyat!);
  const ad = v.cihaz && v.cihaz in CIHAZLAR ? CIHAZLAR[v.cihaz as CihazKodu].label : 'Cihaz';
  return {
    main: {
      label: `${ad} · ${v.gun} günlük elektrik maliyeti`,
      value: tl(r.tl),
      caption: `${num(r.kwh, 2)} kWh · ${num(v.guc!)} W × ${num(v.saat!, 2)} saat × ${v.gun} gün`,
    },
    status: {
      tone: 'info',
      text: `1 kWh = ${num(v.birimFiyat!, 4)} ₺ (vergiler dahil) ile hesaplandı. Hanenizin toplam tüketimi günde ortalama 8 kWh'yi aşıyorsa aşan kısım ${num(fiyatYuksek, 4)} ₺/kWh'den faturalanır.`,
    },
    rows: [
      { label: 'Saatlik tüketim', value: `${num(r.kwhSaat, 3)} kWh`, hint: `${num(v.guc!)} W ÷ 1.000` },
      { label: 'Saatlik maliyet', value: tl(r.tlSaat) },
      { label: 'Günlük tüketim', value: `${num(r.kwhGun, 3)} kWh`, hint: `${num(r.kwhSaat, 3)} kWh × ${num(v.saat!, 2)} saat` },
      { label: 'Günlük maliyet', value: tl(r.tlGun) },
      { label: `${v.gun} günlük tüketim`, value: `${num(r.kwh, 2)} kWh` },
      { label: `${v.gun} günlük maliyet`, value: tl(r.tl), tone: 'total' },
      { label: 'Yıllık (365 gün) tüketim', value: `${num(yil.kwh, 0)} kWh`, tone: 'muted' },
      { label: 'Yıllık maliyet', value: tl(yil.tl), tone: 'muted' },
    ],
    notes: [
      'Hazır cihaz değerleri tipik ortalamalardır. En doğru sonuç için cihazın etiketindeki güç (W) ya da enerji etiketindeki yıllık kWh değerini kullanın.',
      'Klima, buzdolabı ve ısıtıcı gibi termostatlı cihazlar sürekli tam güçte çalışmaz; inverter klimada ortalama güç etiket gücünün yarısına kadar düşebilir.',
    ],
  };
}

function presentFatura(v: ElektrikTuketimiValues): ResultView {
  const r = elektrikFaturasi(v);
  const o = r.oranlar;
  const skttAsim = r.yillikTahmin > r.skttLimit;
  const enerjiHint =
    v.tarife === 'tek'
      ? `${num(r.dusukKwh, 2)} kWh × ${kr(o.tekDusuk)}${r.yuksekKwh > 0 ? ` + ${num(r.yuksekKwh, 2)} kWh × ${kr(o.tekYuksek)}` : ''}`
      : `gündüz ${kr(o.gunduz)}, puant ${kr(o.puant)}, gece ${kr(o.gece)}`;
  return {
    main: {
      label: 'Tahmini fatura tutarı',
      value: tl(r.toplam),
      caption: `${num(r.kwh, 2)} kWh · ortalama ${num(r.ortalama, 3)} ₺/kWh (vergiler dahil)`,
    },
    status: skttAsim
      ? {
          tone: 'warn',
          text: `Bu tüketim yıla yayılırsa yaklaşık ${num(r.yillikTahmin, 0)} kWh eder; ${num(r.skttLimit)} kWh'lik yıllık limiti aşan meskenlerin enerji bedeli sonraki yıl düzenlenmiş tarifeden değil, piyasa fiyatına dayalı son kaynak tarifesinden hesaplanır ve fatura bu tahminden yüksek çıkar.`,
        }
      : r.yuksekKwh > 0
        ? {
            tone: 'warn',
            text: `Günlük ortalama ${o.kademeGunluk} kWh sınırı aşıldı: ${num(r.kademeLimit)} kWh'yi aşan ${num(r.yuksekKwh, 2)} kWh yüksek kademeden (${kr(o.tekYuksek)}/kWh) faturalandı.`,
          }
        : {
            tone: 'ok',
            text:
              v.tarife === 'tek'
                ? `Tüketiminizin tamamı düşük kademede (${v.gun} günde ${num(r.kademeLimit)} kWh'ye kadar).`
                : 'Üç zamanlı tarifede kademe uygulanmaz; her saat diliminin kendi fiyatı vardır.',
          },
    rows: [
      { label: 'Enerji bedeli', value: tl(r.enerji), hint: enerjiHint },
      { label: 'Dağıtım bedeli', value: tl(r.dagitim), hint: `${num(r.kwh, 2)} kWh × ${kr(o.dagitim)}` },
      {
        label: `Elektrik tüketim vergisi (${pct(o.tuketimVergisi)})`,
        value: tl(r.tuketimVergisi),
        hint: 'Yalnız enerji bedeli üzerinden (belediye payı)',
      },
      { label: 'Ara toplam', value: tl(r.araToplam), tone: 'muted' },
      { label: `KDV (${pct(o.kdv)})`, value: tl(r.kdv), hint: 'Mesken aboneleri için indirimli oran' },
      { label: 'Toplam fatura', value: tl(r.toplam), tone: 'total' },
      {
        label: 'Yıllık tüketim tahmini',
        value: `${num(r.yillikTahmin, 0)} kWh`,
        tone: 'muted',
        hint: `Son kaynak limiti ${num(r.skttLimit)} kWh/yıl`,
      },
    ],
    notes: [
      `Tarife: ${dateTR(r.tarifeBaslangic)} tarihinden itibaren geçerli EPDK mesken (alçak gerilim) tarifesi. ${r.tarifeKaynak.split(' — ')[0]}.`,
      'Faturanızda gecikme zammı, önceki dönem mahsubu veya sayaç okuma farkı varsa tutar değişir. Şehit aileleri ve gaziler için ayrı indirimli tarife uygulanır.',
    ],
  };
}

const present = (v: ElektrikTuketimiValues) => (v.mod === 'cihaz' ? presentCihaz(v) : presentFatura(v));

/** Hazır cihaz seçilince güç ve süre alanlarını doldurur (ilk yüklemede paylaşım linkindeki değerlere dokunmaz). */
function CihazSecici() {
  const { setValue } = useFormContext<ElektrikTuketimiInput>();
  const cihaz = useWatch<ElektrikTuketimiInput, 'cihaz'>({ name: 'cihaz' });
  const onceki = useRef(cihaz);
  useEffect(() => {
    if (onceki.current === cihaz) return;
    onceki.current = cihaz;
    if (cihaz && cihaz in CIHAZLAR) {
      const c = CIHAZLAR[cihaz as CihazKodu];
      setValue('guc', c.watt, { shouldValidate: true });
      setValue('saat', c.saat, { shouldValidate: true });
    }
  }, [cihaz, setValue]);
  return (
    <SelectField<ElektrikTuketimiInput>
      name="cihaz"
      label="Cihaz"
      className="sm:col-span-2"
      help="Bir cihaz seçince tipik gücü ve günlük kullanım süresi doldurulur; ikisini de kendi cihazınıza göre değiştirebilirsiniz."
      options={[
        ...Object.entries(CIHAZLAR).map(([value, c]) => ({ value, label: `${c.label} · ${num(c.watt)} W` })),
        { value: 'ozel', label: 'Diğer (gücü elle girin)' },
      ]}
    />
  );
}

function Fields() {
  const mod = useWatch<ElektrikTuketimiInput, 'mod'>({ name: 'mod' });
  const tarife = useWatch<ElektrikTuketimiInput, 'tarife'>({ name: 'tarife' });
  return (
    <>
      <ChoiceField<ElektrikTuketimiInput>
        name="mod"
        label="Ne hesaplamak istiyorsunuz?"
        className="sm:col-span-2"
        options={[
          { value: 'cihaz', label: 'Cihaz tüketimi' },
          { value: 'fatura', label: 'Fatura tahmini' },
        ]}
      />
      {mod === 'fatura' ? (
        <>
          <ChoiceField<ElektrikTuketimiInput>
            name="tarife"
            label="Tarife"
            className="sm:col-span-2"
            help="Evlerin çoğu tek zamanlı tarifededir. Üç zamanlı (gündüz-puant-gece) sayacınız varsa faturanızda T1, T2, T3 endeksleri ayrı yazar."
            options={[
              { value: 'tek', label: 'Tek zamanlı' },
              { value: 'uc', label: 'Üç zamanlı' },
            ]}
          />
          {tarife === 'uc' ? (
            <>
              <NumberField<ElektrikTuketimiInput>
                name="gunduz"
                label="Gündüz (T1)"
                unit="kWh"
                help="06:00–17:00 arası tüketim (faturada T1)."
              />
              <NumberField<ElektrikTuketimiInput>
                name="puant"
                label="Puant (T2)"
                unit="kWh"
                help="17:00–22:00 arası, en pahalı dilim (faturada T2)."
              />
              <NumberField<ElektrikTuketimiInput>
                name="gece"
                label="Gece (T3)"
                unit="kWh"
                help="22:00–06:00 arası, en ucuz dilim (faturada T3)."
              />
            </>
          ) : (
            <NumberField<ElektrikTuketimiInput>
              name="kwh"
              label="Dönem tüketimi"
              unit="kWh"
              placeholder="Örn. 230"
              help="Faturanızdaki 'Tüketim (kWh)' değeri: son endeks − ilk endeks."
            />
          )}
          <NumberField<ElektrikTuketimiInput>
            name="gun"
            label="Fatura dönemi"
            unit="gün"
            decimals={0}
            help="İlk ve son okuma arasındaki gün sayısı. Düşük kademe sınırı gün başına 8 kWh olduğundan dönem uzadıkça sınır da büyür."
          />
          <DateField<ElektrikTuketimiInput>
            name="tarih"
            label="Okuma tarihi"
            help="Tarifenin seçileceği tarih. EPDK tarifeleri dönem dönem değişir; geçmiş bir faturayı kontrol ediyorsanız o tarihi girin."
          />
        </>
      ) : (
        <>
          <CihazSecici />
          <NumberField<ElektrikTuketimiInput>
            name="guc"
            label="Güç"
            unit="W"
            decimals={0}
            help="Cihazın etiketindeki güç (watt). 1 kW = 1.000 W. Klimada BTU değil, elektrik gücü (W) yazılmalıdır."
          />
          <NumberField<ElektrikTuketimiInput>
            name="saat"
            label="Günlük kullanım"
            unit="saat"
            help="Cihazın günde kaç saat çalıştığı. 15 dakika = 0,25 saat."
          />
          <NumberField<ElektrikTuketimiInput>
            name="gun"
            label="Kaç gün"
            unit="gün"
            decimals={0}
            help="Hesabın kaç günü kapsayacağı. Aylık maliyet için 30 girin."
          />
          <NumberField<ElektrikTuketimiInput>
            name="birimFiyat"
            label="1 kWh fiyatı"
            unit="₺"
            decimals={4}
            help="Vergiler dahil mesken birim fiyatı. Günlük ortalama 8 kWh'ye kadar düşük kademe, üstü yüksek kademe fiyatı geçerlidir."
            hint={`Güncel: ${num(fiyatDusuk, 4)} ₺ (düşük kademe) · ${num(fiyatYuksek, 4)} ₺ (yüksek kademe)`}
          />
        </>
      )}
    </>
  );
}

export default function ElektrikTuketimiPage() {
  return (
    <CalculatorLayout
      slug="elektrik-tuketimi-hesaplama"
      schema={elektrikTuketimiSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      sources={[
        {
          label: 'EPDK — Elektrik faturalarına esas tarife tabloları',
          url: 'https://www.epdk.gov.tr/Detay/Icerik/3-1327/elektrik-tarifeleri',
        },
      ]}
      emptyHint="Cihazın gücünü ve kullanım süresini ya da faturanızdaki kWh tüketimini girdiğiniz anda maliyet hesaplanır."
    >
      <Fields />
    </CalculatorLayout>
  );
}
