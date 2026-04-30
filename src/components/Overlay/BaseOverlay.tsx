import React, { useEffect, useRef, useState } from 'react';
import { ElementType, ElementStyles } from '../../hooks/useElementInspector';
import { profilesItem } from '../../../utils/storage';

interface Position { x: number; y: number; }

interface BaseOverlayProps {
  elementType: ElementType;
  position: Position;
  profiles: Record<string, Partial<ElementStyles>>;
  selectRef: React.RefObject<HTMLSelectElement | null>;
  newProfileName: string;
  showProfileInput: boolean;
  setProfiles: (p: Record<string, Partial<ElementStyles>>) => void;
  setNewProfileName: (s: string) => void;
  setShowProfileInput: (b: boolean) => void;
  onLoadProfile: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSaveProfile: () => void;
  onReset: () => void;
  onApply: () => void;
  onCancel: () => void;
  onHide: () => void;
  children: React.ReactNode;
}

export const BaseOverlay: React.FC<BaseOverlayProps> = ({
  elementType, position, profiles, selectRef,
  newProfileName, showProfileInput,
  setNewProfileName, setShowProfileInput,
  onLoadProfile, onSaveProfile, onReset, onApply, onCancel, onHide,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      let newX = position.x + 20;
      let newY = position.y + 20;
      if (newX + rect.width > window.innerWidth) newX = position.x - rect.width - 10;
      if (newY + rect.height > window.innerHeight) newY = position.y - rect.height - 10;
      newX = Math.max(0, newX);
      newY = Math.max(0, newY);
      setAdjustedPosition({ x: newX, y: newY });
    }
  }, [position]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && containerRef.current.contains(e.target as Node)) return;
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
        overflowY: 'auto',
      }}
    >
      <div style={{
        fontSize: '14px', fontWeight: 600, color: '#111827',
        paddingBottom: '8px', borderBottom: '1px solid #f3f4f6',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {elementType.charAt(0).toUpperCase() + elementType.slice(1)} Styles
        </span>
        <button
          type="button"
          onClick={onReset}
          style={{ padding: '2px 6px', fontSize: '11px', cursor: 'pointer', border: '1px solid #d1d5db', background: '#f3f4f6', color: '#4b5563', borderRadius: '4px' }}
        >
          Reset
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '8px', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <select
            ref={selectRef}
            onChange={onLoadProfile}
            defaultValue=""
            style={{ flex: 1, padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', outline: 'none' }}
          >
            <option value="" disabled>Load Profile...</option>
            {Object.keys(profiles).map(name => <option key={name} value={name}>{name}</option>)}
          </select>
          <button
            type="button"
            onClick={onSaveProfile}
            style={{
              padding: '4px 8px', cursor: 'pointer', border: '1px solid #d1d5db',
              background: showProfileInput ? '#3b82f6' : '#f9fafb',
              color: showProfileInput ? 'white' : '#374151',
              borderRadius: '4px', fontSize: '12px', fontWeight: 500,
            }}
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
            onKeyDown={(e) => e.key === 'Enter' && onSaveProfile()}
            style={{ width: '100%', padding: '4px 6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }}
            autoFocus
          />
        )}
      </div>

      {children}

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f3f4f6' }}>
        <button
          type="button"
          onClick={onHide}
          style={{ padding: '6px 12px', cursor: 'pointer', border: '1px solid #ef4444', background: '#fef2f2', color: '#ef4444', borderRadius: '6px', fontSize: '13px', fontWeight: 500, marginRight: 'auto' }}
        >
          Hide
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{ padding: '6px 12px', cursor: 'pointer', border: '1px solid #d1d5db', background: '#ffffff', color: '#374151', borderRadius: '6px', fontSize: '13px', fontWeight: 500 }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onApply}
          style={{ padding: '6px 12px', cursor: 'pointer', border: 'none', background: '#3b82f6', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: 500 }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export { profilesItem };
