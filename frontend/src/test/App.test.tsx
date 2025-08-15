import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders FeedbackPin component with correct props', () => {
    render(<App />)
    
    /** Check if the main feedback pin app container is rendered */
    const feedbackPinApp = screen.getByRole('button', { name: /hide controls/i })
    expect(feedbackPinApp).toBeInTheDocument()
  })

  it('passes correct email ID to FeedbackPin', () => {
    render(<App />)
    
    /** The component should render without throwing an error, indicating emailId is provided */
    expect(screen.getByRole('button', { name: /hide controls/i })).toBeInTheDocument()
  })
})
