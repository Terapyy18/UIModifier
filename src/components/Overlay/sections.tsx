import React, { useRef } from 'react';
import { FormState } from './utils';
import {
  ColorInput, NumberInput, MeasurementInput, TextInput,
  FontFamilyInput, BIUButtons, SelectInput,
} from './inputs';

interface BaseProps {
  styles: FormState;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

const groupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  paddingTop: '8px',
  borderTop: '1px solid #f3f4f6',
};

export const Section: React.FC<{ children: React.ReactNode; first?: boolean }> = ({ children, first }) => (
  <div style={first ? { ...groupStyle, paddingTop: 0, borderTop: 'none' } : groupStyle}>
    {children}
  </div>
);

export const FontSection: React.FC<BaseProps> = ({ styles, onChange }) => (
  <>
    <FontFamilyInput styles={styles} onChange={onChange} />
    <MeasurementInput styles={styles} onChange={onChange} label="Font Size" field="fontSize" />
    <BIUButtons styles={styles} onChange={onChange} />
  </>
);

export const BorderSection: React.FC<BaseProps & { showColor?: boolean; showWidth?: boolean }> =
  ({ styles, onChange, showColor = true, showWidth = true }) => (
  <>
    {showColor && <ColorInput styles={styles} onChange={onChange} label="Border Color" field="borderColor" />}
    {showWidth && <NumberInput styles={styles} onChange={onChange} label="Border Width" field="borderWidth" />}
    <NumberInput styles={styles} onChange={onChange} label="Border Radius" field="borderRadius" />
  </>
);

export const SizeSection: React.FC<BaseProps> = ({ styles, onChange }) => (
  <>
    <MeasurementInput styles={styles} onChange={onChange} label="Width" field="width" />
    <MeasurementInput styles={styles} onChange={onChange} label="Height" field="height" />
  </>
);

export const SpacingSection: React.FC<BaseProps & { showPadding?: boolean; showMargin?: boolean }> =
  ({ styles, onChange, showPadding = true, showMargin = true }) => (
  <>
    {showPadding && <TextInput styles={styles} onChange={onChange} label="Padding" field="padding" />}
    {showMargin && <TextInput styles={styles} onChange={onChange} label="Margin" field="margin" />}
  </>
);

export const ImageSection: React.FC<BaseProps & { label?: string }> = ({ styles, onChange, label = 'Image' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        onChange('backgroundImage', `url(${dataUrl})`);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '13px' }}>
        <span style={{ color: '#374151', fontWeight: 500 }}>{label}</span>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{ padding: '4px 8px', border: '1px solid #d1d5db', background: '#f9fafb', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
        >
          Upload Image
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          accept="image/*"
        />
      </div>
      {styles.backgroundImage !== 'none' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            type="button"
            onClick={() => onChange('backgroundImage', 'none')}
            style={{ fontSize: '11px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Remove Image
          </button>
        </div>
      )}
    </div>
  );
};

export const LayoutSection: React.FC<BaseProps> = ({ styles, onChange }) => {
  const isFlex = styles.display === 'flex' || styles.display === 'inline-flex';
  return (
    <>
      <SelectInput
        styles={styles} onChange={onChange} label="Layout Display" field="display"
        options={[
          { value: 'block', label: 'Block' },
          { value: 'flex', label: 'Flex' },
          { value: 'grid', label: 'Grid' },
          { value: 'inline-block', label: 'Inline Block' },
          { value: 'inline-flex', label: 'Inline Flex' },
        ]}
      />
      {isFlex && (
        <>
          <SelectInput
            styles={styles} onChange={onChange} label="Direction" field="flexDirection"
            options={[
              { value: 'row', label: 'Row' },
              { value: 'column', label: 'Column' },
              { value: 'row-reverse', label: 'Row Reverse' },
              { value: 'column-reverse', label: 'Column Reverse' },
            ]}
          />
          <SelectInput
            styles={styles} onChange={onChange} label="Justify" field="justifyContent"
            options={[
              { value: 'flex-start', label: 'Start' },
              { value: 'center', label: 'Center' },
              { value: 'flex-end', label: 'End' },
              { value: 'space-between', label: 'Space Between' },
              { value: 'space-around', label: 'Space Around' },
              { value: 'space-evenly', label: 'Space Evenly' },
            ]}
          />
          <SelectInput
            styles={styles} onChange={onChange} label="Align Items" field="alignItems"
            options={[
              { value: 'stretch', label: 'Stretch' },
              { value: 'flex-start', label: 'Start' },
              { value: 'center', label: 'Center' },
              { value: 'flex-end', label: 'End' },
              { value: 'baseline', label: 'Baseline' },
            ]}
          />
          <MeasurementInput styles={styles} onChange={onChange} label="Gap" field="gap" />
        </>
      )}
    </>
  );
};
