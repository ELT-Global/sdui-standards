/**
 * LOTTIE REGISTRY:
 * The Lottie registry will have all Lotties dynamically imported as a key-value registry.
 * The Lottie is rendered based on the key received from the backend.
 */

// Size mapping for consistent sizing across types
const SIZE_MAP = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 64,
  xl: 96,
} as const;

// Shape class mapping for avatar shapes
const SHAPE_MAP = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-lg',
} as const;

// Status indicator position mapping
const STATUS_POSITION_MAP = {
  'top-right': 'top-0 right-0',
  'bottom-right': '-bottom-0.5 -right-0.5',
  'top-left': 'top-0 left-0',
  'bottom-left': 'bottom-0 left-0',
} as const;

// Status indicator color mapping
const STATUS_COLOR_MAP = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
} as const;

export function SduiImage({ data, className, fallback }: SduiImageProps) {
  const [hasImageError, setHasImageError] = useState(false);

  if (hasImageError && fallback) {
    return <>{fallback}</>;
  }

  if (hasImageError) {
    return null;
  }

  switch (data.type) {
    case 'avatar': {
      const size = typeof data.size === 'number' ? data.size : SIZE_MAP[data.size ?? 'md'];
      const shape = SHAPE_MAP[data.shape ?? 'circle'];

      const avatarContent = (
        <Avatar className={cn(`size-[${size}px]`, shape, className)}>
          <AvatarImage
            src={data.url}
            alt={data.alt}
            onError={() => setHasImageError(true)}
          />
          <AvatarFallback
            className={cn(shape, 'text-sm font-medium')}
            style={{
              backgroundColor: data.fallback?.backgroundColor,
              color: data.fallback?.textColor,
            }}
          >
            {data.fallback?.initials ?? data.alt.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      );

      // Wrap with status indicator if provided
      if (data.status) {
        const statusPosition = STATUS_POSITION_MAP[data.status.position ?? 'bottom-right'];
        const statusColor = STATUS_COLOR_MAP[data.status.indicator];

        return (
          <div className="relative inline-block">
            {avatarContent}
            <div
              className={cn(
                'absolute size-3 rounded-full border-2 border-surface-primary',
                statusColor,
                statusPosition,
              )}
            />
          </div>
        );
      }

      return avatarContent;
    }

    case 'logo': {
      const size = typeof data.size === 'number' ? data.size : SIZE_MAP[data.size ?? 'md'];

      const logoImage = (
        <div
          className={cn('relative overflow-hidden', className)}
          style={{
            width: size,
            height: data.aspectRatio ? size / data.aspectRatio : 'auto',
            aspectRatio: data.aspectRatio || 'auto',
          }}
          data-brand={data.brand}
        >
          <Image
            src={data.url}
            alt={data.alt}
            fill
            className="object-contain"
            onError={() => setHasImageError(true)}
          />
        </div>
      );

      // Wrap with Link if linkTo is provided
      if (data.linkTo) {
        return (
          <Link href={data.linkTo} className="inline-block">
            {logoImage}
          </Link>
        );
      }

      return logoImage;
    }

    case 'illustration': {
      // Render Lottie animation if lottieKey is provided
      if (data.animation?.type === 'lottie' && data.animation.lottieKey) {
        if (isValidLottieKey(data.animation.lottieKey)) {
          const LottieComponent = LOTTIE_REGISTRY[data.animation.lottieKey];
          const sizeClass = data.size
            ? {
                sm: 'w-24 h-24',
                md: 'w-48 h-48',
                lg: 'w-64 h-64',
                xl: 'w-96 h-96',
              }[data.size]
            : '';

          return (
            <div className={cn(sizeClass, className)}>
              <LottieComponent loop={data.animation.loop ?? true} />
            </div>
          );
        }
      }

      // Fallback to static image
      const sizeClass = data.size
        ? {
            sm: 'w-24 h-24',
            md: 'w-48 h-48',
            lg: 'w-64 h-64',
            xl: 'w-96 h-96',
          }[data.size]
        : '';

      return (
        <div
          className={cn('relative overflow-hidden', sizeClass, className)}
          style={{
            aspectRatio: data.aspectRatio || 'auto',
          }}
        >
          <Image
            src={data.url}
            alt={data.alt}
            fill
            className="object-contain"
            onError={() => setHasImageError(true)}
          />
        </div>
      );
    } default:
      return null;
  }
}
