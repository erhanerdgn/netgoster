import { useWatch } from 'react-hook-form';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, NumberField } from '@/components/calc/fields';
import type { ResultRow, ResultView } from '@/components/calc/ResultCard';
import {
  calculateDogalgaz,
  dogalgazFiyat,
  dogalgazTuketimiSchema,
  type DogalgazTuketimiInput,
  type DogalgazTuketimiValues,
} from '@/calculators/dogalgazTuketimi';
import { round2 } from '@/calculators/common';
import { BOTAS_KWH_SM3 } from '@/config/enerji';
import { todayISO } from '@/config/period';
import { monthNames, num, pct, tl } from '@/lib/format';
import content from './content.md';

const today = todayISO();
const f = dogalgazFiyat(today);
const ay = `${monthNames[Number(today.slice(5, 7)) - 1]} ${today.slice(0, 4)}`;

const defaults: Partial<DogalgazTuketimiInput> = {
  mod: 'm3',
  m3: 100,
  butce: 2000,
  guc: 24,
  saat: 4,
  verim: 90,
  faktor: BOTAS_KWH_SM3,
  fiyat: f.k1,
  fiyat2: f.k2,
  limit: f.limit ?? undefined,
};
const example: DogalgazTuketimiInput = {
  mod: 'kombi',
  m3: 150,
  butce: 3000,
  guc: 24,
  saat: 5,
  verim: 90,
  faktor: BOTAS_KWH_SM3,
  fiyat: f.k1,
  fiyat2: f.k2,
  limit: f.limit ?? undefined,
};

const fiyatStr = (n: number) => `${num(n, 4)} ₺/m³`;

/** Fiyat güncel tarifeyle aynıysa faturadaki kalemleri, değilse yalnız KDV ayrımını gösterir. */
function kalemler(v: DogalgazTuketimiValues, r: ReturnType<typeof calculateDogalgaz>): ResultRow[] {
  const varsayilan = r.kademe === 1 ? v.fiyat === f.k1 : v.fiyat2 === f.k2;
  if (!varsayilan)
    return [
      { label: 'KDV hariç tutar', value: tl(r.kdvHaric) },
      { label: `KDV (${pct(f.kdv)})`, value: tl(r.kdv) },
    ];
  const sm3 = (r.m3 * v.faktor) / BOTAS_KWH_SM3;
  const gaz = round2(sm3 * (r.kademe === 1 ? f.botas1 : f.botas2));
  const skb = round2(sm3 * f.skb);
  const otv = round2(sm3 * f.otv);
  return [
    {
      label: `Doğal gaz bedeli (BOTAŞ Kademe-${r.kademe})`,
      value: tl(gaz),
      hint: `${num(r.kademe === 1 ? f.botas1 : f.botas2, 6)} ₺/Sm³`,
    },
    { label: 'Sistem kullanım bedeli (İGDAŞ)', value: tl(skb), hint: `${num(f.skb, 6)} ₺/Sm³ — dağıtım ücreti` },
    { label: 'ÖTV', value: tl(otv), hint: `${num(f.otv, 4)} ₺/Sm³` },
    { label: `KDV (${pct(f.kdv)})`, value: tl(round2(r.tl - gaz - skb - otv)) },
  ];
}

