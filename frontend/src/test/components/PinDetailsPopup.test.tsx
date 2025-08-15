import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PinDetailsPopup from '../../components/PinDetailsPopup'
import type { PinType } from '../../types'

/** Mock the useAdjustedPosition hook */
const mockUseAdjustedPosition = vi.fn()
vi.mock('../../hooks/useAdjustedPosition', () => ({
  useAdjustedPosition: () => mockUseAdjustedPosition(),
}))

describe('PinDetailsPopup', () => {
  const mockPin: PinType = {
    id: '1',
    x: 100,
    y: 200,
    path: 'http://localhost:3000',
    feedback: 'Original feedback text',
    createdAt: 1640995200000, /** 2022-01-01 00:00:00 UTC */
    emailId: 'test@example.com',
  }

  const mockOnClose = vi.fn()
  const mockOnRemove = vi.fn()
  const mockOnUpdate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAdjustedPosition.mockReturnValue({ x: 150, y: 250 })
  })

  it('renders pin details with correct information', () => {
    render(
      <PinDetailsPopup
        pin={mockPin}
        onClose={mockOnClose}
        onRemove={mockOnRemove}
        onUpdate={mockOnUpdate}
      />
    )

    expect(screen.getByText('Pin Details')).toBeInTheDocument()
    expect(screen.getByText('Original feedback text')).toBeInTheDocument()
    expect(screen.getByText(/Created:/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /remove pin/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /×/i })).toBeInTheDocument()
  })

  it('positions popup using adjusted position', () => {
    const adjustedPosition = { x: 175, y: 275 }
    mockUseAdjustedPosition.mockReturnValue(adjustedPosition)

    render(
      <PinDetailsPopup
        pin={mockPin}
        onClose={mockOnClose}
        onRemove={mockOnRemove}
        onUpdate={mockOnUpdate}
      />
    )

    const popup = screen.getByRole('dialog', { name: /pin details/i })
    expect(popup).toHaveStyle({
      position: 'fixed',
      left: '175px',
      top: '275px',
    })
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <PinDetailsPopup
        pin={mockPin}
        onClose={mockOnClose}
        onRemove={mockOnRemove}
        onUpdate={mockOnUpdate}
      />
    )

    const closeButton = screen.getByRole('button', { name: /×/i })
    await user.click(closeButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls onRemove when remove button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <PinDetailsPopup
        pin={mockPin}
        onClose={mockOnClose}
        onRemove={mockOnRemove}
        onUpdate={mockOnUpdate}
      />
    )

    const removeButton = screen.getByRole('button', { name: /remove pin/i })
    await user.click(removeButton)

    expect(mockOnRemove).toHaveBeenCalled()
  })

  it('enters edit mode when edit button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <PinDetailsPopup
        pin={mockPin}
        onClose={mockOnClose}
        onRemove={mockOnRemove}
        onUpdate={mockOnUpdate}
      />
    )

    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    /** Should show textarea and edit buttons */
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()

    /** Should hide original buttons */
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /remove pin/i })).not.toBeInTheDocument()
  })

  it('shows textarea with current feedback in edit mode', async () => {
    const user = userEvent.setup()
    render(
      <PinDetailsPopup
        pin={mockPin}
        onClose={mockOnClose}
        onRemove={mockOnRemove}
        onUpdate={mockOnUpdate}
      />
    )

    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('Original feedback text')
    expect(textarea).toHaveFocus()
    expect(textarea).toHaveAttribute('rows', '4')
  })

  it('cancels edit mode and resets feedback', async () => {
    const user = userEvent.setup()
    render(
      <PinDetailsPopup
        pin={mockPin}
        onClose={mockOnClose}
        onRemove={mockOnRemove}
        onUpdate={mockOnUpdate}
      />
    )

    /** Enter edit mode */
    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    /** Modify feedback */
    const textarea = screen.getByRole('textbox')
    await user.clear(textarea)
    await user.type(textarea, 'Modified feedback')

    /** Cancel edit */
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    /** Should return to view mode with original feedback */
    expect(screen.getByText('Original feedback text')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('save button is disabled when feedback is empty, whitespace, or unchanged', async () => {
    const user = userEvent.setup()
    render(
      <PinDetailsPopup
        pin={mockPin}
        onClose={mockOnClose}
        onRemove={mockOnRemove}
        onUpdate={mockOnUpdate}
      />
    )

    /** Enter edit mode */
    await user.click(screen.getByRole('button', { name: /edit/i }))

    const saveButton = screen.getByRole('button', { name: /save/i })
    const textarea = screen.getByRole('textbox')

    /** Save button should be disabled when unchanged */
    expect(saveButton).toBeDisabled()

    /** Save button should be disabled when empty */
    await user.clear(textarea)
    expect(saveButton).toBeDisabled()

    /** Save button should be disabled when only whitespace */
    await user.type(textarea, '   ')
    expect(saveButton).toBeDisabled()
  })

  it('save button is enabled when feedback is modified', async () => {
    const user = userEvent.setup()
    render(
      <PinDetailsPopup
        pin={mockPin}
        onClose={mockOnClose}
        onRemove={mockOnRemove}
        onUpdate={mockOnUpdate}
      />
    )

    /** Enter edit mode */
    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    /** Modify feedback */
    const textarea = screen.getByRole('textbox')
    await user.type(textarea, ' - updated')

    /** Save button should be enabled */
    const saveButton = screen.getByRole('button', { name: /save/i })
    expect(saveButton).toBeEnabled()
  })

  it('calls onUpdate with modified feedback when save is clicked', async () => {
    const user = userEvent.setup()
    render(
      <PinDetailsPopup
        pin={mockPin}
        onClose={mockOnClose}
        onRemove={mockOnRemove}
        onUpdate={mockOnUpdate}
      />
    )

    /** Enter edit mode */
    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    /** Modify feedback */
    const textarea = screen.getByRole('textbox')
    await user.clear(textarea)
    await user.type(textarea, 'Updated feedback text')

    /** Save changes */
    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)

    /** Should call onUpdate with updated pin */
    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockPin,
      feedback: 'Updated feedback text',
    })

    /** Should exit edit mode */
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
  })

  it('does not call onUpdate when onUpdate prop is not provided', async () => {
    const user = userEvent.setup()
    render(
      <PinDetailsPopup
        pin={mockPin}
        onClose={mockOnClose}
        onRemove={mockOnRemove}
      />
    )

    /** Enter edit mode */
    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    /** Modify feedback */
    const textarea = screen.getByRole('textbox')
    await user.type(textarea, ' - updated')

    /** Save button should still be disabled since onUpdate is not provided */
    const saveButton = screen.getByRole('button', { name: /save/i })
    expect(saveButton).toBeDisabled()
  })

  it('formats timestamp correctly', () => {
    render(
      <PinDetailsPopup
        pin={mockPin}
        onClose={mockOnClose}
        onRemove={mockOnRemove}
        onUpdate={mockOnUpdate}
      />
    )

    /** Check that timestamp is formatted */
    const timestampElement = screen.getByText(/Created:/)
    expect(timestampElement).toBeInTheDocument()
    /** The exact format depends on locale, but it should contain the date */
    expect(timestampElement.textContent).toMatch(/Created:.*2022/)
  })

  it('is memoized component', () => {
    /** Test that the component is wrapped with React.memo */
    expect(PinDetailsPopup.displayName).toBe('PinDetailsPopup')
  })

  it('updates textarea value when typing in edit mode', async () => {
    const user = userEvent.setup()
    render(
      <PinDetailsPopup
        pin={mockPin}
        onClose={mockOnClose}
        onRemove={mockOnRemove}
        onUpdate={mockOnUpdate}
      />
    )

    /** Enter edit mode */
    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    /** Type in textarea */
    const textarea = screen.getByRole('textbox')
    await user.clear(textarea)
    await user.type(textarea, 'New feedback content')

    expect(textarea).toHaveValue('New feedback content')
  })
})
