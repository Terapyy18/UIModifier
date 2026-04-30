import React from 'react';
import { FormState } from '../utils';
import { ImageSection, SizeSection, BorderSection, SpacingSection, Section } from '../sections';

interface Props {
  styles: FormState;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

export const ImageOverlay: React.FC<Props> = ({ styles, onChange }) => (
  <>
    <Section first>
      <ImageSection styles={styles} onChange={onChange} label="Replace Image" />
    </Section>
    <Section>
      <SizeSection styles={styles} onChange={onChange} />
    </Section>
    <Section>
      <BorderSection styles={styles} onChange={onChange} />
    </Section>
    <Section>
      <SpacingSection styles={styles} onChange={onChange} showPadding={false} />
    </Section>
  </>
);
