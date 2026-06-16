import { useRef, useEffect, useCallback } from 'react';
import { ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

export interface AutoScrollCarouselProps {
  children: React.ReactNode;
  /** Width (px) of a single item + its margin, used to compute scroll steps */
  itemWidth: number;
  /** Total number of items, used to know when to loop back to the start */
  itemCount: number;
  /** Pixels to advance per tick. Defaults to itemWidth (one card at a time). */
  scrollStep?: number;
  /** Milliseconds between auto-advance ticks. Defaults to 3000 (3s). */
  intervalMs?: number;
  /** Milliseconds to wait after user interaction before resuming auto-scroll. Defaults to 4000. */
  resumeDelayMs?: number;
  /** Extra container style passthrough */
  contentContainerStyle?: object;
}

/**
 * AutoScrollCarousel
 *
 * Wraps a horizontal ScrollView that automatically advances on a timer
 * when the user isn't touching it, and pauses immediately on manual
 * interaction (touch start), resuming after a short delay of inactivity.
 *
 * Why this exists: per product feedback, static carousels feel inert.
 * Auto-advancing the "Featured Providers" row gives the home screen a
 * more alive, editorial feel (similar to Jumia/Spotify promo carousels)
 * without fighting the user — any touch immediately hands control back
 * to them, and we wait before taking it back.
 *
 * Implementation notes:
 * - Uses scrollTo with computed x offset rather than scrollToIndex,
 *   since this wraps a plain ScrollView (not a FlatList) — the caller
 *   passes ProviderCards as children directly, same as our other
 *   horizontal sections, for consistency with the rest of the codebase.
 * - Loops back to offset 0 once it scrolls past the last item.
 *
 * Usage:
 *   <AutoScrollCarousel itemWidth={216} itemCount={featuredProviders.length}>
 *     {featuredProviders.map((p) => <ProviderCard key={p.id} provider={p} onPress={...} />)}
 *   </AutoScrollCarousel>
 */
export function AutoScrollCarousel({
  children,
  itemWidth,
  itemCount,
  scrollStep,
  intervalMs = 3000,
  resumeDelayMs = 4000,
  contentContainerStyle,
}: AutoScrollCarouselProps) {
  const scrollRef = useRef<ScrollView>(null);
  const offsetRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const step = scrollStep ?? itemWidth;
  const maxOffset = Math.max((itemCount - 1) * itemWidth, 0);

  const startAutoScroll = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (itemCount <= 1) return; // nothing to auto-scroll

    timerRef.current = setInterval(() => {
      let nextOffset = offsetRef.current + step;

      // Loop back to the start once we've scrolled past the last item
      if (nextOffset > maxOffset) {
        nextOffset = 0;
      }

      offsetRef.current = nextOffset;
      scrollRef.current?.scrollTo({ x: nextOffset, animated: true });
    }, intervalMs);
  }, [itemCount, maxOffset, step, intervalMs]);

  const stopAutoScroll = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start auto-scroll on mount, clean up on unmount
  useEffect(() => {
    startAutoScroll();
    return () => {
      stopAutoScroll();
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pause immediately when the user touches the carousel
  function handleTouchStart() {
    stopAutoScroll();
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  }

  // Resume after resumeDelayMs of no further interaction
  function handleTouchEnd() {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      startAutoScroll();
    }, resumeDelayMs);
  }

  // Keep our offset ref in sync with manual scrolling, so auto-scroll
  // resumes from wherever the user left it rather than jumping back.
  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    offsetRef.current = e.nativeEvent.contentOffset.x;
  }

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={contentContainerStyle}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {children}
    </ScrollView>
  );
}