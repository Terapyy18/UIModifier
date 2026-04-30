import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ColorPickerOverlay } from '../src/components/ColorPickerOverlay';
import { useElementInspector } from '../src/hooks/useElementInspector';

// Store the absolute original inline styles of elements the very first time they are clicked
const originalStylesMap = new WeakMap<HTMLElement, any>();

const App: React.FC = () => {
  const { element, elementType, currentStyles, position, clearSelection } = useElementInspector(true);
  const [initialInlineStyles, setInitialInlineStyles] = useState<any>(null);

  // Store the element's inline styles
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
    } else {
      setInitialInlineStyles(null);
    }
  }, [element, currentStyles]);

  // Live preview handler
  const handlePreview = (styles: Partial<typeof currentStyles>) => {
    if (element) {
      Object.entries(styles).forEach(([key, value]) => {
        if (value !== undefined) {
          (element.style as any)[key] = value;
        }
      });
    }
  };

  const handleApply = () => {
    // Styles are already applied in preview. Just clear selection to close the picker.
    clearSelection();
  };

  const handleCancel = () => {
    // Revert to initial inline styles before the picker was opened
    if (element && initialInlineStyles) {
      Object.entries(initialInlineStyles).forEach(([key, value]) => {
        (element.style as any)[key] = value;
      });
    }
    clearSelection();
  };

  const handleReset = () => {
    // Revert to the absolute original styles the element had when the page loaded
    if (element && originalStylesMap.has(element)) {
      const original = originalStylesMap.get(element);
      Object.entries(original).forEach(([key, value]) => {
        (element.style as any)[key] = value;
      });
      
      // Compute the fresh styles to send back to the UI
      const computed = window.getComputedStyle(element);
      const restoredStyles: any = {};
      for (const key in currentStyles) {
        if (key === 'padding') {
          restoredStyles[key] = computed.padding || `${computed.paddingTop} ${computed.paddingRight} ${computed.paddingBottom} ${computed.paddingLeft}`;
        } else {
          restoredStyles[key] = (computed as any)[key];
        }
      }
      return restoredStyles;
    }
    return null;
  };

  return (
    <>
      {element && (
        <ColorPickerOverlay
          element={element}
          elementType={elementType}
          currentStyles={currentStyles}
          position={position}
          onChange={handlePreview}
          onApply={handleApply}
          onCancel={handleCancel}
          onReset={handleReset}
        />
      )}
    </>
  );
};

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    const container = document.createElement('div');
    container.id = 'ui-modifier-root';
    
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.zIndex = '2147483647';
    
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(<App />);
  },
});
