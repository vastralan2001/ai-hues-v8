'use client';

import { useMemo, useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface UnitConvertToolProps {
  locale: Locale;
}

type UnitType = 'length' | 'weight' | 'temperature';

interface UnitDef {
  key: string;
  factor: number; // relative to base unit
  labelKey: string;
}

const UNITS: Record<UnitType, UnitDef[]> = {
  length: [
    { key: 'm', factor: 1, labelKey: 'unit.meter' },
    { key: 'km', factor: 1000, labelKey: 'unit.kilometer' },
    { key: 'cm', factor: 0.01, labelKey: 'unit.centimeter' },
    { key: 'mm', factor: 0.001, labelKey: 'unit.millimeter' },
    { key: 'in', factor: 0.0254, labelKey: 'unit.inch' },
    { key: 'ft', factor: 0.3048, labelKey: 'unit.foot' },
    { key: 'yd', factor: 0.9144, labelKey: 'unit.yard' },
    { key: 'mi', factor: 1609.344, labelKey: 'unit.mile' },
  ],
  weight: [
    { key: 'kg', factor: 1, labelKey: 'unit.kilogram' },
    { key: 'g', factor: 0.001, labelKey: 'unit.gram' },
    { key: 'mg', factor: 0.000001, labelKey: 'unit.milligram' },
    { key: 'lb', factor: 0.453592, labelKey: 'unit.pound' },
    { key: 'oz', factor: 0.0283495, labelKey: 'unit.ounce' },
  ],
  temperature: [
    { key: 'c', factor: 1, labelKey: 'unit.celsius' },
    { key: 'f', factor: 1, labelKey: 'unit.fahrenheit' },
    { key: 'k', factor: 1, labelKey: 'unit.kelvin' },
  ],
};

function convertTemperature(value: number, from: string, to: string): number {
  let celsius = value;
  if (from === 'f') celsius = (value - 32) * (5 / 9);
  if (from === 'k') celsius = value - 273.15;

  if (to === 'c') return celsius;
  if (to === 'f') return celsius * (9 / 5) + 32;
  if (to === 'k') return celsius + 273.15;
  return celsius;
}

export default function UnitConvertTool({ locale }: UnitConvertToolProps) {
  const [unitType, setUnitType] = useState<UnitType>('length');
  const [value, setValue] = useState(1);
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');

  const units = UNITS[unitType];

  const result = useMemo(() => {
    if (unitType === 'temperature') {
      return convertTemperature(value, fromUnit, toUnit);
    }
    const fromDef = units.find((u) => u.key === fromUnit);
    const toDef = units.find((u) => u.key === toUnit);
    if (!fromDef || !toDef) return 0;
    return (value * fromDef.factor) / toDef.factor;
  }, [value, fromUnit, toUnit, unitType, units]);

  const handleTypeChange = (type: UnitType) => {
    setUnitType(type);
    const first = UNITS[type][0].key;
    const second = UNITS[type][1]?.key ?? first;
    setFromUnit(first);
    setToUnit(second);
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[800px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.unit.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.unit.desc')}
        </p>

        {/* Type selector */}
        <div className='mb-6 flex gap-2'>
          {(['length', 'weight', 'temperature'] as UnitType[]).map((type) => (
            <button
              className={`rounded-[10px] px-4 py-2 text-sm font-semibold transition-colors ${
                unitType === type
                  ? 'bg-accent text-white'
                  : 'border border-border bg-surface text-foreground hover:border-accent'
              }`}
              key={type}
              onClick={() => handleTypeChange(type)}
              type='button'
            >
              {t(locale, `tool.unit.${type}`)}
            </button>
          ))}
        </div>

        {/* Value + From/To */}
        <div className='mb-4 flex flex-wrap items-center gap-3'>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.unit.value')}
            </label>
            <input
              className='h-11 w-32 rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground focus:border-accent focus:outline-none'
              onChange={(e) => setValue(Number(e.target.value))}
              type='number'
              value={value}
            />
          </div>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.unit.from')}
            </label>
            <select
              className='h-11 rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground focus:border-accent focus:outline-none'
              onChange={(e) => setFromUnit(e.target.value)}
              value={fromUnit}
            >
              {units.map((u) => (
                <option key={u.key} value={u.key}>
                  {t(locale, u.labelKey)}
                </option>
              ))}
            </select>
          </div>
          <button
            className='mt-6 rounded-[8px] border border-border bg-surface px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
            onClick={handleSwap}
            type='button'
          >
            ⇄ {t(locale, 'tool.unit.swap')}
          </button>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.unit.to')}
            </label>
            <select
              className='h-11 rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground focus:border-accent focus:outline-none'
              onChange={(e) => setToUnit(e.target.value)}
              value={toUnit}
            >
              {units.map((u) => (
                <option key={u.key} value={u.key}>
                  {t(locale, u.labelKey)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result */}
        <div className='rounded-[14px] border border-border bg-surface p-5 text-center'>
          <p className='text-xs font-semibold uppercase tracking-wider text-secondary'>
            {t(locale, 'tool.unit.result')}
          </p>
          <p className='mt-1 text-[28px] font-extrabold text-accent'>
            {Number.isFinite(result)
              ? result.toLocaleString(undefined, { maximumFractionDigits: 6 })
              : '—'}
          </p>
        </div>
      </div>
    </PageShell>
  );
}
