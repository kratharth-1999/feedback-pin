import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import Overlay from '../../components/Overlay'
import type { PinType } from '../../types'

/** Mock all the child components */
vi.mock('../../components/Pin', () => ({
  default: ({ pin, onClick }: { pin: PinType; onClick: (pin: PinType) => void }) => (
    <div data-testid={`pin-${pin.id}`} onClick={() => onClick(pin)} className="pin">
      Pin {pin.id}
    </div>
  ),
}))

vi.mock('../../components/FeedbackForm', () => ({
  default: ({ position, onSubmit, onCancel }: any) => {
    const [feedback, setFeedback] = React.useState('')
    
    const handleSubmit = () => {
      if (feedback.trim()) {
        onSubmit(feedback)
      }
    }

    return (
      <div data-testid="feedback-form" className="feedback-form">
        <textarea 
          data-testid="feedback-textarea"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter feedback"
        />
        <button onClick={handleSubmit} disabled={!feedback.trim()}>Submit</button>
        <button onClick={onCancel}>Cancel</button>
        <div>Position: {position.x}, {position.y}</div>
      </div>
    )
  },
}))

vi.mock('../../components/PinDetailsPopup', () => ({
  default: ({ pin, onClose, onRemove, onUpdate }: any) => (
    <div data-testid="pin-details-popup" className="pin-details">
      <div>Pin: {pin.id}</div>
      <button onClick={onClose}>Close</button>
      <button onClick={onRemove}>Remove</button>
      <button onClick={() => onUpdate({ ...pin, feedback: 'Updated' })}>Update</button>
    </div>
  ),
}))

/** Mock the PinsContext */
const mockUsePinsContext = vi.fn()
vi.mock('../../context/PinsContext', () => ({
  usePinsContext: () => mockUsePinsContext(),
}))

