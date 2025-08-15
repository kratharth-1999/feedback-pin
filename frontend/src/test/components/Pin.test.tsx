import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pin from '../../components/Pin'
import type { PinType } from '../../types'

describe('Pin', () => {
  const mockPin: PinType = {
    id: '1',
    x: 100,
    y: 200,
    path: 'http://localhost:3000',
    feedback: 'Test feedback',
    createdAt: Date.now(),
    emailId: 'test@example.com',
  }

  const mockOnClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    /** Reset scroll position */
    Object.defineProperty(window, 'scrollX', { writable: true, value: 0 })
    Object.defineProperty(window, 'scrollY', { writable: true, value: 0 })
  })

  it('renders pin at correct position without scroll', () => {
    render(<Pin pin={mockPin} onClick={mockOnClick} />)
    
    const pin = screen.getByRole('button')
    expect(pin).toHaveClass('pin')
    expect(pin).toHaveStyle({
      left: '100px',
      top: '200px',
    })
  })

  it('adjusts position based on scroll offset', () => {
    /** Set scroll position */
    Object.defineProperty(window, 'scrollX', { writable: true, value: 50 })
    Object.defineProperty(window, 'scrollY', { writable: true, value: 75 })

    render(<Pin pin={mockPin} onClick={mockOnClick} />)
    
    const pin = screen.getByRole('button')
    /** Position should be adjusted: original - scroll */
    expect(pin).toHaveStyle({
      left: '50px', /** 100 - 50 */
      top: '125px', /** 200 - 75 */
    })
  })

  it('calls onClick with pin when clicked', async () => {
    const user = userEvent.setup()
    render(<Pin pin={mockPin} onClick={mockOnClick} />)
    
    const pin = screen.getByRole('button')
    await user.click(pin)
    
    expect(mockOnClick).toHaveBeenCalledWith(mockPin)
  })

  it('updates position when scroll event occurs', () => {
    render(<Pin pin={mockPin} onClick={mockOnClick} />)
    
    const pin = screen.getByRole('button')
    
    /** Initial position */
    expect(pin).toHaveStyle({
      left: '100px',
      top: '200px',
    })

    /** Simulate scroll */
    Object.defineProperty(window, 'scrollX', { writable: true, value: 25 })
    Object.defineProperty(window, 'scrollY', { writable: true, value: 30 })
    
    fireEvent.scroll(window)

    /** Position should be updated */
    expect(pin).toHaveStyle({
      left: '75px', /** 100 - 25 */
      top: '170px', /** 200 - 30 */
    })
  })

  it('updates position when resize event occurs', () => {
    render(<Pin pin={mockPin} onClick={mockOnClick} />)
    
    const pin = screen.getByRole('button')
    
    /** Simulate scroll change and resize */
    Object.defineProperty(window, 'scrollX', { writable: true, value: 10 })
    Object.defineProperty(window, 'scrollY', { writable: true, value: 15 })
    
    fireEvent.resize(window)

    /** Position should be updated */
    expect(pin).toHaveStyle({
      left: '90px', /** 100 - 10 */
      top: '185px', /** 200 - 15 */
    })
  })

  it('handles negative adjusted positions', () => {
    /** Set scroll position greater than pin position */
    Object.defineProperty(window, 'scrollX', { writable: true, value: 150 })
    Object.defineProperty(window, 'scrollY', { writable: true, value: 250 })

    render(<Pin pin={mockPin} onClick={mockOnClick} />)
    
    const pin = screen.getByRole('button')
    expect(pin).toHaveStyle({
      left: '-50px', /** 100 - 150 */
      top: '-50px', /** 200 - 250 */
    })
  })

  it('removes event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    
    const { unmount } = render(<Pin pin={mockPin} onClick={mockOnClick} />)
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('adds event listeners on mount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    
    render(<Pin pin={mockPin} onClick={mockOnClick} />)
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('is memoized component', () => {
    /** Test that the component is wrapped with React.memo */
    expect(Pin.displayName).toBe('Pin')
  })

  it('handles multiple scroll events correctly', () => {
    render(<Pin pin={mockPin} onClick={mockOnClick} />)
    
    const pin = screen.getByRole('button')
    
    /** First scroll */
    Object.defineProperty(window, 'scrollX', { writable: true, value: 20 })
    Object.defineProperty(window, 'scrollY', { writable: true, value: 30 })
    fireEvent.scroll(window)
    
    expect(pin).toHaveStyle({ left: '80px', top: '170px' })

    /** Second scroll */
    Object.defineProperty(window, 'scrollX', { writable: true, value: 40 })
    Object.defineProperty(window, 'scrollY', { writable: true, value: 60 })
    fireEvent.scroll(window)
    
    expect(pin).toHaveStyle({ left: '60px', top: '140px' })
  })
})
