import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FeedbackForm from '../../components/FeedbackForm'

/** Mock the useAdjustedPosition hook */
const mockUseAdjustedPosition = vi.fn()
vi.mock('../../hooks/useAdjustedPosition', () => ({
  useAdjustedPosition: () => mockUseAdjustedPosition(),
}))

describe('FeedbackForm', () => {
  const mockOnSubmit = vi.fn()
  const mockOnCancel = vi.fn()
  const mockPosition = { x: 100, y: 200 }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAdjustedPosition.mockReturnValue(mockPosition)
  })

  it('renders form with correct elements', () => {
    render(
      <FeedbackForm
        position={mockPosition}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText('Add Feedback')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your feedback here...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('positions form using adjusted position', () => {
    const adjustedPosition = { x: 150, y: 250 }
    mockUseAdjustedPosition.mockReturnValue(adjustedPosition)

    render(
      <FeedbackForm
        position={mockPosition}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const form = screen.getByRole('form')
    const formContainer = form.closest('.feedback-form')
    expect(formContainer).toHaveStyle({
      position: 'fixed',
      left: '150px',
      top: '250px',
    })
  })

  it('textarea has correct attributes', () => {
    render(
      <FeedbackForm
        position={mockPosition}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const textarea = screen.getByPlaceholderText('Enter your feedback here...')
    expect(textarea).toHaveAttribute('rows', '4')
    expect(textarea).toHaveAttribute('required')
    expect(textarea).toHaveFocus()
  })

  it('submit button is disabled when feedback is empty', () => {
    render(
      <FeedbackForm
        position={mockPosition}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const submitButton = screen.getByRole('button', { name: /submit/i })
    expect(submitButton).toBeDisabled()
  })

  it('submit button is disabled when feedback is only whitespace', async () => {
    const user = userEvent.setup()
    render(
      <FeedbackForm
        position={mockPosition}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const textarea = screen.getByPlaceholderText('Enter your feedback here...')
    const submitButton = screen.getByRole('button', { name: /submit/i })

    await user.type(textarea, '   ')
    expect(submitButton).toBeDisabled()
  })

  it('submit button is enabled when feedback has content', async () => {
    const user = userEvent.setup()
    render(
      <FeedbackForm
        position={mockPosition}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const textarea = screen.getByPlaceholderText('Enter your feedback here...')
    const submitButton = screen.getByRole('button', { name: /submit/i })

    await user.type(textarea, 'This is feedback')
    expect(submitButton).toBeEnabled()
  })

  it('calls onSubmit with feedback when form is submitted', async () => {
    const user = userEvent.setup()
    render(
      <FeedbackForm
        position={mockPosition}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const textarea = screen.getByPlaceholderText('Enter your feedback here...')
    const submitButton = screen.getByRole('button', { name: /submit/i })

    await user.type(textarea, 'This is my feedback')
    await user.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledWith('This is my feedback')
  })

  it('calls onSubmit when form is submitted via Enter key', async () => {
    const user = userEvent.setup()
    render(
      <FeedbackForm
        position={mockPosition}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const textarea = screen.getByPlaceholderText('Enter your feedback here...')

    await user.type(textarea, 'This is my feedback')
    fireEvent.submit(screen.getByRole('form'))

    expect(mockOnSubmit).toHaveBeenCalledWith('This is my feedback')
  })

  it('does not call onSubmit when feedback is empty', () => {
    render(
      <FeedbackForm
        position={mockPosition}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    fireEvent.submit(screen.getByRole('form'))

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('does not call onSubmit when feedback is only whitespace', async () => {
    const user = userEvent.setup()
    render(
      <FeedbackForm
        position={mockPosition}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const textarea = screen.getByPlaceholderText('Enter your feedback here...')

    await user.type(textarea, '   ')
    fireEvent.submit(screen.getByRole('form'))

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <FeedbackForm
        position={mockPosition}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('clears feedback after successful submission', async () => {
    const user = userEvent.setup()
    render(
      <FeedbackForm
        position={mockPosition}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const textarea = screen.getByPlaceholderText('Enter your feedback here...')
    const submitButton = screen.getByRole('button', { name: /submit/i })

    await user.type(textarea, 'This is my feedback')
    await user.click(submitButton)

    expect(textarea).toHaveValue('')
  })

  it('updates textarea value when typing', async () => {
    const user = userEvent.setup()
    render(
      <FeedbackForm
        position={mockPosition}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const textarea = screen.getByPlaceholderText('Enter your feedback here...')
    
    await user.type(textarea, 'Test feedback')
    expect(textarea).toHaveValue('Test feedback')
  })

  it('is memoized component', () => {
    /** Test that the component is wrapped with React.memo */
    expect(FeedbackForm.displayName).toBe('FeedbackForm')
  })
})
