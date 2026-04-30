import React from 'react';
import { FormState } from '../utils';
import { ColorInput } from '../inputs';
import { FontSection, BorderSection, SpacingSection, SizeSection, Section } from '../sections';

interface Props {
  styles: FormState;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

export const ButtonOverlay: React.FC<Props> = ({ styles, onChange }) => (
  <>
    <Section first>
      <ColorInput styles={styles} onChange={onChange} label="Text Color" field="color" />
      <FontSection styles={styles} onChange={onChange} />
    </Section>
    <Section>
      <ColorInput styles={styles} onChange={onChange} label="Background" field="backgroundColor" />
      <BorderSection styles={styles} onChange={onChange} />
    </Section>
    <Section>
      <SizeSection styles={styles} onChange={onChange} />
      <SpacingSection styles={styles} onChange={onChange} />
    </Section>
  </>
);
