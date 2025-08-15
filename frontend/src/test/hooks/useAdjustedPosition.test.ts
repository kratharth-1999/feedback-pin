import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAdjustedPosition } from '../../hooks/useAdjustedPosition'
import { createRef } from 'react'

describe('useAdjustedPosition', () => {
  const mockElement = {
    getBoundingClientRect: vi.fn(),
  } as unknown as HTMLElement

  const elementRef = createRef<HTMLElement>()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    
    /** Mock window dimensions */
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 })
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 768 })
    
    /** Mock element dimensions */
    ;(mockElement.getBoundingClientRect as any).mockReturnValue({
      width: 200,
      height: 150,
      left: 0,
      top: 0,
      right: 200,
      bottom: 150,
    })
    
    /** Set up element ref */
    Object.defineProperty(elementRef, 'current', {
      writable: true,
      value: mockElement,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial position when element is not available', () => {
    const position = { x: 100, y: 200 }
    const emptyRef = createRef<HTMLElement>()
    
    const { result } = renderHook(() => useAdjustedPosition(position, emptyRef))
    
    expect(result.current).toEqual(position)
  })

  it('adjusts position when element would overflow right edge', () => {
    const position = { x: 900, y: 100 } /** Element would extend to x: 1100, beyond viewport width 1024 */
    
    const { result } = renderHook(() => useAdjustedPosition(position, elementRef))
    
    /** Fast-forward timers to trigger position adjustment */
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    /** Should adjust x to keep element within viewport with padding */
    expect(result.current.x).toBe(814) /** 1024 - 200 - 10 = 814 */
    expect(result.current.y).toBe(100) /** y should remain unchanged */
  })

  it('adjusts position when element would overflow bottom edge', () => {
    const position = { x: 100, y: 700 } /** Element would extend to y: 850, beyond viewport height 768 */
    
    const { result } = renderHook(() => useAdjustedPosition(position, elementRef))
    
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    /** Should adjust y to keep element within viewport with padding */
    expect(result.current.x).toBe(100) /** x should remain unchanged */
    expect(result.current.y).toBe(608) /** 768 - 150 - 10 = 608 */
  })

  it('adjusts position when element would overflow left edge', () => {
    const position = { x: -50, y: 100 } /** Negative x position */
    
    const { result } = renderHook(() => useAdjustedPosition(position, elementRef))
    
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    /** Should adjust x to minimum padding */
    expect(result.current.x).toBe(10) /** PADDING = 10 */
    expect(result.current.y).toBe(100) /** y should remain unchanged */
  })

  it('adjusts position when element would overflow top edge', () => {
    const position = { x: 100, y: -50 } /** Negative y position */
    
    const { result } = renderHook(() => useAdjustedPosition(position, elementRef))
    
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    /** Should adjust y to minimum padding */
    expect(result.current.x).toBe(100) /** x should remain unchanged */
    expect(result.current.y).toBe(10) /** PADDING = 10 */
  })

  it('adjusts position when element would overflow multiple edges', () => {
    const position = { x: 1000, y: 700 } /** Would overflow both right and bottom */
    
    const { result } = renderHook(() => useAdjustedPosition(position, elementRef))
    
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    /** Should adjust both x and y */
    expect(result.current.x).toBe(814) /** 1024 - 200 - 10 = 814 */
    expect(result.current.y).toBe(608) /** 768 - 150 - 10 = 608 */
  })

  it('does not adjust position when element fits within viewport', () => {
    const position = { x: 100, y: 100 } /** Element would be at 100,100 to 300,250 - well within viewport */
    
    const { result } = renderHook(() => useAdjustedPosition(position, elementRef))
    
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    /** Position should remain unchanged */
    expect(result.current).toEqual(position)
  })

  it('updates position when position prop changes', () => {
    const initialPosition = { x: 100, y: 100 }
    
    const { result, rerender } = renderHook(
      ({ position }) => useAdjustedPosition(position, elementRef),
      { initialProps: { position: initialPosition } }
    )
    
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    expect(result.current).toEqual(initialPosition)
    
    /** Change position */
    const newPosition = { x: 900, y: 100 }
    rerender({ position: newPosition })
    
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    /** Should adjust new position */
    expect(result.current.x).toBe(814) /** Adjusted for overflow */
    expect(result.current.y).toBe(100)
  })

  it('readjusts position on window resize', () => {
    const position = { x: 500, y: 300 }
    
    const { result } = renderHook(() => useAdjustedPosition(position, elementRef))
    
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    /** Initially should fit */
    expect(result.current).toEqual(position)
    
    /** Resize window to be smaller */
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 600 })
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 400 })
    
    /** Trigger resize event */
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })
    
    /** Should adjust position for smaller viewport */
    expect(result.current.x).toBe(390) /** 600 - 200 - 10 = 390 */
    expect(result.current.y).toBe(240) /** 400 - 150 - 10 = 240 */
  })

  it('handles different element sizes', () => {
    /** Mock larger element */
    ;(mockElement.getBoundingClientRect as any).mockReturnValue({
      width: 400,
      height: 300,
      left: 0,
      top: 0,
      right: 400,
      bottom: 300,
    })
    
    const position = { x: 800, y: 500 }
    
    const { result } = renderHook(() => useAdjustedPosition(position, elementRef))
    
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    /** Should adjust for larger element */
    expect(result.current.x).toBe(614) /** 1024 - 400 - 10 = 614 */
    expect(result.current.y).toBe(458) /** 768 - 300 - 10 = 458 */
  })

  it('cleans up event listeners and timeout on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
    
    const { unmount } = renderHook(() => useAdjustedPosition({ x: 100, y: 100 }, elementRef))
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    expect(clearTimeoutSpy).toHaveBeenCalled()
  })

  it('uses correct padding value', () => {
    const position = { x: 5, y: 5 } /** Less than padding */
    
    const { result } = renderHook(() => useAdjustedPosition(position, elementRef))
    
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    /** Should adjust to padding value (10) */
    expect(result.current.x).toBe(10)
    expect(result.current.y).toBe(10)
  })

  it('handles edge case where element is larger than viewport', () => {
    /** Mock element larger than viewport */
    ;(mockElement.getBoundingClientRect as any).mockReturnValue({
      width: 1200, /** Larger than viewport width 1024 */
      height: 900,  /** Larger than viewport height 768 */
      left: 0,
      top: 0,
      right: 1200,
      bottom: 900,
    })
    
    const position = { x: 100, y: 100 }
    
    const { result } = renderHook(() => useAdjustedPosition(position, elementRef))
    
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    /** Should position at padding from edges */
    expect(result.current.x).toBe(10) /** Can't fit, so use minimum padding */
    expect(result.current.y).toBe(10) /** Can't fit, so use minimum padding */
  })
})
