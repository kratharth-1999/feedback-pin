import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PinsProvider, usePinsContext } from '../../context/PinsContext'

/** Mock the usePins hook */
vi.mock('../../hooks/usePins', () => ({
  usePins: vi.fn(),
}))

import { usePins } from '../../hooks/usePins'
const mockUsePins = vi.mocked(usePins)

/** Test component that uses the context */
const TestComponent = () => {
  const context = usePinsContext()
  return (
    <div>
      <div data-testid="email-id">{context.emailId}</div>
      <div data-testid="pins-count">{context.pins.length}</div>
      <div data-testid="is-loading">{context.isLoading.toString()}</div>
      <button onClick={() => context.addPin({
        id: 'test',
        x: 100,
        y: 200,
        path: 'test-path',
        feedback: 'test feedback',
        createdAt: Date.now(),
        emailId: 'test@example.com'
      })}>
        Add Pin
      </button>
    </div>
  )
}

describe('PinsContext', () => {
  const mockPinsData = {
    pins: [
      {
        id: '1',
        x: 100,
        y: 200,
        path: 'http://localhost:3000',
        feedback: 'Test feedback',
        createdAt: Date.now(),
        emailId: 'test@example.com',
      }
    ],
    isLoading: false,
    emailId: 'test@example.com',
    addPin: vi.fn(),
    removePin: vi.fn(),
    updatePin: vi.fn(),
    getPinsByPath: vi.fn(() => []),
    removeAllPinsByPath: vi.fn(),
    loadPins: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUsePins.mockReturnValue(mockPinsData)
  })

  it('provides pins data to children components', () => {
    render(
      <PinsProvider emailId="test@example.com">
        <TestComponent />
      </PinsProvider>
    )

    expect(screen.getByTestId('email-id')).toHaveTextContent('test@example.com')
    expect(screen.getByTestId('pins-count')).toHaveTextContent('1')
    expect(screen.getByTestId('is-loading')).toHaveTextContent('false')
  })

  it('passes emailId to usePins hook', () => {
    render(
      <PinsProvider emailId="user@example.com">
        <TestComponent />
      </PinsProvider>
    )

    expect(mockUsePins).toHaveBeenCalledWith('user@example.com')
  })

  it('provides context functions to children', () => {
    render(
      <PinsProvider emailId="test@example.com">
        <TestComponent />
      </PinsProvider>
    )

    const addButton = screen.getByText('Add Pin')
    addButton.click()

    expect(mockPinsData.addPin).toHaveBeenCalledWith({
      id: 'test',
      x: 100,
      y: 200,
      path: 'test-path',
      feedback: 'test feedback',
      createdAt: expect.any(Number),
      emailId: 'test@example.com'
    })
  })

  it('throws error when usePinsContext is used outside provider', () => {
    /** Suppress console.error for this test */
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    const ComponentOutsideProvider = () => {
      usePinsContext()
      return <div>Test</div>
    }

    expect(() => {
      render(<ComponentOutsideProvider />)
    }).toThrow('usePinsContext must be used within a PinsProvider')
    
    consoleSpy.mockRestore()
  })

  it('updates context when usePins data changes', () => {
    const { rerender } = render(
      <PinsProvider emailId="test@example.com">
        <TestComponent />
      </PinsProvider>
    )

    /** Update mock data */
    const updatedMockData = {
      ...mockPinsData,
      isLoading: true,
      pins: []
    }
    mockUsePins.mockReturnValue(updatedMockData)

    rerender(
      <PinsProvider emailId="test@example.com">
        <TestComponent />
      </PinsProvider>
    )

    expect(screen.getByTestId('is-loading')).toHaveTextContent('true')
    expect(screen.getByTestId('pins-count')).toHaveTextContent('0')
  })

  it('renders multiple children correctly', () => {
    const ChildOne = () => {
      const { emailId } = usePinsContext()
      return <div data-testid="child-one">{emailId}</div>
    }

    const ChildTwo = () => {
      const { pins } = usePinsContext()
      return <div data-testid="child-two">{pins.length}</div>
    }

    render(
      <PinsProvider emailId="test@example.com">
        <ChildOne />
        <ChildTwo />
      </PinsProvider>
    )

    expect(screen.getByTestId('child-one')).toHaveTextContent('test@example.com')
    expect(screen.getByTestId('child-two')).toHaveTextContent('1')
  })
})
