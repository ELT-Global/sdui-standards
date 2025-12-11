```typescript
interface UIBaseImage {
  url: string;
  alt: string;
  aspectRatio?: number;
}

/**
 * Avatar - User/entity profile pictures
 * Use for: Chat messages, participant lists, profile cards, attendance modals
 *
 * @example
 * ```tsx
 * const avatar: UIAvatar = {
 *   type: 'avatar',
 *   url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
 *   alt: 'John Doe',
 *   size: 'md',
 *   shape: 'circle',
 *   fallback: { initials: 'JD', backgroundColor: '#3478F5' }
 * }
 * ```
 */
export type UIAvatar = UIBaseImage & {
  type: 'avatar';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  shape?: 'circle' | 'square' | 'rounded';
  fallback?: {
    initials?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  status?: {
    indicator: 'online' | 'offline' | 'busy' | 'away';
    position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  };
};

/**
 * Logo - Brand identity graphics
 * Use for: App branding, partner logos, institution logos, bank logos
 * Integrates with the 3-brand design system (eltglobal, triplei, westmount)
 *
 * @example
 * ```tsx
 * const logo: UILogo = {
 *   type: 'logo',
 *   url: '/elt-logo.svg',
 *   alt: 'ELT Global',
 *   brand: 'eltglobal',
 *   variant: 'full',
 *   theme: 'auto',
 *   size: 111
 * }
 * ```
 */
export type UILogo = UIBaseImage & {
  type: 'logo';
  variant?: 'full' | 'minimal' | 'icon-only';
  brand?: 'eltglobal' | 'triplei' | 'westmount';
  theme?: 'light' | 'dark' | 'auto';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  linkTo?: string;
};

/**
 * Illustration - Decorative graphics and animations
 * Use for: Empty states, onboarding screens, success/error states, Lottie animations
 *
 * @example
 * ```tsx
 * const illustration: UIIllustration = {
 *   type: 'illustration',
 *   url: '/lottie/alarm.json',
 *   alt: 'Alarm animation',
 *   variant: 'decorative',
 *   animation: { type: 'lottie', loop: true, autoplay: true }
 * }
 * ```
 */
export type UIIllustration = UIBaseImage & {
  type: 'illustration';
  variant?: 'empty-state' | 'success' | 'error' | 'onboarding' | 'decorative';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animation?: {
    type: 'lottie' | 'gif' | 'css' | 'none';
    loop?: boolean;
    autoplay?: boolean;
  };
};

/**
 * Discriminated union of all image types
 * Provides type-safe image handling with context-specific properties
 *
 * Migration note: Legacy code using plain objects with { url, alt, aspectRatio }
 * will continue to work but should gradually migrate to typed variants
 */
export type UIImage = UIAvatar | UILogo | UIIllustration;
```