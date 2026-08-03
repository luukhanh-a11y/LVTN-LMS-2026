# Project-Specific Agent Rules

## Game UI Button and Object Design Rules

From now on, when creating or modifying any game buttons or interactive objects (e.g. using Lottie animations or transparent PNG images):
- **Container Styling**: Completely remove the visual styles of the container (wrapper/card/button element). Ensure it has:
  - No background: use transparent background (e.g., `bg-transparent`)
  - No border: use border-none (e.g., `border-0` or `border-none`)
  - No shadow: use shadow-none (e.g., `shadow-none` or `shadow-0`)
- **Interactive Element**: The Lottie animation or PNG image file itself must act as the interactive button/object.
- **Text Positioning**: Any overlay text (if present) must be positioned absolutely (`position: absolute`) and centered on top of the image/animation.