function present(v: DogalgazTuketimiValues): ResultView {
  const r = calculateDogalgaz(v, f.kdv);
  const limitStr = v.limit !== undefined ? `${num(v.limit, 2)} m³` : '';
  const main =
    v.mod === 'tl'
      ? {
          label: `${tl(v.butce!)} ile kullanılabilecek gaz`,
          value: `${num(r.m3, 1)} m³`,
          caption: `≈ ${num(r.kwh, 0)} kWh · Kademe-${r.kademe}`,
        }
      : v.mod === 'kombi'
        ? {
            label: 'Aylık (30 gün) doğal gaz maliyeti',
            value: tl(r.tl),
            caption: `Günde ${num(r.m3Gun!, 2)} m³ · ayda ${num(r.m3, 1)} m³ · Kademe-${r.kademe}`,
          }
        : {
            label: 'Tahmini doğal gaz bedeli',
            value: tl(r.tl),
            caption: `${num(r.m3, 2)} m³ ≈ ${num(r.kwh, 0)} kWh · Kademe-${r.kademe}`,
          };
  return {
    main,
    status:
      r.artan !== undefined
        ? {
            tone: 'warn',
            text: `Bu bütçe Kademe-1'de ${limitStr} limitini aşmaya yetiyor ama limit aşılınca ayın tamamı Kademe-2 fiyatından faturalandığı için ${limitStr}'ten fazlası bütçeyi aşar. Limitte kalırsanız ${tl(r.artan)} artar.`,
          }
        : r.kademe === 2
          ? {
              tone: 'warn',
              text: `Aylık ${limitStr} kademe limiti aşıldı: ayın tüketiminin TAMAMI Kademe-2 fiyatından (${fiyatStr(v.fiyat2)}) faturalanır. Limitin altında kalsaydınız ${tl(round2((r.m3 * v.faktor * v.fiyat) / BOTAS_KWH_SM3))} öderdiniz.`,
            }
          : v.limit !== undefined
            ? { tone: 'ok', text: `Kademe-1: aylık ${limitStr} limitinin ${num(v.limit - r.m3, 1)} m³ altındasınız.` }
            : { tone: 'info', text: 'Kademe limiti girilmedi; tüm tüketim Kademe-1 fiyatıyla hesaplandı.' },
    rows: [
      ...(v.mod === 'kombi'
        ? [
            {
              label: 'Günlük ısı ihtiyacı',
              value: `${num(r.isiGun!, 1)} kWh`,
              hint: `${num(v.guc!)} kW × ${num(v.saat!, 2)} saat`,
            },
            {
              label: 'Günlük gaz tüketimi',
              value: `${num(r.m3Gun!, 2)} m³`,
              hint: `${num(r.isiGun!, 1)} kWh ÷ %${num(v.verim)} verim ÷ ${num(v.faktor, 2)} kWh/m³`,
            },
            { label: 'Günlük maliyet', value: tl(r.tlGun!) },
          ]
        : []),
      { label: v.mod === 'kombi' ? 'Aylık tüketim (30 gün)' : 'Tüketim', value: `${num(r.m3, 2)} m³` },
      { label: 'Enerji karşılığı', value: `${num(r.kwh, 1)} kWh`, hint: `m³ × ${num(v.faktor, 2)} kWh/m³` },
      {
        label: `Birim fiyat (Kademe-${r.kademe}, KDV dahil)`,
        value: fiyatStr(r.birimFiyat),
        hint: `${num(r.tlKwh, 4)} ₺/kWh (fiyat ÷ ${num(BOTAS_KWH_SM3, 2)})`,
      },
      ...kalemler(v, r),
      { label: 'Toplam', value: tl(r.tl), tone: 'total' },
    ],
    notes: [
      `Varsayılan fiyatlar ${ay} İstanbul (İGDAŞ) konut tarifesidir: BOTAŞ gaz bedeli + ÖTV + sistem kullanım bedeli + %20 KDV. Diğer illerde dağıtım şirketinin sistem kullanım bedeli farklı olduğundan fiyat birkaç kuruş-lira farklıdır; faturanızdaki birim fiyatı girebilirsiniz.`,
      'Faturada m³ önce hacim düzeltme katsayısıyla (k) standart m³’e, sonra aylık üst ısıl değerle kWh’ye çevrilir. Faturanızdaki "k × üst ısıl değer" çarpımını dönüşüm katsayısına girerseniz sonuç faturaya yaklaşır.',
    ],
  };
}

