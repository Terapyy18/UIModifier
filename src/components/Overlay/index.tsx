import React, { useEffect, useRef, useState } from 'react';
import { ElementStyles, ElementType } from '../../hooks/useElementInspector';
import { profilesItem } from '../../../utils/storage';
import { BaseOverlay } from './BaseOverlay';
import { buildPayload, FormState, mergeProfile, toFormState } from './utils';
import { TextOverlay } from './variants/TextOverlay';
import { ImageOverlay } from './variants/ImageOverlay';
import { IconOverlay } from './variants/IconOverlay';
import { ButtonOverlay } from './variants/ButtonOverlay';
import { LinkOverlay } from './variants/LinkOverlay';
import { ContainerOverlay } from './variants/ContainerOverlay';

interface Position { x: number; y: number; }

interface OverlayProps {
  element: HTMLElement | null;
  elementType: ElementType;
  hasImage: boolean;
  currentStyles: ElementStyles;
  position: Position;
  onChange: (styles: Partial<ElementStyles>) => void;
  onApply: () => void;
  onCancel: () => void;
  onReset: () => ElementStyles | void | null;
  onHide: () => void;
}

const renderVariant = (
  elementType: ElementType,
  styles: FormState,
  hasImage: boolean,
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void,
) => {
  switch (elementType) {
    case 'text':      return <TextOverlay styles={styles} onChange={onChange} />;
    case 'image':     return <ImageOverlay styles={styles} onChange={onChange} />;
    case 'icon':      return <IconOverlay styles={styles} onChange={onChange} />;
    case 'button':    return <ButtonOverlay styles={styles} onChange={onChange} />;
    case 'link':      return <LinkOverlay styles={styles} onChange={onChange} />;
    case 'container': return <ContainerOverlay styles={styles} hasImage={hasImage} onChange={onChange} />;
  }
};

export const Overlay: React.FC<OverlayProps> = ({
  element, elementType, hasImage, currentStyles, position,
  onChange, onApply, onCancel, onReset, onHide,
}) => {
  const [styles, setStyles] = useState<FormState>(toFormState(currentStyles));
  const [profiles, setProfiles] = useState<Record<string, Partial<ElementStyles>>>({});
  const [newProfileName, setNewProfileName] = useState('');
  const [showProfileInput, setShowProfileInput] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    profilesItem.getValue().then(setProfiles);
  }, []);

  useEffect(() => {
    setStyles(toFormState(currentStyles));
  }, [currentStyles]);

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    const newStyles = { ...styles, [key]: value };
    setStyles(newStyles);
    onChange(buildPayload(newStyles, elementType));
  };

  const handleReset = () => {
    if (selectRef.current) selectRef.current.value = '';
    const restored = onReset();
    setStyles(toFormState((restored as Partial<ElementStyles>) || currentStyles));
  };

  const handleSaveProfile = () => {
    if (!newProfileName.trim()) {
      setShowProfileInput(!showProfileInput);
      return;
    }
    const profileData = buildPayload(styles, elementType);
    const updated = { ...profiles, [newProfileName]: profileData };
    profilesItem.setValue(updated);
    setProfiles(updated);
    setTimeout(() => {
      if (selectRef.current) selectRef.current.value = newProfileName;
    }, 0);
    setNewProfileName('');
    setShowProfileInput(false);
  };

  const handleLoadProfile = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    if (!name || !profiles[name]) return;
    const p = profiles[name];
    setStyles(mergeProfile(styles, p));
    onChange(p);
  };

  if (!element) return null;

  return (
    <BaseOverlay
      elementType={elementType}
      position={position}
      profiles={profiles}
      selectRef={selectRef}
      newProfileName={newProfileName}
      showProfileInput={showProfileInput}
      setProfiles={setProfiles}
      setNewProfileName={setNewProfileName}
      setShowProfileInput={setShowProfileInput}
      onLoadProfile={handleLoadProfile}
      onSaveProfile={handleSaveProfile}
      onReset={handleReset}
      onApply={onApply}
      onCancel={onCancel}
      onHide={onHide}
    >
      {renderVariant(elementType, styles, hasImage, handleChange)}
    </BaseOverlay>
  );
};
