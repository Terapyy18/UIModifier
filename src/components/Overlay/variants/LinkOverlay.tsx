import React from 'react';
import { FormState } from '../utils';
import { ColorInput, NumberInput, TextInput } from '../inputs';
import { FontSection, Section } from '../sections';

interface Props {
  styles: FormState;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

export const LinkOverlay: React.FC<Props> = ({ styles, onChange }) => (
  <>
    <Section first>
      <ColorInput styles={styles} onChange={onChange} label="Link Color" field="color" />
      <FontSection styles={styles} onChange={onChange} />
    </Section>
    <Section>
      <ColorInput styles={styles} onChange={onChange} label="Background" field="backgroundColor" />
      <NumberInput styles={styles} onChange={onChange} label="Border Radius" field="borderRadius" />
      <TextInput styles={styles} onChange={onChange} label="Padding" field="padding" />
    </Section>
  </>
);