function Fields() {
  const mod = useWatch<DogalgazTuketimiInput, 'mod'>({ name: 'mod' });
  return (
    <>
      <ChoiceField<DogalgazTuketimiInput>
        name="mod"
        label="Ne hesaplamak istiyorsunuz?"
        className="sm:col-span-2"
        options={[
          { value: 'm3', label: 'm³ → TL' },
          { value: 'tl', label: 'Bütçe → m³' },
          { value: 'kombi', label: 'Kombi' },
        ]}
      />
      {mod === 'tl' && (
        <NumberField<DogalgazTuketimiInput>
          name="butce"
          label="Aylık bütçe"
          unit="₺"
          className="sm:col-span-2"
          help="Bir ayda doğal gaza ayırmak istediğiniz tutar (KDV dahil)."
        />
      )}
      {mod === 'm3' && (
        <NumberField<DogalgazTuketimiInput>
          name="m3"
          label="Aylık tüketim"
          unit="m³"
          className="sm:col-span-2"
          help="Faturanızdaki tüketim (m³) ya da sayacın iki okuma arasındaki farkı. Kademe kontrolü aylık tüketime göre yapılır."
        />
      )}
      {mod === 'kombi' && (
        <>
          <NumberField<DogalgazTuketimiInput>
            name="guc"
            label="Kombi gücü"
            unit="kW"
            decimals={1}
            help="Kombinin ısıl gücü (kW). Etikette 24 kW ya da 20.000 kcal/h gibi yazar; 1 kW ≈ 860 kcal/h."
          />
          <NumberField<DogalgazTuketimiInput>
            name="saat"
            label="Tam güçte çalışma"
            unit="saat/gün"
            help="Kombi gün boyu kısık (modülasyonlu) çalışır. 24 kW kombi günde 8 saat yarı güçte çalışıyorsa 4 saat tam güç demektir. Kışın yalıtımlı bir dairede 3–5 saat tipik bir değerdir."
          />
          <NumberField<DogalgazTuketimiInput>
            name="verim"
            label="Kombi verimi"
            unit="%"
            decimals={0}
            help="Yoğuşmalı kombilerde %90–95, eski hermetik kombilerde %80–85 alın (üst ısıl değere göre)."
          />
        </>
      )}
      <NumberField<DogalgazTuketimiInput>
        name="fiyat"
        label="Birim fiyat (Kademe-1)"
        unit="₺/m³"
        decimals={4}
        help="KDV dahil 1 standart m³ doğal gaz fiyatı. Varsayılan İstanbul'un bu ayki konut fiyatıdır; ilinizin fiyatı için dağıtım şirketinizin satış tarifesine bakın."
        hint={`${ay} İstanbul: ${fiyatStr(f.k1)}`}
      />
      <NumberField<DogalgazTuketimiInput>
        name="fiyat2"
        label="Birim fiyat (Kademe-2)"
        unit="₺/m³"
        decimals={4}
        help="Aylık limit aşılırsa o ayın tüm tüketimine uygulanan yüksek fiyat (KDV dahil)."
        hint={`${ay} İstanbul: ${fiyatStr(f.k2)}`}
      />
      <NumberField<DogalgazTuketimiInput>
        name="limit"
        label="Aylık kademe limiti"
        unit="m³"
        help="BOTAŞ'ın il ve ay bazında belirlediği konut limiti (o ilin ortalama tüketiminin %75 fazlası). Boş bırakırsanız kademe uygulanmaz."
        hint={f.limit !== null ? `${ay} İstanbul: ${num(f.limit, 2)} m³` : undefined}
      />
      <NumberField<DogalgazTuketimiInput>
        name="faktor"
        label="1 m³ kaç kWh"
        unit="kWh"
        decimals={4}
        help="Faturada m³ × düzeltme katsayısı (k) × üst ısıl değer = kWh. Varsayılan 10,64, BOTAŞ'ın m³ fiyatını kWh fiyatına çevirdiği değerdir; bununla sonuç tam olarak m³ × fiyat olur."
      />
    </>
  );
}

export default function DogalgazTuketimiPage() {
  return (
    <CalculatorLayout
      slug="dogalgaz-tuketimi-hesaplama"
      schema={dogalgazTuketimiSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      sources={[
        {
          label: 'BOTAŞ — Doğal gaz toptan satış fiyat tarifesi',
          url: 'https://www.botas.gov.tr/Sayfa/satis-fiyat-tarifesi/439',
        },
        {
          label: 'İGDAŞ — Perakende satış fiyatları',
          url: 'https://www.igdas.istanbul/musteri-hizmetleri/fiyat-tarifeleri/perakende-satis-fiyatlari',
        },
        {
          label: 'İGDAŞ — Kademeli tarife',
          url: 'https://www.igdas.istanbul/musteri-hizmetleri/fiyat-tarifeleri/kademeli-tarife',
        },
      ]}
      emptyHint="Aylık tüketiminizi (m³), bütçenizi ya da kombi gücünüzü girdiğiniz anda doğal gaz maliyeti hesaplanır."
    >
      <Fields />
    </CalculatorLayout>
  );
}
