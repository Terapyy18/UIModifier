import React from 'react';
import { FormState } from '../utils';
import { ColorInput } from '../inputs';
import {
  ImageSection, BorderSection, SpacingSection, SizeSection, LayoutSection, Section,
} from '../sections';

interface Props {
  styles: FormState;
  hasImage: boolean;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

export const ContainerOverlay: React.FC<Props> = ({ styles, hasImage, onChange }) => (
  <>
    <Section first>
      <ColorInput styles={styles} onChange={onChange} label="Background" field="backgroundColor" />
      {hasImage && <ImageSection styles={styles} onChange={onChange} />}
      <BorderSection styles={styles} onChange={onChange} />
    </Section>
    <Section>
      <SizeSection styles={styles} onChange={onChange} />
      <SpacingSection styles={styles} onChange={onChange} />
    </Section>
    <Section>
      <LayoutSection styles={styles} onChange={onChange} />
    </Section>
  </>
);
