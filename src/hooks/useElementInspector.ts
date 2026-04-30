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
  margin: string;
  width: string;
  height: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  backgroundImage: string;
  display: string;
  flexDirection: string;
  justifyContent: string;
  alignItems: string;
  gap: string;
}

export type ElementType = 'text' | 'image' | 'icon' | 'button' | 'link' | 'container';

interface InspectorState {
  element: HTMLElement | null;
  selector: string;
  elementType: ElementType;
  hasImage: boolean;
  currentStyles: ElementStyles;
  position: Position;
  text: string;
}

export const useElementInspector = (isActive: boolean = true) => {
  const [state, setState] = useState<InspectorState>({
    element: null,
    selector: '',
    elementType: 'text' as ElementType,
    hasImage: false,
    currentStyles: {
      color: '',
      backgroundColor: '',
      borderRadius: '',
      borderWidth: '',
      borderColor: '',
      padding: '',
      margin: '',
      width: '',
      height: '',
      fontSize: '',
      fontFamily: '',
      fontWeight: '',
      fontStyle: '',
      textDecoration: '',
      backgroundImage: '',
      display: '',
      flexDirection: '',
      justifyContent: '',
      alignItems: '',
      gap: '',
    },
    position: { x: 0, y: 0 },
    text: '',
  });

  const generateSelector = (el: HTMLElement): string => {
    if (el.id) return `#${el.id}`;

    let path = [];
    let current: HTMLElement | null = el;

    while (current && current.tagName !== 'BODY' && current.tagName !== 'HTML') {
      let selector = current.tagName.toLowerCase();

      if (current.id) {
        path.unshift(`#${current.id}`);
        break;
      }

      if (current.className && typeof current.className === 'string') {
        const classes = current.className.split(' ').filter(c => c && !c.includes(':')).join('.');
        if (classes) selector += `.${classes}`;
      }

      let sibling: HTMLElement | null = current;
      let nth = 1;
      while ((sibling = sibling.previousElementSibling as HTMLElement | null)) {
        if (sibling.tagName === current.tagName) nth++;
      }
      if (nth > 1) selector += `:nth-of-type(${nth})`;

      path.unshift(selector);
      current = current.parentElement;
    }

    return path.join(' > ');
  };

  const getEffectiveBackgroundColor = (el: HTMLElement): string => {
    let current: HTMLElement | null = el;
    while (current) {
      const style = window.getComputedStyle(current);
      const bg = style.backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        return bg;
      }
      current = current.parentElement;
    }
    return 'rgb(255, 255, 255)'; // Default browser background
  };

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // If the extension is disabled, do nothing — let the native context menu appear
      if (!isActive) return;

      const target = e.target as HTMLElement;

      if (target.closest('[data-ui-modifier-picker]')) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const computedStyle = window.getComputedStyle(target);
      const text = target.innerText?.trim() || target.textContent?.trim() || '';

      const className = (target.className && typeof target.className === 'string') ? target.className.toLowerCase() : '';

      const isImage = target.tagName === 'IMG' || target.tagName === 'PICTURE';

      const isIcon = !isImage && (
        target.tagName === 'I' ||
        target.tagName === 'SVG' ||
        className.includes('icon') ||
        target.closest('svg') !== null
      );

      const isLink = target.tagName === 'A';

      const isButton = !isLink && (
        target.tagName === 'BUTTON' ||
        target.getAttribute('role') === 'button' ||
        (target.tagName === 'INPUT' && ['button', 'submit', 'reset'].includes((target as HTMLInputElement).type)) ||
        className.includes('btn')
      );

      const containerTags = ['DIV', 'SECTION', 'ARTICLE', 'MAIN', 'HEADER', 'FOOTER', 'NAV', 'ASIDE', 'FORM', 'UL', 'OL', 'LI'];
      const isContainer = containerTags.includes(target.tagName);

      let elementType: ElementType = 'text';
      if (isImage) elementType = 'image';
      else if (isIcon) elementType = 'icon';
      else if (isLink) elementType = 'link';
      else if (isButton) elementType = 'button';
      else if (isContainer) elementType = 'container';

      const padding = computedStyle.padding || `${computedStyle.paddingTop} ${computedStyle.paddingRight} ${computedStyle.paddingBottom} ${computedStyle.paddingLeft}`;
      const margin = computedStyle.margin || `${computedStyle.marginTop} ${computedStyle.marginRight} ${computedStyle.marginBottom} ${computedStyle.marginLeft}`;

      const hasImgChild = target.querySelector('img') !== null;
      const hasBgImage = computedStyle.backgroundImage !== 'none' && computedStyle.backgroundImage !== '';
      const hasImage = isIcon || hasBgImage || hasImgChild;

      setState({
        element: target,
        selector: generateSelector(target),
        elementType: elementType,
        hasImage: hasImage,
        currentStyles: {
          color: computedStyle.color,
          backgroundColor: getEffectiveBackgroundColor(target),
          borderRadius: computedStyle.borderRadius,
          borderWidth: computedStyle.borderWidth,
          borderColor: computedStyle.borderColor,
          padding: padding,
          margin: margin,
          width: computedStyle.width,
          height: computedStyle.height,
          fontSize: computedStyle.fontSize,
          fontFamily: computedStyle.fontFamily,
          fontWeight: computedStyle.fontWeight,
          fontStyle: computedStyle.fontStyle,
          textDecoration: computedStyle.textDecoration,
          backgroundImage: computedStyle.backgroundImage,
          display: computedStyle.display,
          flexDirection: computedStyle.flexDirection,
          justifyContent: computedStyle.justifyContent,
          alignItems: computedStyle.alignItems,
          gap: computedStyle.gap,
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
      hasImage: false,
      currentStyles: {
        color: '', backgroundColor: '', borderRadius: '', borderWidth: '', borderColor: '', padding: '', margin: '', width: '', height: '', fontSize: '', fontFamily: '', fontWeight: '', fontStyle: '', textDecoration: '', backgroundImage: '', display: '', flexDirection: '', justifyContent: '', alignItems: '', gap: ''
      },
      position: { x: 0, y: 0 },
      text: '',
    });
  }, []);

  useEffect(() => {
    if (!isActive) {
      clearSelection();
    }
  }, [isActive, clearSelection]);

  return { ...state, clearSelection };
};
