import { useState, useEffect, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

export interface ElementStyles {
  color: string;
  backgroundColor: string;
  borderRadius: string;
  borderWidth: string;
  borderColor: string;
  padding: string;
  width: string;
  height: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
}

interface InspectorState {
  element: HTMLElement | null;
  selector: string;
  elementType: 'text' | 'button';
  currentStyles: ElementStyles;
  position: Position;
  text: string;
}

export const useElementInspector = (isActive: boolean = true) => {
  const [state, setState] = useState<InspectorState>({
    element: null,
    selector: '',
    elementType: 'text',
    currentStyles: {
      color: '',
      backgroundColor: '',
      borderRadius: '',
      borderWidth: '',
      borderColor: '',
      padding: '',
      width: '',
      height: '',
      fontSize: '',
      fontFamily: '',
      fontWeight: '',
      fontStyle: '',
      textDecoration: '',
    },
    position: { x: 0, y: 0 },
    text: '',
  });

  const generateSelector = (el: HTMLElement): string => {
    if (el.id) return `#${el.id}`;
    if (el.className && typeof el.className === 'string') {
        const classes = el.className.split(' ').filter(c => c).join('.');
        if (classes) return `${el.tagName.toLowerCase()}.${classes}`;
    }
    return el.tagName.toLowerCase();
  };

  useEffect(() => {
    if (!isActive) return;

    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.closest('[data-ui-modifier-picker]')) {
        return;
      }

      const text = target.innerText?.trim() || target.textContent?.trim() || '';
      if (!text) return;

      e.preventDefault();
      e.stopPropagation();

      const computedStyle = window.getComputedStyle(target);
      
      const isButton = target.tagName === 'BUTTON' || 
                       target.getAttribute('role') === 'button' ||
                       (target.tagName === 'INPUT' && ['button', 'submit', 'reset'].includes((target as HTMLInputElement).type)) ||
                       target.tagName === 'A' ||
                       (target.className && typeof target.className === 'string' && target.className.toLowerCase().includes('btn'));

      const padding = computedStyle.padding || `${computedStyle.paddingTop} ${computedStyle.paddingRight} ${computedStyle.paddingBottom} ${computedStyle.paddingLeft}`;

      setState({
        element: target,
        selector: generateSelector(target),
        elementType: isButton ? 'button' : 'text',
        currentStyles: {
          color: computedStyle.color,
          backgroundColor: computedStyle.backgroundColor,
          borderRadius: computedStyle.borderRadius,
          borderWidth: computedStyle.borderWidth,
          borderColor: computedStyle.borderColor,
          padding: padding,
          width: computedStyle.width,
          height: computedStyle.height,
          fontSize: computedStyle.fontSize,
          fontFamily: computedStyle.fontFamily,
          fontWeight: computedStyle.fontWeight,
          fontStyle: computedStyle.fontStyle,
          textDecoration: computedStyle.textDecoration,
        },
        position: { x: e.clientX, y: e.clientY },
        text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
      });
    };

    document.addEventListener('contextmenu', handleContextMenu, true);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
    };
  }, [isActive]);

  useEffect(() => {
    if (!state.element) return;

    const el = state.element;
    
    // Save original styles
    const originalBoxShadow = el.style.boxShadow;
    const originalBorderRadius = el.style.borderRadius;
    const originalTransition = el.style.transition;
    
    // Apply highlight styles
    el.style.transition = 'box-shadow 0.2s ease-in-out';
    el.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.6)'; // Blue highlight
    el.style.borderRadius = '6px'; // Rounded corners

    return () => {
      // Restore original styles
      el.style.boxShadow = originalBoxShadow;
      el.style.borderRadius = originalBorderRadius;
      el.style.transition = originalTransition;
    };
  }, [state.element]);

  const clearSelection = useCallback(() => {
    setState({
      element: null,
      selector: '',
      elementType: 'text',
      currentStyles: {
        color: '', backgroundColor: '', borderRadius: '', borderWidth: '', borderColor: '', padding: '', width: '', height: '', fontSize: '', fontFamily: '', fontWeight: '', fontStyle: '', textDecoration: ''
      },
      position: { x: 0, y: 0 },
      text: '',
    });
  }, []);

  return { ...state, clearSelection };
};
