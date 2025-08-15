import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FeedbackPin from '../../components/FeedbackPin'

/** Mock the PinsContext */
const mockUsePinsContext = vi.fn()
vi.mock('../../context/PinsContext', () => ({
  PinsProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  usePinsContext: () => mockUsePinsContext(),
}))

/** Mock react-toastify */
vi.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('FeedbackPin', () => {
  const mockPinsContextValue = {
    pins: [],
    removeAllPinsByPath: vi.fn(),
    isLoading: false,
    emailId: 'test@example.com',
    addPin: vi.fn(),
    removePin: vi.fn(),
    updatePin: vi.fn(),
    getPinsByPath: vi.fn(() => []),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUsePinsContext.mockReturnValue(mockPinsContextValue)
  })

  it('throws error when emailId is not provided', () => {
    /** Suppress console.error for this test */
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<FeedbackPin emailId="" initialActive={false} />)
    }).toThrow("FeedbackPin: 'emailId' prop is required. Please provide a valid email ID to use the FeedbackPin component.")
    
    consoleSpy.mockRestore()
  })

  it('renders with default props', () => {
    render(<FeedbackPin emailId="test@example.com" />)
    
    expect(screen.getByRole('button', { name: /hide controls/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enable feedback/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /hide pins/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /remove all pins/i })).toBeInTheDocument()
  })

  it('renders with custom initial props', () => {
    render(
      <FeedbackPin 
        emailId="test@example.com" 
        initialActive={true}
        initialShowPins={false}
        initialShowControls={false}
      />
    )
    
    /** When controls are hidden, only the collapsed button should be visible */
    expect(screen.getByRole('button', { name: /show controls/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /disable feedback/i })).not.toBeInTheDocument()
  })

  it('toggles feedback mode when button is clicked', async () => {
    const user = userEvent.setup()
    render(<FeedbackPin emailId="test@example.com" />)
    
    const feedbackButton = screen.getByRole('button', { name: /enable feedback/i })
    await user.click(feedbackButton)
    
    expect(screen.getByRole('button', { name: /disable feedback/i })).toBeInTheDocument()
  })

  it('toggles pins visibility when button is clicked', async () => {
    const user = userEvent.setup()
    render(<FeedbackPin emailId="test@example.com" />)
    
    const pinsButton = screen.getByRole('button', { name: /hide pins/i })
    await user.click(pinsButton)
    
    expect(screen.getByRole('button', { name: /show pins/i })).toBeInTheDocument()
  })

  it('toggles controls visibility when main button is clicked', async () => {
    const user = userEvent.setup()
    render(<FeedbackPin emailId="test@example.com" />)
    
    const controlsButton = screen.getByRole('button', { name: /hide controls/i })
    await user.click(controlsButton)
    
    /** Controls should be hidden */
    expect(screen.getByRole('button', { name: /show controls/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /enable feedback/i })).not.toBeInTheDocument()
  })

  it('shows confirmation dialog when removing all pins with existing pins', async () => {
    const user = userEvent.setup()
    const mockPins = [
      { id: '1', x: 100, y: 100, path: 'http://localhost:3000', feedback: 'Test', createdAt: Date.now(), emailId: 'test@example.com' }
    ]
    
    mockUsePinsContext.mockReturnValue({
      ...mockPinsContextValue,
      pins: mockPins,
    })
    
    render(<FeedbackPin emailId="test@example.com" />)
    
    const removeAllButton = screen.getByRole('button', { name: /remove all pins/i })
    await user.click(removeAllButton)
    
    /** window.confirm should be called */
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to remove all 1 pins from this page?')
  })

  it('shows alert when trying to remove pins with no pins present', async () => {
    const user = userEvent.setup()
    render(<FeedbackPin emailId="test@example.com" />)
    
    const removeAllButton = screen.getByRole('button', { name: /remove all pins/i })
    await user.click(removeAllButton)
    
    /** window.alert should be called */
    expect(window.alert).toHaveBeenCalledWith('No pins to remove on this page.')
  })

  it('calls removeAllPinsByPath when confirmation is accepted', async () => {
    const user = userEvent.setup()
    const mockPins = [
      { id: '1', x: 100, y: 100, path: 'http://localhost:3000', feedback: 'Test', createdAt: Date.now(), emailId: 'test@example.com' }
    ]
    
    mockUsePinsContext.mockReturnValue({
      ...mockPinsContextValue,
      pins: mockPins,
    })
    
    render(<FeedbackPin emailId="test@example.com" />)
    
    const removeAllButton = screen.getByRole('button', { name: /remove all pins/i })
    await user.click(removeAllButton)
    
    expect(mockPinsContextValue.removeAllPinsByPath).toHaveBeenCalledWith('http://localhost:3000')
  })

  it('renders loading overlay when isLoading is true', () => {
    mockUsePinsContext.mockReturnValue({
      ...mockPinsContextValue,
      isLoading: true,
    })
    
    render(<FeedbackPin emailId="test@example.com" />)
    
    /** Loading overlay should be present */
    expect(screen.getByTestId('loading-overlay')).toBeInTheDocument()
  })

  it('renders toast container', () => {
    render(<FeedbackPin emailId="test@example.com" />)
    
    expect(screen.getByTestId('toast-container')).toBeInTheDocument()
  })
})
