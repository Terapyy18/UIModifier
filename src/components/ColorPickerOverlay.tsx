import React, { useState, useEffect, useRef } from 'react';
import { ElementStyles } from '../hooks/useElementInspector';

interface Position {
  x: number;
  y: number;
}

interface ColorPickerOverlayProps {
  element: HTMLElement | null;
  elementType: 'text' | 'button';
  currentStyles: ElementStyles;
  position: Position;
  onChange: (styles: Partial<ElementStyles>) => void;
  onApply: () => void;
  onCancel: () => void;
  onReset: () => ElementStyles | void | null;
}

const rgbToHex = (color: string) => {
  if (!color || color === 'transparent') return '#ffffff00';
  if (color.startsWith('#')) return color;
  const match = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return '#000000';
  const r = parseInt(match[1]).toString(16).padStart(2, '0');
  const g = parseInt(match[2]).toString(16).padStart(2, '0');
  const b = parseInt(match[3]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
};

const commonFonts = [
  'system-ui',
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Arial',
  'Helvetica',
  'Verdana',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Monospace',
  'Serif',
  'Sans-serif'
];

export const ColorPickerOverlay: React.FC<ColorPickerOverlayProps> = ({
  element,
  elementType,
  currentStyles,
  position,
  onChange,
  onApply,
  onCancel,
  onReset,
}) => {
  const [styles, setStyles] = useState({
    color: rgbToHex(currentStyles.color),
    backgroundColor: rgbToHex(currentStyles.backgroundColor),
    borderColor: rgbToHex(currentStyles.borderColor),
    borderWidth: parseInt(currentStyles.borderWidth) || 0,
    borderRadius: parseInt(currentStyles.borderRadius) || 0,
    padding: currentStyles.padding || '10px 20px',
    width: currentStyles.width || 'auto',
    height: currentStyles.height || 'auto',
    fontSize: currentStyles.fontSize || '16px',
    fontFamily: currentStyles.fontFamily?.split(',')[0].replace(/['"]/g, '') || 'system-ui',
    fontWeight: currentStyles.fontWeight || 'normal',
    fontStyle: currentStyles.fontStyle || 'normal',
    textDecoration: currentStyles.textDecoration || 'none',
  });

  const [profiles, setProfiles] = useState<Record<string, Partial<ElementStyles>>>({});
  const [newProfileName, setNewProfileName] = useState('');
  const [showProfileInput, setShowProfileInput] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['uiModifierProfiles'], (result) => {
        if (result.uiModifierProfiles) {
          setProfiles(result.uiModifierProfiles);
        }
      });
    }
  }, []);

  useEffect(() => {
    setStyles({
      color: rgbToHex(currentStyles.color),
      backgroundColor: rgbToHex(currentStyles.backgroundColor),
      borderColor: rgbToHex(currentStyles.borderColor),
      borderWidth: parseInt(currentStyles.borderWidth) || 0,
      borderRadius: parseInt(currentStyles.borderRadius) || 0,
      padding: currentStyles.padding || '10px 20px',
      width: currentStyles.width || 'auto',
      height: currentStyles.height || 'auto',
      fontSize: currentStyles.fontSize || '16px',
      fontFamily: currentStyles.fontFamily?.split(',')[0].replace(/['"]/g, '') || 'system-ui',
      fontWeight: currentStyles.fontWeight || 'normal',
      fontStyle: currentStyles.fontStyle || 'normal',
      textDecoration: currentStyles.textDecoration?.includes('underline') ? 'underline' : 'none',
    });
  }, [currentStyles]);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      let newX = position.x + 20;
      let newY = position.y + 20;

      if (newX + rect.width > window.innerWidth) {
        newX = position.x - rect.width - 10;
      }
      if (newY + rect.height > window.innerHeight) {
        newY = position.y - rect.height - 10;
      }
      
      newX = Math.max(0, newX);
      newY = Math.max(0, newY);

      setAdjustedPosition({ x: newX, y: newY });
    }
  }, [position]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && containerRef.current.contains(e.target as Node)) {
        return;
      }
      onCancel();
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel]);

  const handleApply = () => {
    onApply();
  };

  const handleReset = () => {
    if (selectRef.current) {
      selectRef.current.value = "";
    }
    
    const restoredStyles = onReset();
    
    if (restoredStyles) {
      setStyles({
        color: rgbToHex(restoredStyles.color),
        backgroundColor: rgbToHex(restoredStyles.backgroundColor),
        borderColor: rgbToHex(restoredStyles.borderColor),
        borderWidth: parseInt(restoredStyles.borderWidth) || 0,
        borderRadius: parseInt(restoredStyles.borderRadius) || 0,
        padding: restoredStyles.padding || '10px 20px',
        width: restoredStyles.width || 'auto',
        height: restoredStyles.height || 'auto',
        fontSize: restoredStyles.fontSize || '16px',
        fontFamily: restoredStyles.fontFamily?.split(',')[0].replace(/['"]/g, '') || 'system-ui',
        fontWeight: restoredStyles.fontWeight || 'normal',
        fontStyle: restoredStyles.fontStyle || 'normal',
        textDecoration: restoredStyles.textDecoration?.includes('underline') ? 'underline' : 'none',
      });
    } else {
      setStyles({
        color: rgbToHex(currentStyles.color),
        backgroundColor: rgbToHex(currentStyles.backgroundColor),
        borderColor: rgbToHex(currentStyles.borderColor),
        borderWidth: parseInt(currentStyles.borderWidth) || 0,
        borderRadius: parseInt(currentStyles.borderRadius) || 0,
        padding: currentStyles.padding || '10px 20px',
        width: currentStyles.width || 'auto',
        height: currentStyles.height || 'auto',
        fontSize: currentStyles.fontSize || '16px',
        fontFamily: currentStyles.fontFamily?.split(',')[0].replace(/['"]/g, '') || 'system-ui',
        fontWeight: currentStyles.fontWeight || 'normal',
        fontStyle: currentStyles.fontStyle || 'normal',
        textDecoration: currentStyles.textDecoration?.includes('underline') ? 'underline' : 'none',
      });
    }
  };

  const handleChange = (key: keyof typeof styles, value: any) => {
    const newStyles = { ...styles, [key]: value };
    setStyles(newStyles);
    
    const payload: any = {
      color: newStyles.color,
      fontSize: newStyles.fontSize,
      fontFamily: newStyles.fontFamily,
      fontWeight: newStyles.fontWeight,
      fontStyle: newStyles.fontStyle,
      textDecoration: newStyles.textDecoration,
    };

    if (elementType === 'button') {
      payload.backgroundColor = newStyles.backgroundColor;
      payload.borderColor = newStyles.borderColor;
      payload.borderWidth = `${newStyles.borderWidth}px`;
      payload.borderRadius = `${newStyles.borderRadius}px`;
      payload.padding = newStyles.padding;
      payload.width = newStyles.width;
      payload.height = newStyles.height;
    }

    onChange(payload);
  };

  const handleSaveProfile = () => {
    if (!newProfileName.trim()) {
      setShowProfileInput(!showProfileInput);
      return;
    }
    const profileData: any = {
      color: styles.color,
      fontSize: styles.fontSize,
      fontFamily: styles.fontFamily,
      fontWeight: styles.fontWeight,
      fontStyle: styles.fontStyle,
      textDecoration: styles.textDecoration,
    };

    if (elementType === 'button') {
      profileData.backgroundColor = styles.backgroundColor;
      profileData.borderColor = styles.borderColor;
      profileData.borderWidth = `${styles.borderWidth}px`;
      profileData.borderRadius = `${styles.borderRadius}px`;
      profileData.padding = styles.padding;
      profileData.width = styles.width;
      profileData.height = styles.height;
    }
    
    const updatedProfiles = { ...profiles, [newProfileName]: profileData };
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ uiModifierProfiles: updatedProfiles });
    }
    setProfiles(updatedProfiles);
    
    setTimeout(() => {
      if (selectRef.current) {
        selectRef.current.value = newProfileName;
      }
    }, 0);
    
    setNewProfileName('');
    setShowProfileInput(false);
  };

  const handleLoadProfile = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    if (!name || !profiles[name]) return;
    
    const p = profiles[name];
    const newStyles = {
      ...styles,
      color: p.color ? rgbToHex(p.color) : styles.color,
      backgroundColor: p.backgroundColor ? rgbToHex(p.backgroundColor) : styles.backgroundColor,
      borderColor: p.borderColor ? rgbToHex(p.borderColor) : styles.borderColor,
      borderWidth: p.borderWidth ? parseInt(p.borderWidth) : styles.borderWidth,
      borderRadius: p.borderRadius ? parseInt(p.borderRadius) : styles.borderRadius,
      padding: p.padding || styles.padding,
      width: p.width || styles.width,
      height: p.height || styles.height,
      fontSize: p.fontSize || styles.fontSize,
      fontFamily: p.fontFamily || styles.fontFamily,
      fontWeight: p.fontWeight || styles.fontWeight,
      fontStyle: p.fontStyle || styles.fontStyle,
      textDecoration: p.textDecoration || styles.textDecoration,
    };
    
    setStyles(newStyles);
    onChange(p);
  };

  if (!element) return null;

  const renderColorInput = (label: string, key: 'color' | 'backgroundColor' | 'borderColor') => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '13px' }}>
      <span style={{ color: '#374151', fontWeight: 500 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #d1d5db', flexShrink: 0 }}>
          <input 
            type="color" 
            value={styles[key]?.startsWith('#') ? styles[key].substring(0, 7) : '#000000'} 
            onChange={(e) => handleChange(key, e.target.value)}
            style={{ cursor: 'pointer', padding: 0, border: 'none', background: 'none', width: '150%', height: '150%', transform: 'translate(-25%, -25%)' }}
          />
        </div>
      </div>
    </div>
  );

  const renderNumberInput = (label: string, key: 'borderWidth' | 'borderRadius') => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '13px' }}>
      <span style={{ color: '#374151', fontWeight: 500 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <input 
          type="number" 
          value={styles[key]} 
          onChange={(e) => handleChange(key, parseInt(e.target.value) || 0)}
          style={{ width: '50px', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px' }}
        />
        <span style={{ color: '#6b7280', fontSize: '12px' }}>px</span>
      </div>
    </div>
  );

  const renderMeasurementInput = (label: string, key: 'width' | 'height' | 'fontSize') => {
    const value = styles[key].toString();
    const numPart = parseInt(value) || 0;
    const unitPart = value.replace(/[0-9.]/g, '') || 'px';

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '13px' }}>
        <span style={{ color: '#374151', fontWeight: 500 }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input 
            type="number" 
            value={numPart} 
            onChange={(e) => handleChange(key, `${e.target.value}${unitPart}`)}
            style={{ width: '50px', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px' }}
          />
          <select 
            value={unitPart}
            onChange={(e) => handleChange(key, `${numPart}${e.target.value}`)}
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

  const renderTextInput = (label: string, key: 'padding') => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '13px' }}>
      <span style={{ color: '#374151', fontWeight: 500 }}>{label}</span>
      <input 
        type="text" 
        value={styles[key]} 
        onChange={(e) => handleChange(key, e.target.value)}
        style={{ width: '100px', padding: '4px 6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
      />
    </div>
  );

  return (
    <div
      ref={containerRef}
      data-ui-modifier-picker="true"
      style={{
        position: 'fixed',
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        zIndex: 2147483647,
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        width: '280px',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}
    >
      <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', paddingBottom: '8px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {elementType === 'button' ? 'Button Styles' : 'Text Styles'}
        <button 
          type="button"
          onClick={handleReset}
          style={{ padding: '2px 6px', fontSize: '11px', cursor: 'pointer', border: '1px solid #d1d5db', background: '#f3f4f6', color: '#4b5563', borderRadius: '4px' }}
        >
          Reset
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '8px', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <select 
            ref={selectRef}
            onChange={handleLoadProfile}
            defaultValue=""
            style={{ flex: 1, padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', outline: 'none' }}
          >
            <option value="" disabled>Load Profile...</option>
            {Object.keys(profiles).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <button 
            type="button"
            onClick={handleSaveProfile}
            style={{ padding: '4px 8px', cursor: 'pointer', border: '1px solid #d1d5db', background: showProfileInput ? '#3b82f6' : '#f9fafb', color: showProfileInput ? 'white' : '#374151', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}
          >
            {showProfileInput ? 'Save' : 'New'}
          </button>
        </div>
        {showProfileInput && (
          <input
            type="text"
            placeholder="Enter profile name..."
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveProfile()}
            style={{ width: '100%', padding: '4px 6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }}
            autoFocus
          />
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {renderColorInput('Text Color', 'color')}
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '13px' }}>
          <span style={{ color: '#374151', fontWeight: 500 }}>Font Family</span>
          <select 
            value={styles.fontFamily}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
            style={{ width: '120px', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
          >
            {commonFonts.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        {renderMeasurementInput('Font Size', 'fontSize')}

        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
          <button
            type="button"
            onClick={() => handleChange('fontWeight', styles.fontWeight === 'bold' || parseInt(styles.fontWeight.toString()) >= 700 ? 'normal' : 'bold')}
            style={{ 
              flex: 1, 
              padding: '6px', 
              borderRadius: '4px', 
              border: '1px solid #d1d5db', 
              background: (styles.fontWeight === 'bold' || parseInt(styles.fontWeight.toString()) >= 700) ? '#e5e7eb' : 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => handleChange('fontStyle', styles.fontStyle === 'italic' ? 'normal' : 'italic')}
            style={{ 
              flex: 1, 
              padding: '6px', 
              borderRadius: '4px', 
              border: '1px solid #d1d5db', 
              background: styles.fontStyle === 'italic' ? '#e5e7eb' : 'white',
              fontStyle: 'italic',
              cursor: 'pointer'
            }}
          >
            I
          </button>
          <button
            type="button"
            onClick={() => handleChange('textDecoration', styles.textDecoration.includes('underline') ? 'none' : 'underline')}
            style={{ 
              flex: 1, 
              padding: '6px', 
              borderRadius: '4px', 
              border: '1px solid #d1d5db', 
              background: styles.textDecoration.includes('underline') ? '#e5e7eb' : 'white',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            U
          </button>
        </div>
      </div>
      
      {elementType === 'button' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '8px', borderTop: '1px solid #f3f4f6' }}>
          {renderColorInput('Background', 'backgroundColor')}
          {renderColorInput('Border Color', 'borderColor')}
          {renderNumberInput('Border Width', 'borderWidth')}
          {renderNumberInput('Border Radius', 'borderRadius')}
          {renderMeasurementInput('Width', 'width')}
          {renderMeasurementInput('Height', 'height')}
          {renderTextInput('Padding', 'padding')}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
        <button 
          type="button"
          onClick={onCancel}
          style={{ padding: '6px 12px', cursor: 'pointer', border: '1px solid #d1d5db', background: '#ffffff', color: '#374151', borderRadius: '6px', fontSize: '13px', fontWeight: 500 }}
        >
          Cancel
        </button>
        <button 
          type="button"
          onClick={handleApply}
          style={{ padding: '6px 12px', cursor: 'pointer', border: 'none', background: '#3b82f6', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: 500 }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};
