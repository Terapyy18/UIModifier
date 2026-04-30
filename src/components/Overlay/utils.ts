import { ElementStyles, ElementType } from '../../hooks/useElementInspector';

export const commonFonts = [
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
  'Sans-serif',
];

export const rgbToHex = (color: string) => {
  if (!color || color === 'transparent') return '#ffffff00';
  if (color.startsWith('#')) return color;
  const match = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!match) return '#000000';
  const r = parseInt(match[1]).toString(16).padStart(2, '0');
  const g = parseInt(match[2]).toString(16).padStart(2, '0');
  const b = parseInt(match[3]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
};

export const toFormState = (s: Partial<ElementStyles>) => ({
  color: rgbToHex(s.color || ''),
  backgroundColor: rgbToHex(s.backgroundColor || ''),
  borderColor: rgbToHex(s.borderColor || ''),
  borderWidth: parseInt(s.borderWidth as string) || 0,
  borderRadius: parseInt(s.borderRadius as string) || 0,
  padding: s.padding || '10px 20px',
  margin: s.margin || '0px',
  width: s.width || 'auto',
  height: s.height || 'auto',
  fontSize: s.fontSize || '16px',
  fontFamily: s.fontFamily?.split(',')[0].replace(/['"]/g, '') || 'system-ui',
  fontWeight: s.fontWeight || 'normal',
  fontStyle: s.fontStyle || 'normal',
  textDecoration: s.textDecoration?.includes('underline') ? 'underline' : 'none',
  backgroundImage: s.backgroundImage || 'none',
  display: s.display || 'block',
  flexDirection: s.flexDirection || 'row',
  justifyContent: s.justifyContent || 'flex-start',
  alignItems: s.alignItems || 'stretch',
  gap: s.gap || '0px',
});

export type FormState = ReturnType<typeof toFormState>;
export type FormKey = keyof FormState;

export const VARIANT_KEYS: Record<ElementType, FormKey[]> = {
  text: ['color', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'textDecoration'],
  image: ['width', 'height', 'borderColor', 'borderWidth', 'borderRadius', 'margin', 'backgroundImage'],
  icon: ['color', 'fontSize', 'backgroundImage', 'margin'],
  button: [
    'color', 'backgroundColor', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'textDecoration',
    'borderColor', 'borderWidth', 'borderRadius', 'padding', 'margin', 'width', 'height',
  ],
  link: [
    'color', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'textDecoration',
    'backgroundColor', 'borderRadius', 'padding',
  ],
  container: [
    'backgroundColor', 'backgroundImage', 'borderColor', 'borderWidth', 'borderRadius',
    'padding', 'margin', 'width', 'height',
    'display', 'flexDirection', 'justifyContent', 'alignItems', 'gap',
  ],
};

const PIXEL_KEYS = new Set<FormKey>(['borderWidth', 'borderRadius']);

export const buildPayload = (styles: FormState, elementType: ElementType): Record<string, any> => {
  const payload: any = {};
  for (const key of VARIANT_KEYS[elementType]) {
    const value = styles[key];
    payload[key] = PIXEL_KEYS.has(key) ? `${value}px` : value;
  }
  return payload;
};

export const mergeProfile = (
  current: FormState,
  profile: Partial<ElementStyles>,
): FormState => ({
  ...current,
  color: profile.color ? rgbToHex(profile.color) : current.color,
  backgroundColor: profile.backgroundColor ? rgbToHex(profile.backgroundColor) : current.backgroundColor,
  borderColor: profile.borderColor ? rgbToHex(profile.borderColor) : current.borderColor,
  borderWidth: profile.borderWidth ? parseInt(profile.borderWidth) : current.borderWidth,
  borderRadius: profile.borderRadius ? parseInt(profile.borderRadius) : current.borderRadius,
  padding: profile.padding || current.padding,
  margin: profile.margin || current.margin,
  width: profile.width || current.width,
  height: profile.height || current.height,
  fontSize: profile.fontSize || current.fontSize,
  fontFamily: profile.fontFamily || current.fontFamily,
  fontWeight: profile.fontWeight || current.fontWeight,
  fontStyle: profile.fontStyle || current.fontStyle,
  textDecoration: profile.textDecoration || current.textDecoration,
  backgroundImage: profile.backgroundImage || current.backgroundImage,
  display: profile.display || current.display,
  flexDirection: profile.flexDirection || current.flexDirection,
  justifyContent: profile.justifyContent || current.justifyContent,
  alignItems: profile.alignItems || current.alignItems,
  gap: profile.gap || current.gap,
});
