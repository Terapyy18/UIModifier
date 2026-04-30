import React from 'react';
import { FormState } from '../utils';
import { ColorInput, MeasurementInput } from '../inputs';
import { ImageSection, SpacingSection, Section } from '../sections';

interface Props {
  styles: FormState;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

export const IconOverlay: React.FC<Props> = ({ styles, onChange }) => (
  <>
    <Section first>
      <ColorInput styles={styles} onChange={onChange} label="Icon Color" field="color" />
      <MeasurementInput styles={styles} onChange={onChange} label="Icon Size" field="fontSize" />
    </Section>
    <Section>
      <ImageSection styles={styles} onChange={onChange} label="Icon Image" />
    </Section>
    <Section>
      <SpacingSection styles={styles} onChange={onChange} showPadding={false} />
    </Section>
  </>
);
