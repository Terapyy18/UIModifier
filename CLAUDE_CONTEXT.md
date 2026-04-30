# UI Modifier — Project Overview

This project is a React-based Chrome Extension built with **WXT**. It allows users to dynamically modify the styles (CSS) of any element on any webpage via a right-click inspector.

## Key Technologies
- **Framework**: WXT (Web Extension Toolbox)
- **Library**: React
- **Styling**: Vanilla CSS (injected via `<style>` tags)
- **Storage**: WXT Native Storage (`defineItem`) with type-safe, reactive updates.

## Project Structure
- `entrypoints/content.tsx`: The main content script. It injects a React root into the page, monitors storage for changes, and applies saved modifications globally via a central `<style id="ui-modifier-styles">` tag.
- `src/hooks/useElementInspector.ts`: Logic for the "Right-Click to Inspect" feature. It handles DOM traversal, generating unique CSS selectors, and determining the "type" of element being inspected (text, button, icon, container).
- `src/hooks/useStyleEditor.ts`: Manages the lifecycle of a style edit (preview, apply, cancel, reset). It saves "original" styles to allow reverting changes.
- `src/components/Overlay/`: The floating UI panel that appears when an element is inspected.
    - `index.tsx`: Main `Overlay` entry — owns form state, dispatches the right variant based on `elementType`.
    - `BaseOverlay.tsx`: Shell (positioning, click-outside, header, profile select, action buttons). Renders the variant as children.
    - `utils.ts`: Helpers (`rgbToHex`, `toFormState`, `mergeProfile`, `buildPayload`) plus the `VARIANT_KEYS` map declaring which CSS keys each variant exposes.
    - `inputs.tsx`: Reusable input atoms (`ColorInput`, `NumberInput`, `MeasurementInput`, `TextInput`, `FontFamilyInput`, `BIUButtons`, `SelectInput`).
    - `sections.tsx`: Reusable groups of inputs (`FontSection`, `BorderSection`, `SpacingSection`, `SizeSection`, `ImageSection`, `LayoutSection`).
    - `variants/`: One file per element type — each only renders the inputs that make sense for that type:
        - `TextOverlay`: text color + font.
        - `ImageOverlay`: replace image, size, border, margin (no text/font).
        - `IconOverlay`: color, size, replace image, margin.
        - `ButtonOverlay`: text + font + bg + border + padding/margin + size.
        - `LinkOverlay`: text + font + optional bg/radius/padding.
        - `ContainerOverlay`: bg + border + padding/margin + size + flex layout (no font).
- `utils/storage.ts`: Centralized storage definitions using WXT's `storage` API.
    - `enabledItem`: Global On/Off toggle.
    - `modsItem`: Map of `selector -> style_object` persisted per domain/path.
    - `profilesItem`: User-saved style presets (profiles).

## Core Logic
1. **Selection**: User right-clicks an element. `useElementInspector` calculates a selector and identifies the element type.
2. **Editing**: The `ColorPickerOverlay` opens. As the user changes values, `handlePreview` applies inline styles for immediate feedback.
3. **Persistence**: 
   - **Apply**: The styles are saved to `modsItem`. The content script (watching `modsItem`) generates a global CSS rule for that selector and injects it.
   - **Profiles**: Users can save a set of styles as a "Profile" to reuse later.
4. **Reactivity**: Changes in the popup (e.g., toggling the extension Off) are synced instantly to all tabs via `storage.watch()`.

## Element Types
The inspector categorizes elements to show relevant inputs (defined as `ElementType` in `useElementInspector.ts`):
- `text` (`p`, `span`, `h1`–`h6`, `label`, …): fonts and color.
- `image` (`img`, `picture`): replace image, size, border, margin — no font/text controls.
- `icon` (`svg`, `i`, `.icon`): color, size, replace image, margin.
- `button` (`button`, `input[type=button|submit|reset]`, `.btn`): full set — text + bg + border + padding + size.
- `link` (`a`): text styling + optional background, radius, padding.
- `container` (`div`, `section`, `article`, `main`, `header`, `footer`, `nav`, `aside`, `form`, `ul`, `ol`, `li`): background, border, spacing, size, flex layout.

## Development
- `npm run dev`: Starts the WXT dev server with HMR.
- `npm run build`: Production build.
