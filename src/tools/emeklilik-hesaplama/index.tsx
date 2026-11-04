import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from 'cn';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, DateField, NumberField } from '@/components/calc/fields';
import type { ResultTable, ResultView } from '@/components/calc/ResultCard';
import {
  calculateEmeklilik,
  emeklilikSchema,
  EYT_SINIR,
  type EmeklilikInput,
  type EmeklilikResult,
  type Sart,
  type Yol,
} from '@/calculators/emeklilik';
import { eytSsk, yeniSistem } from '@/config/emeklilik';
import { addDays } from '@/calculators/common';
import { dateTR, num } from '@/lib/format';
import content from './content.md';

const defaults: Partial<EmeklilikInput> = { tur: '4a', cinsiyet: 'kadin', yillikGun: 360 };
const example: EmeklilikInput = {
  tur: '4a',
  cinsiyet: 'erkek',
  dogum: '1985-06-15',
  giris: '2005-09-01',
  primGun: 5200,
  yillikGun: 360,
};

const ad = { yas: 'Yaş', gun: 'Prim günü', sure: 'Sigortalılık süresi' } as const;

function sartMetni(s: Sart) {
  const birim = s.tip === 'gun' ? 'gün' : 'yıl';
  const gerekli = `${num(s.gerekli, 0)} ${birim}`;
  const mevcut = `${num(s.mevcut, 0)} ${birim}`;
  const durum = s.saglandi
    ? 'Sağlandı'
    : s.tarih
      ? `Eksik — ${s.tip === 'gun' ? 'tahmini ' : ''}${dateTR(s.tarih)}`
      : 'Eksik — tahmin edilemiyor';
  return { gerekli, mevcut, durum };
}

