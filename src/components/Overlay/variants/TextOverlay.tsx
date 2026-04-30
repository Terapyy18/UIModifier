import React from 'react';
import { FormState } from '../utils';
import { ColorInput } from '../inputs';
import { FontSection, Section } from '../sections';

interface Props {
  styles: FormState;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

export const TextOverlay: React.FC<Props> = ({ styles, onChange }) => (
  <Section first>
    <ColorInput styles={styles} onChange={onChange} label="Text Color" field="color" />
    <FontSection styles={styles} onChange={onChange} />
  </Section>
);
