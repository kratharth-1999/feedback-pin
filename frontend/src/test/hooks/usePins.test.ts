import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { usePins } from '../../hooks/usePins'
import type { PinType } from '../../types'
import { toast } from 'react-toastify'

/** Mock react-toastify */
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

/** Mock apiService */
vi.mock('../../services/apiService', () => ({
  apiService: {
    getPinsByUrl: vi.fn(),
    savePin: vi.fn(),
    deletePin: vi.fn(),
    deletePinsByUrl: vi.fn(),
  },
}))

import { apiService } from '../../services/apiService'
const mockApiService = vi.mocked(apiService)

describe('usePins', () => {
  const emailId = 'test@example.com'
  const mockPin: PinType = {
    id: '1',
    x: 100,
    y: 200,
    path: 'http://localhost:3000',
    feedback: 'Test feedback',
    createdAt: Date.now(),
    emailId,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    /** Reset window location */
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: 'http://localhost:3000' },
    })
    /** Mock successful API responses by default */
    mockApiService.getPinsByUrl.mockResolvedValue([mockPin])
    mockApiService.savePin.mockResolvedValue(undefined)
    mockApiService.deletePin.mockResolvedValue(undefined)
    mockApiService.deletePinsByUrl.mockResolvedValue(undefined)
  })


  it('initializes with loading state and loads pins', async () => {
    const { result } = renderHook(() => usePins(emailId))

    /** Initially loading */
    expect(result.current.isLoading).toBe(true)
    expect(result.current.pins).toEqual([])
    expect(result.current.emailId).toBe(emailId)

    /** Wait for pins to load */
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.pins).toEqual([mockPin])
    expect(mockApiService.getPinsByUrl).toHaveBeenCalledWith('http://localhost:3000', emailId)
  })

  it('handles loading pins error', async () => {
    const error = new Error('Failed to load pins')
    mockApiService.getPinsByUrl.mockRejectedValue(error)

    const { result } = renderHook(() => usePins(emailId))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.pins).toEqual([])
    expect(toast.error).toHaveBeenCalledWith('Failed to load pins')
    expect(console.error).toHaveBeenCalledWith('Error loading pins:', error)
  })

  it('adds a pin successfully', async () => {
    const { result } = renderHook(() => usePins(emailId))

    /** Wait for initial load */
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const newPin: PinType = {
      id: '2',
      x: 150,
      y: 250,
      path: 'http://localhost:3000',
      feedback: 'New feedback',
      createdAt: Date.now(),
      emailId: 'different@example.com', /** Different emailId to test override */
    }

    await act(async () => {
      await result.current.addPin(newPin)
    })

    /** Should call API with emailId override */
    expect(mockApiService.savePin).toHaveBeenCalledWith({
      ...newPin,
      emailId, /** Should use hook's emailId */
    })

    /** Should add pin to state */
    expect(result.current.pins).toHaveLength(2)
    expect(result.current.pins[1]).toEqual({ ...newPin, emailId })
    expect(toast.success).toHaveBeenCalledWith('Pin added successfully')
  })

  it('handles add pin error', async () => {
    const error = new Error('Failed to add pin')
    mockApiService.savePin.mockRejectedValue(error)

    const { result } = renderHook(() => usePins(emailId))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const newPin: PinType = {
      id: '2',
      x: 150,
      y: 250,
      path: 'http://localhost:3000',
      feedback: 'New feedback',
      createdAt: Date.now(),
      emailId,
    }

    await act(async () => {
      await result.current.addPin(newPin)
    })

    /** Should not add pin to state */
    expect(result.current.pins).toHaveLength(1)
    expect(toast.error).toHaveBeenCalledWith('Failed to add pin')
    expect(console.error).toHaveBeenCalledWith('Error adding pin:', error)
  })

  it('removes a pin successfully', async () => {
    const { result } = renderHook(() => usePins(emailId))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.removePin('1')
    })

    expect(mockApiService.deletePin).toHaveBeenCalledWith('1')
    expect(result.current.pins).toHaveLength(0)
    expect(toast.success).toHaveBeenCalledWith('Pin removed successfully')
  })

  it('handles remove pin error', async () => {
    const error = new Error('Failed to remove pin')
    mockApiService.deletePin.mockRejectedValue(error)

    const { result } = renderHook(() => usePins(emailId))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.removePin('1')
    })

    /** Should not remove pin from state */
    expect(result.current.pins).toHaveLength(1)
    expect(toast.error).toHaveBeenCalledWith('Failed to remove pin')
    expect(console.error).toHaveBeenCalledWith('Error removing pin:', error)
  })

  it('updates a pin successfully', async () => {
    const { result } = renderHook(() => usePins(emailId))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const updatedPin: PinType = {
      ...mockPin,
      feedback: 'Updated feedback',
      emailId: 'different@example.com', /** Different emailId to test override */
    }

    await act(async () => {
      await result.current.updatePin(updatedPin)
    })

    /** Should call API with emailId override */
    expect(mockApiService.savePin).toHaveBeenCalledWith({
      ...updatedPin,
      emailId, /** Should use hook's emailId */
    })

    /** Should update pin in state */
    expect(result.current.pins[0]).toEqual({ ...updatedPin, emailId })
    expect(toast.success).toHaveBeenCalledWith('Pin updated successfully')
  })

  it('handles update pin error', async () => {
    const error = new Error('Failed to update pin')
    mockApiService.savePin.mockRejectedValue(error)

    const { result } = renderHook(() => usePins(emailId))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const updatedPin: PinType = {
      ...mockPin,
      feedback: 'Updated feedback',
    }

    await act(async () => {
      await result.current.updatePin(updatedPin)
    })

    /** Should not update pin in state */
    expect(result.current.pins[0].feedback).toBe('Test feedback')
    expect(toast.error).toHaveBeenCalledWith('Failed to update pin')
    expect(console.error).toHaveBeenCalledWith('Error updating pin:', error)
  })

  it('gets pins by path', async () => {
    const pin1: PinType = { ...mockPin, id: '1', path: 'http://localhost:3000/page1' }
    const pin2: PinType = { ...mockPin, id: '2', path: 'http://localhost:3000/page2' }
    const pin3: PinType = { ...mockPin, id: '3', path: 'http://localhost:3000/page1' }

    mockApiService.getPinsByUrl.mockResolvedValue([pin1, pin2, pin3])

    const { result } = renderHook(() => usePins(emailId))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const page1Pins = result.current.getPinsByPath('http://localhost:3000/page1')
    expect(page1Pins).toHaveLength(2)
    expect(page1Pins.map(p => p.id)).toEqual(['1', '3'])

    const page2Pins = result.current.getPinsByPath('http://localhost:3000/page2')
    expect(page2Pins).toHaveLength(1)
    expect(page2Pins[0].id).toBe('2')
  })

  it('removes all pins by path successfully', async () => {
    const pin1: PinType = { ...mockPin, id: '1', path: 'http://localhost:3000/page1' }
    const pin2: PinType = { ...mockPin, id: '2', path: 'http://localhost:3000/page2' }

    mockApiService.getPinsByUrl.mockResolvedValue([pin1, pin2])

    const { result } = renderHook(() => usePins(emailId))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.removeAllPinsByPath('http://localhost:3000/page1')
    })

    expect(mockApiService.deletePinsByUrl).toHaveBeenCalledWith('http://localhost:3000/page1', emailId)
    expect(result.current.pins).toHaveLength(1)
    expect(result.current.pins[0].id).toBe('2')
    expect(toast.success).toHaveBeenCalledWith('All pins removed successfully')
  })

  it('handles remove all pins by path error', async () => {
    const error = new Error('Failed to remove pins')
    mockApiService.deletePinsByUrl.mockRejectedValue(error)

    const { result } = renderHook(() => usePins(emailId))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.removeAllPinsByPath('http://localhost:3000')
    })

    /** Should not remove pins from state */
    expect(result.current.pins).toHaveLength(1)
    expect(toast.error).toHaveBeenCalledWith('Failed to remove pins')
    expect(console.error).toHaveBeenCalledWith('Error removing pins for path:', error)
  })

  it('reloads pins when tab becomes visible', async () => {
    const { result } = renderHook(() => usePins(emailId))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    /** Clear previous calls */
    mockApiService.getPinsByUrl.mockClear()

    /** Simulate tab becoming visible */
    Object.defineProperty(document, 'visibilityState', {
      writable: true,
      value: 'visible',
    })

    const visibilityChangeEvent = new Event('visibilitychange')
    document.dispatchEvent(visibilityChangeEvent)

    await waitFor(() => {
      expect(mockApiService.getPinsByUrl).toHaveBeenCalledWith('http://localhost:3000', emailId)
    })
  })

  it('does not reload pins when tab becomes hidden', async () => {
    const { result } = renderHook(() => usePins(emailId))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    /** Clear previous calls */
    mockApiService.getPinsByUrl.mockClear()

    /** Simulate tab becoming hidden */
    Object.defineProperty(document, 'visibilityState', {
      writable: true,
      value: 'hidden',
    })

    const visibilityChangeEvent = new Event('visibilitychange')
    document.dispatchEvent(visibilityChangeEvent)

    /** Should not call API again */
    expect(mockApiService.getPinsByUrl).not.toHaveBeenCalled()
  })

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

    const { unmount } = renderHook(() => usePins(emailId))

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
  })

  it('handles non-Error objects in catch blocks', async () => {
    mockApiService.getPinsByUrl.mockRejectedValue('String error')

    const { result } = renderHook(() => usePins(emailId))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(toast.error).toHaveBeenCalledWith('Error loading pins')
  })
})