function SartKarti({ yol, secili, tek }: { yol: Yol; secili: boolean; tek: boolean }) {
  return (
    <section
      aria-label={`${yol.ad} şartları`}
      className={cn('rounded-2xl border bg-card p-4 shadow-soft', secili && !tek && 'border-primary')}
    >
      <h2 className="flex flex-wrap items-baseline justify-between gap-2 font-semibold">
        <span>{tek ? 'Gerekli şartlar' : yol.ad}</span>
        {!tek && (
          <span className="text-xs font-medium text-muted-foreground">
            {secili ? 'En erken yol' : 'Alternatif'}
            {yol.tarih ? ` · ${dateTR(yol.tarih)}` : ''}
          </span>
        )}
      </h2>
      <ul className="mt-3 divide-y text-sm">
        {yol.sartlar.map((s) => {
          const t = sartMetni(s);
          const Icon = s.saglandi ? CheckCircle2 : XCircle;
          return (
            <li key={s.tip} className="flex items-start gap-2.5 py-2.5">
              <Icon className={cn('mt-0.5 size-4 shrink-0', s.saglandi ? 'text-result' : 'text-destructive')} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {ad[s.tip]}: {t.gerekli}
                </p>
                <p className="text-muted-foreground">
                  Mevcut: {t.mevcut} · <span className={s.saglandi ? 'text-result' : 'text-destructive'}>{t.durum}</span>
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

type Girdi = Parameters<typeof calculateEmeklilik>[0];

function tablo(r: EmeklilikResult, v: Girdi): ResultTable {
  if (r.donem === 'eyt' && v.tur === '4a') {
    const k = eytSsk[v.cinsiyet].kademeler;
    return {
      caption: `08.09.1999 öncesi 4/a kademeli prim günü tablosu (${v.cinsiyet === 'kadin' ? 'kadın' : 'erkek'})`,
      columns: ['İlk giriş tarihi', 'Gerekli prim günü', 'Sigortalılık süresi', 'Durumunuz'],
      rows: k.map((kd, i) => {
        const bas = i === 0 ? '' : dateTR(addDays(k[i - 1].until, 1));
        const son = i === k.length - 1 ? dateTR(addDays(EYT_SINIR, -1)) : dateTR(kd.until);
        const bu = v.giris <= kd.until && (i === 0 || v.giris > k[i - 1].until);
        return [
          i === 0 ? `${son} ve öncesi` : `${bas} – ${son}`,
          `${num(kd.gun, 0)} gün`,
          `${eytSsk[v.cinsiyet].sureYil} yıl`,
          bu ? '◀ Sizin kademeniz' : '',
        ];
      }),
    };
  }
  let alt = 0;
  return {
    caption: '5510 md. 28 kademeli emeklilik yaşı (01.05.2008 sonrası girişliler)',
    columns: ['Prim günü şartının tamamlandığı yıl', 'Kadın', 'Erkek', 'Durumunuz'],
    rows: yeniSistem.yasTablosu.map(([ub, k, e]) => {
      const aralik = alt === 0 ? `${ub} ve öncesi` : ub === 9999 ? `${alt} ve sonrası` : `${alt} – ${ub}`;
      const bu = r.tamamlanmaYili !== null && r.tamamlanmaYili <= ub && (alt === 0 || r.tamamlanmaYili >= alt);
      alt = ub + 1;
      return [aralik, `${k} yaş`, `${e} yaş`, bu ? '◀ Tahmini yılınız' : ''];
    }),
  };
}

function present(v: Parameters<typeof calculateEmeklilik>[0]): ResultView {
  const r = calculateEmeklilik(v);
  const gun = r.secilen.sartlar.find((s) => s.tip === 'gun')!;
  const yas = r.secilen.sartlar.find((s) => s.tip === 'yas');
  const eksikYas = r.eksikYas ? `${r.eksikYas.years} yıl ${r.eksikYas.months} ay ${r.eksikYas.days} gün` : 'Yok';
  const main = r.emekliOlabilir
    ? { label: 'Emeklilik durumu', value: 'Emekli olabilirsiniz', caption: 'Tüm şartları bugün itibarıyla sağlıyorsunuz.' }
    : r.emeklilikTarihi
      ? {
          label: 'Tahmini emeklilik tarihi',
          value: dateTR(r.emeklilikTarihi),
          caption: `${r.emeklilikYasi} yaşında · yılda ${v.yillikGun} prim günü varsayımıyla`,
        }
      : {
          label: 'Tahmini emeklilik tarihi',
          value: 'Hesaplanamadı',
          caption: 'Yıllık prim günü 0 iken eksik gün tamamlanamaz.',
        };
  return {
    main,
    status: r.eyt
      ? {
          tone: 'info',
          text: 'İlk girişiniz 08.09.1999 öncesinde: EYT kapsamındasınız, yaş şartı aranmaz; yalnız prim günü ve süre şartları gerekir.',
        }
      : r.emekliOlabilir
        ? {
            tone: 'ok',
            text: 'Yaş, prim günü ve süre şartlarının tamamını sağlıyorsunuz. SGK’ya yaşlılık aylığı için başvurabilirsiniz.',
          }
        : {
            tone: 'warn',
            text: 'EYT kapsamında değilsiniz; emeklilik için yaş ve prim günü şartlarını birlikte sağlamanız gerekir.',
          },
    rows: [
      { label: 'Uygulanan mevzuat', value: r.mevzuat, tone: 'muted' },
      { label: 'EYT kapsamında mı?', value: r.eyt ? 'Evet' : 'Hayır' },
      { label: 'Gerekli prim günü', value: `${num(gun.gerekli, 0)} gün` },
      { label: 'Eksik prim günü', value: `${num(r.eksikGun, 0)} gün`, tone: r.eksikGun ? undefined : 'plus' },
      ...(gun.saglandi || !gun.tarih ? [] : [{ label: 'Prim günü tahmini tamamlanma', value: dateTR(gun.tarih) }]),
      { label: 'Gerekli yaş', value: yas ? `${yas.gerekli}` : 'Yaş şartı yok' },
      { label: 'Eksik yaş', value: eksikYas },
      { label: 'Mevcut yaş / sigortalılık', value: `${r.mevcutYas} yaş / ${r.sigortalilikYil} yıl`, tone: 'muted' },
    ],
    extra: (
      <div className="space-y-3">
        {r.yollar.map((y) => (
          <SartKarti key={y.ad} yol={y} secili={y === r.secilen} tek={r.yollar.length === 1} />
        ))}
      </div>
    ),
    table: tablo(r, v),
    notes: [
      'Tahmin, bugünden sonra her yıl girdiğiniz kadar prim günü ödeneceği varsayımına dayanır. Borçlanma (askerlik, doğum, yurt dışı), fiili hizmet zammı, malullük, kısmi emeklilik ve 2925 sayılı Kanun kapsamı hesaba katılmaz. Kesin bilgi için SGK’dan hizmet dökümü ile teyit alın.',
    ],
  };
}

export default function EmeklilikPage() {
  return (
    <CalculatorLayout
      slug="emeklilik-hesaplama"
      schema={emeklilikSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Sigorta türünüzü, doğum ve ilk giriş tarihinizi, prim gününüzü girin; emeklilik tarihiniz tahmin edilsin."
    >
      <ChoiceField<EmeklilikInput>
        name="tur"
        label="Sigorta türü"
        help="4/a: SSK (işçi), 4/b: Bağkur (esnaf, serbest meslek), 4/c: Emekli Sandığı (memur). Birden çok statüde çalıştıysanız genellikle son 7 yılda en çok çalıştığınız statü esas alınır."
        options={[
          { value: '4a', label: '4/a SSK' },
          { value: '4b', label: '4/b Bağkur' },
          { value: '4c', label: '4/c Memur' },
        ]}
        className="sm:col-span-2"
      />
      <ChoiceField<EmeklilikInput>
        name="cinsiyet"
        label="Cinsiyet"
        options={[
          { value: 'kadin', label: 'Kadın' },
          { value: 'erkek', label: 'Erkek' },
        ]}
        className="sm:col-span-2"
      />
      <DateField<EmeklilikInput> name="dogum" label="Doğum tarihi" />
      <DateField<EmeklilikInput>
        name="giris"
        label="İlk sigorta giriş tarihi"
        help="Herhangi bir statüde (SSK, Bağkur, memur) ilk kez sigortalı olduğunuz gün. e-Devlet’teki SGK Tescil ve Hizmet Dökümü’nde yazar."
      />
      <NumberField<EmeklilikInput>
        name="primGun"
        label="Toplam prim günü"
        unit="gün"
        decimals={0}
        placeholder="Örn. 5.200"
        help="Bugüne kadar ödenmiş toplam prim gün sayınız (tüm statüler). e-Devlet’te “SGK Tescil ve Hizmet Dökümü” belgesinde görünür."
      />
      <NumberField<EmeklilikInput>
        name="yillikGun"
        label="Yıllık prim günü"
        unit="gün"
        decimals={0}
        help="Bundan sonra her yıl kaç gün prim ödeneceği. Kesintisiz tam zamanlı çalışmada 360 gündür; ara vermeyi düşünüyorsanız düşürün."
        hint="Kesintisiz çalışmada 360"
      />
    </CalculatorLayout>
  );
}