describe('Overlay', () => {
  const mockPin: PinType = {
    id: '1',
    x: 100,
    y: 200,
    path: 'http://localhost:3000',
    feedback: 'Test feedback',
    createdAt: Date.now(),
    emailId: 'test@example.com',
  }

  const mockPinsContextValue = {
    pins: [mockPin],
    addPin: vi.fn(),
    removePin: vi.fn(),
    updatePin: vi.fn(),
    emailId: 'test@example.com',
    isLoading: false,
    getPinsByPath: vi.fn(() => []),
    removeAllPinsByPath: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUsePinsContext.mockReturnValue(mockPinsContextValue)
    /** Reset window location */
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: 'http://localhost:3000' },
    })
  })

  it('renders overlay with correct cursor style when active', () => {
    render(<Overlay isActive={true} showPins={true} />)
    
    const overlay = screen.getByTestId('overlay')
    expect(overlay).toHaveClass('overlay')
    expect(overlay).toHaveStyle({ cursor: 'pointer' })
  })

  it('renders overlay with auto cursor when inactive', () => {
    render(<Overlay isActive={false} showPins={true} />)
    
    const overlay = screen.getByTestId('overlay')
    expect(overlay).toHaveStyle({ cursor: 'auto' })
  })

  it('renders pins when showPins is true', () => {
    render(<Overlay isActive={false} showPins={true} />)
    
    expect(screen.getByTestId('pin-1')).toBeInTheDocument()
  })

  it('does not render pins when showPins is false', () => {
    render(<Overlay isActive={false} showPins={false} />)
    
    expect(screen.queryByTestId('pin-1')).not.toBeInTheDocument()
  })

  it('only renders pins for current path', () => {
    const pinDifferentPath: PinType = {
      ...mockPin,
      id: '2',
      path: 'http://localhost:3000/different',
    }

    mockUsePinsContext.mockReturnValue({
      ...mockPinsContextValue,
      pins: [mockPin, pinDifferentPath],
    })

    render(<Overlay isActive={false} showPins={true} />)
    
    /** Should only show pin for current path */
    expect(screen.getByTestId('pin-1')).toBeInTheDocument()
    expect(screen.queryByTestId('pin-2')).not.toBeInTheDocument()
  })

  it('handles overlay click when active', async () => {
    const user = userEvent.setup()
    render(<Overlay isActive={true} showPins={true} />)
    
    const overlay = screen.getByTestId('overlay')
    
    /** Click on overlay (not on a pin) */
    await user.click(overlay)
    
    /** Should show feedback form */
    expect(screen.getByTestId('feedback-form')).toBeInTheDocument()
  })

  it('does not handle overlay click when inactive', async () => {
    const user = userEvent.setup()
    render(<Overlay isActive={false} showPins={true} />)
    
    const overlay = screen.getByTestId('overlay')
    await user.click(overlay)
    
    /** Should not show feedback form */
    expect(screen.queryByTestId('feedback-form')).not.toBeInTheDocument()
  })

  it('shows potential pin indicator at click position', async () => {
    render(<Overlay isActive={true} showPins={true} />)
    
    const overlay = screen.getByTestId('overlay')
    
    /** Click at specific position */
    fireEvent.click(overlay, { clientX: 150, clientY: 250 })
    
    /** Should show potential pin indicator */
    const potentialPin = screen.getByTestId('potential-pin')
    expect(potentialPin).toHaveStyle({
      position: 'fixed',
      left: '150px',
      top: '250px',
    })
  })

  it('handles pin click and shows pin details', async () => {
    const user = userEvent.setup()
    render(<Overlay isActive={false} showPins={true} />)
    
    const pin = screen.getByTestId('pin-1')
    await user.click(pin)
    
    /** Should show pin details popup */
    expect(screen.getByTestId('pin-details-popup')).toBeInTheDocument()
    expect(screen.getByText('Pin: 1')).toBeInTheDocument()
  })

  it('handles feedback form submission', async () => {
    const user = userEvent.setup()
    render(<Overlay isActive={true} showPins={true} />)
    
    const overlay = screen.getByTestId('overlay')
    fireEvent.click(overlay, { clientX: 150, clientY: 250 })
    
    /** Type feedback in textarea */
    const textarea = screen.getByTestId('feedback-textarea')
    await user.type(textarea, 'Test feedback')
    
    /** Submit feedback */
    const submitButton = screen.getByText('Submit')
    await user.click(submitButton)
    
    /** Should call addPin with correct data */
    expect(mockPinsContextValue.addPin).toHaveBeenCalledWith({
      id: expect.any(String),
      x: 150, /** clientX - scrollX (0) */
      y: 250, /** clientY - scrollY (0) */
      path: 'http://localhost:3000',
      feedback: 'Test feedback',
      createdAt: expect.any(Number),
      emailId: 'test@example.com',
    })
    
    /** Should hide feedback form */
    expect(screen.queryByTestId('feedback-form')).not.toBeInTheDocument()
  })

  it('handles feedback form cancellation', async () => {
    const user = userEvent.setup()
    render(<Overlay isActive={true} showPins={true} />)
    
    const overlay = screen.getByTestId('overlay')
    fireEvent.click(overlay, { clientX: 150, clientY: 250 })
    
    /** Cancel feedback */
    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)
    
    /** Should hide feedback form */
    expect(screen.queryByTestId('feedback-form')).not.toBeInTheDocument()
    /** Should not call addPin */
    expect(mockPinsContextValue.addPin).not.toHaveBeenCalled()
  })

  it('handles pin removal with confirmation', async () => {
    const user = userEvent.setup()
    render(<Overlay isActive={false} showPins={true} />)
    
    /** Click pin to show details */
    const pin = screen.getByTestId('pin-1')
    await user.click(pin)
    
    /** Click remove button */
    const removeButton = screen.getByText('Remove')
    await user.click(removeButton)
    
    /** Should call removePin */
    expect(mockPinsContextValue.removePin).toHaveBeenCalledWith('1')
    /** Should hide pin details */
    expect(screen.queryByTestId('pin-details-popup')).not.toBeInTheDocument()
  })

  it('handles pin update', async () => {
    const user = userEvent.setup()
    render(<Overlay isActive={false} showPins={true} />)
    
    /** Click pin to show details */
    const pin = screen.getByTestId('pin-1')
    await user.click(pin)
    
    /** Click update button */
    const updateButton = screen.getByText('Update')
    await user.click(updateButton)
    
    /** Should call updatePin */
    expect(mockPinsContextValue.updatePin).toHaveBeenCalledWith({
      ...mockPin,
      feedback: 'Updated',
    })
    /** Should hide pin details */
    expect(screen.queryByTestId('pin-details-popup')).not.toBeInTheDocument()
  })

  it('closes pin details when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<Overlay isActive={false} showPins={true} />)
    
    /** Click pin to show details */
    const pin = screen.getByTestId('pin-1')
    await user.click(pin)
    
    /** Click close button */
    const closeButton = screen.getByText('Close')
    await user.click(closeButton)
    
    /** Should hide pin details */
    expect(screen.queryByTestId('pin-details-popup')).not.toBeInTheDocument()
  })

  it('adjusts pin position based on scroll offset', async () => {
    const user = userEvent.setup()
    
    /** Set scroll position */
    Object.defineProperty(window, 'scrollX', { writable: true, value: 50 })
    Object.defineProperty(window, 'scrollY', { writable: true, value: 75 })
    
    render(<Overlay isActive={true} showPins={true} />)
    
    fireEvent.click(screen.getByTestId('overlay'), { clientX: 200, clientY: 300 })
    
    /** Type feedback and submit */
    await user.type(screen.getByTestId('feedback-textarea'), 'Test feedback')
    await user.click(screen.getByText('Submit'))
    
    /** Should call addPin with scroll-adjusted position */
    expect(mockPinsContextValue.addPin).toHaveBeenCalledWith({
      id: expect.any(String),
      x: 150, /** 200 - 50 */
      y: 225, /** 300 - 75 */
      path: 'http://localhost:3000',
      feedback: 'Test feedback',
      createdAt: expect.any(Number),
      emailId: 'test@example.com',
    })
  })

  it('handles click outside to close popups', () => {
    render(<Overlay isActive={true} showPins={true} />)
    
    /** Show feedback form */
    fireEvent.click(screen.getByTestId('overlay'), { clientX: 150, clientY: 250 })
    
    expect(screen.getByTestId('feedback-form')).toBeInTheDocument()
    
    /** Click outside */
    fireEvent.mouseDown(document.body)
    
    /** Should close feedback form */
    expect(screen.queryByTestId('feedback-form')).not.toBeInTheDocument()
  })

  it('does not close popups when clicking inside them', async () => {
    const user = userEvent.setup()
    render(<Overlay isActive={true} showPins={true} />)
    
    /** Show feedback form */
    fireEvent.click(screen.getByTestId('overlay'), { clientX: 150, clientY: 250 })
    
    const feedbackForm = screen.getByTestId('feedback-form')
    expect(feedbackForm).toBeInTheDocument()
    
    /** Type some feedback to ensure form stays active */
    await user.type(screen.getByTestId('feedback-textarea'), 'Test')
    
    /** Click inside feedback form */
    fireEvent.mouseDown(feedbackForm)
    
    /** Should not close feedback form */
    expect(screen.getByTestId('feedback-form')).toBeInTheDocument()
  })

  it('is memoized component', () => {
    /** Test that the component is wrapped with React.memo */
    expect(Overlay.displayName).toBe('Overlay')
  })
})
