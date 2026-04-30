import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Overlay } from '../src/components/Overlay';
import { useElementInspector } from '../src/hooks/useElementInspector';
import { useStyleEditor } from '../src/hooks/useStyleEditor';
import { enabledItem, modsItem } from '../utils/storage';

const applySavedStylesToPage = (mods: any, isEnabled: boolean) => {
  let styleTag = document.getElementById('ui-modifier-injected-styles');

  if (!isEnabled) {
    if (styleTag) styleTag.remove();
    // Also clear any inline styles left by preview on the current page's modified elements
    const pageKey = window.location.hostname + window.location.pathname;
    const pageMods = mods[pageKey] || {};
    for (const [selector, styles] of Object.entries(pageMods)) {
      try {
        document.querySelectorAll(selector).forEach(el => {
          for (const key of Object.keys(styles as any)) {
            const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            (el as HTMLElement).style.removeProperty(kebabKey);
          }
        });
      } catch (_) {}
    }
    return;
  }

  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'ui-modifier-injected-styles';
    document.head.appendChild(styleTag);
  }

  const pageKey = window.location.hostname + window.location.pathname;
  const pageMods = mods[pageKey] || {};
  
  let cssText = '';
  for (const [selector, styles] of Object.entries(pageMods)) {
    let rules = '';
    const s = styles as any;
    for (const [key, value] of Object.entries(s)) {
      if (value !== undefined && value !== null) {
        if (key === 'backgroundImage' && value === 'none') {
           rules += `background-image: none !important;\n`;
        } else if (key === 'backgroundImage') {
           rules += `background-image: ${value} !important;\nbackground-size: cover !important;\nbackground-position: center !important;\n`;
        } else {
           const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
           rules += `${kebabKey}: ${value} !important;\n`;
        }
      }
    }
    if (rules) {
      cssText += `${selector} {\n${rules}}\n`;
    }
    
    // Apply src changes to IMG tags if any
    if (s.backgroundImage) {
      try {
        document.querySelectorAll(selector).forEach(el => {
          if (el.tagName === 'IMG') {
            const urlMatch = s.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (urlMatch) {
              (el as HTMLImageElement).src = urlMatch[1];
            }
          }
        });
      } catch (_) {}
    }
  }
  
  styleTag.textContent = cssText;
};

const App: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);

  // Load state on mount + watch for live changes from the popup
  useEffect(() => {
    // 1. Initial read
    Promise.all([enabledItem.getValue(), modsItem.getValue()]).then(([enabled, mods]) => {
      setIsEnabled(enabled);
      applySavedStylesToPage(mods, enabled);
    });

    // 2. Watch toggles from popup — fires instantly, no page reload needed
    const unwatchEnabled = enabledItem.watch((enabled) => {
      setIsEnabled(enabled);
      modsItem.getValue().then((mods) => applySavedStylesToPage(mods, enabled));
    });

    // 3. Watch style modifications
    const unwatchMods = modsItem.watch((mods) => {
      enabledItem.getValue().then((enabled) => applySavedStylesToPage(mods ?? {}, enabled));
    });

    return () => {
      unwatchEnabled();
      unwatchMods();
    };
  }, []);


  const { element, elementType, currentStyles, position, clearSelection, hasImage, selector } = useElementInspector(isEnabled);
  const { handlePreview, handleApply, handleCancel, handleReset, handleHide } = useStyleEditor({ element, currentStyles, selector, clearSelection });

  return (
    <>
      {element && (
        <Overlay
          element={element}
          elementType={elementType}
          hasImage={hasImage}
          currentStyles={currentStyles}
          position={position}
          onChange={handlePreview}
          onApply={handleApply}
          onCancel={handleCancel}
          onReset={handleReset}
          onHide={handleHide}
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
