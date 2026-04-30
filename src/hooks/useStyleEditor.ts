import { useState, useRef, useEffect } from 'react';
import { ElementStyles } from './useElementInspector';
import { modsItem } from '../../utils/storage';

interface UseStyleEditorProps {
  element: HTMLElement | null;
  currentStyles: ElementStyles;
  selector: string;
  clearSelection: () => void;
}

export const useStyleEditor = ({ element, currentStyles, selector, clearSelection }: UseStyleEditorProps) => {
  const [initialInlineStyles, setInitialInlineStyles] = useState<any>(null);
  const latestStylesRef = useRef<any>(null);

  // Store the absolute original inline styles of elements the very first time they are clicked
  const originalStylesMapRef = useRef(new WeakMap<HTMLElement, any>());
  const originalStylesMap = originalStylesMapRef.current;

  useEffect(() => {
    if (element) {
      // 1. Save absolute original styles for the 'Reset' feature (only once per element)
      if (!originalStylesMap.has(element)) {
        const styles: any = {};
        for (const key in currentStyles) {
          styles[key] = (element.style as any)[key];
        }
        originalStylesMap.set(element, styles);
      }

      // 2. Save current state for the 'Cancel' feature (every time it's opened)
      const styles: any = {};
      for (const key in currentStyles) {
        styles[key] = (element.style as any)[key];
      }
      setInitialInlineStyles(styles);
      latestStylesRef.current = null;
    } else {
      setInitialInlineStyles(null);
    }
  }, [element, currentStyles, originalStylesMap]);

  const saveModifications = async (stylesToSave: any) => {
    if (!selector) return;
    const pageKey = window.location.hostname + window.location.pathname;
    const mods = await modsItem.getValue();
    if (!mods[pageKey]) mods[pageKey] = {};
    mods[pageKey][selector] = { ...(mods[pageKey][selector] ?? {}), ...stylesToSave };
    await modsItem.setValue(mods);
  };

  const handlePreview = (styles: Partial<typeof currentStyles>) => {
    latestStylesRef.current = styles;
    if (element) {
      Object.entries(styles).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'backgroundImage') {
            if (element.tagName === 'IMG') {
              const urlMatch = (value as string).match(/url\(['"]?([^'"]+)['"]?\)/);
              if (urlMatch) {
                (element as HTMLImageElement).src = urlMatch[1];
              } else if (value === 'none') {
                element.style.backgroundImage = value as string;
              }
            } else {
              element.style.backgroundImage = value as string;
              element.style.backgroundSize = 'contain';
              element.style.backgroundRepeat = 'no-repeat';
              element.style.backgroundPosition = 'center';
              
              if (value !== 'none') {
                if (element.tagName === 'SVG' || element.tagName === 'I') {
                  element.style.opacity = '1';
                }
                Array.from(element.children).forEach(child => {
                  if (child.tagName === 'IMG' || element.tagName === 'SVG' || element.tagName === 'I') {
                    (child as HTMLElement).style.opacity = '0';
                  }
                });
              } else {
                Array.from(element.children).forEach(child => {
                  if (child.tagName === 'IMG' || element.tagName === 'SVG' || element.tagName === 'I') {
                    (child as HTMLElement).style.opacity = '';
                  }
                });
              }
            }
          } else {
            (element.style as any)[key] = value;
          }
        }
      });
    }
  };

  const handleApply = () => {
    if (latestStylesRef.current) {
      saveModifications(latestStylesRef.current);
    }
    clearSelection();
  };

  const handleCancel = () => {
    if (element && initialInlineStyles) {
      Object.entries(initialInlineStyles).forEach(([key, value]) => {
        (element.style as any)[key] = value;
      });
    }
    clearSelection();
  };

  const handleReset = () => {
    if (element && originalStylesMap.has(element)) {
      const original = originalStylesMap.get(element);
      Object.entries(original).forEach(([key, value]) => {
        (element.style as any)[key] = value;
      });
      
      if (selector) {
        modsItem.getValue().then((mods) => {
          const pageKey = window.location.hostname + window.location.pathname;
          if (mods[pageKey]?.[selector]) {
            delete mods[pageKey][selector];
            modsItem.setValue(mods);
          }
        });
      }

      const computed = window.getComputedStyle(element);
      const restoredStyles: any = {};
      for (const key in currentStyles) {
        if (key === 'padding') {
          restoredStyles[key] = computed.padding || `${computed.paddingTop} ${computed.paddingRight} ${computed.paddingBottom} ${computed.paddingLeft}`;
        } else if (key === 'margin') {
          restoredStyles[key] = computed.margin || `${computed.marginTop} ${computed.marginRight} ${computed.marginBottom} ${computed.marginLeft}`;
        } else {
          restoredStyles[key] = (computed as any)[key];
        }
      }
      return restoredStyles;
    }
    return null;
  };

  const handleHide = () => {
    if (element) {
      element.style.display = 'none';
      saveModifications({ display: 'none' });
      clearSelection();
    }
  };

  return {
    handlePreview,
    handleApply,
    handleCancel,
    handleReset,
    handleHide
  };
};
