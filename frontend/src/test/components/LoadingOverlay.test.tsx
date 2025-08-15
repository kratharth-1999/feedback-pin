import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingOverlay from '../../components/LoadingOverlay'

vi.mock('react-spinners', () => ({
  ClipLoader: ({ color, size }: { color: string; size: number }) => (
    <div data-testid="clip-loader" data-color={color} data-size={size} />
  ),
}))

describe('LoadingOverlay', () => {
  it('renders nothing when isLoading is false', () => {
    const { container } = render(<LoadingOverlay isLoading={false} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders loading overlay with correct elements when isLoading is true', () => {
    render(<LoadingOverlay isLoading={true} />)
    
    expect(screen.getByTestId('loading-overlay')).toHaveClass('loading-overlay')
    expect(screen.getByText('Loading...')).toHaveClass('loading-text')
    
    const loader = screen.getByTestId('clip-loader')
    expect(loader).toHaveAttribute('data-color', '#3498db')
    expect(loader).toHaveAttribute('data-size', '50')
  })
})
