import React from 'react';
import { commonFonts, FormState } from './utils';

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  fontSize: '13px',
};

const labelStyle: React.CSSProperties = { color: '#374151', fontWeight: 500 };

interface BaseProps {
  styles: FormState;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

export const ColorInput: React.FC<BaseProps & {
  label: string;
  field: 'color' | 'backgroundColor' | 'borderColor';
}> = ({ styles, onChange, label, field }) => (
  <div style={rowStyle}>
    <span style={labelStyle}>{label}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%',
        overflow: 'hidden', border: '1px solid #d1d5db', flexShrink: 0,
      }}>
        <input
          type="color"
          value={styles[field]?.startsWith('#') ? styles[field].substring(0, 7) : '#000000'}
          onChange={(e) => onChange(field, e.target.value)}
          style={{
            cursor: 'pointer', padding: 0, border: 'none', background: 'none',
            width: '150%', height: '150%', transform: 'translate(-25%, -25%)',
          }}
        />
      </div>
    </div>
  </div>
);

export const NumberInput: React.FC<BaseProps & {
  label: string;
  field: 'borderWidth' | 'borderRadius';
}> = ({ styles, onChange, label, field }) => (
  <div style={rowStyle}>
    <span style={labelStyle}>{label}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <input
        type="number"
        value={styles[field]}
        onChange={(e) => onChange(field, parseInt(e.target.value) || 0)}
        style={{ width: '50px', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px' }}
      />
      <span style={{ color: '#6b7280', fontSize: '12px' }}>px</span>
    </div>
  </div>
);

export const MeasurementInput: React.FC<BaseProps & {
  label: string;
  field: 'width' | 'height' | 'fontSize' | 'gap';
}> = ({ styles, onChange, label, field }) => {
  const value = styles[field].toString();
  const numPart = parseInt(value) || 0;
  const unitPart = value.replace(/[0-9.-]/g, '') || 'px';

  return (
    <div style={rowStyle}>
      <span style={labelStyle}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <input
          type="number"
          value={numPart}
          onChange={(e) => onChange(field, `${e.target.value}${unitPart}`)}
          style={{ width: '50px', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px' }}
        />
        <select
          value={unitPart}
          onChange={(e) => onChange(field, `${numPart}${e.target.value}`)}
          style={{ padding: '2px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '11px' }}
        >
          <option value="px">px</option>
          <option value="rem">rem</option>
          <option value="em">em</option>
          <option value="%">%</option>
          <option value="vh">vh</option>
          <option value="vw">vw</option>
        </select>
      </div>
    </div>
  );
};

export const TextInput: React.FC<BaseProps & {
  label: string;
  field: 'padding' | 'margin';
}> = ({ styles, onChange, label, field }) => (
  <div style={rowStyle}>
    <span style={labelStyle}>{label}</span>
    <input
      type="text"
      value={styles[field]}
      onChange={(e) => onChange(field, e.target.value)}
      style={{ width: '100px', padding: '4px 6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
    />
  </div>
);

export const FontFamilyInput: React.FC<BaseProps> = ({ styles, onChange }) => (
  <div style={rowStyle}>
    <span style={labelStyle}>Font Family</span>
    <select
      value={styles.fontFamily}
      onChange={(e) => onChange('fontFamily', e.target.value)}
      style={{ width: '120px', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
    >
      {commonFonts.map(font => <option key={font} value={font}>{font}</option>)}
    </select>
  </div>
);

export const BIUButtons: React.FC<BaseProps> = ({ styles, onChange }) => {
  const isBold = styles.fontWeight === 'bold' || parseInt(styles.fontWeight.toString()) >= 700;
  const isItalic = styles.fontStyle === 'italic';
  const isUnderline = styles.textDecoration.includes('underline');

  return (
    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
      <button
        type="button"
        onClick={() => onChange('fontWeight', isBold ? 'normal' : 'bold')}
        style={{
          flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db',
          background: isBold ? '#e5e7eb' : 'white', fontWeight: 'bold', cursor: 'pointer',
        }}
      >B</button>
      <button
        type="button"
        onClick={() => onChange('fontStyle', isItalic ? 'normal' : 'italic')}
        style={{
          flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db',
          background: isItalic ? '#e5e7eb' : 'white', fontStyle: 'italic', cursor: 'pointer',
        }}
      >I</button>
      <button
        type="button"
        onClick={() => onChange('textDecoration', isUnderline ? 'none' : 'underline')}
        style={{
          flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db',
          background: isUnderline ? '#e5e7eb' : 'white', textDecoration: 'underline', cursor: 'pointer',
        }}
      >U</button>
    </div>
  );
};

export const SelectInput: React.FC<BaseProps & {
  label: string;
  field: 'display' | 'flexDirection' | 'justifyContent' | 'alignItems';
  options: { value: string; label: string }[];
}> = ({ styles, onChange, label, field, options }) => (
  <div style={rowStyle}>
    <span style={labelStyle}>{label}</span>
    <select
      value={styles[field]}
      onChange={(e) => onChange(field, e.target.value)}
      style={{ width: '100px', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);
