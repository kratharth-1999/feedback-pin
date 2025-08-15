import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiService } from '../../services/apiService'
import type { PinType } from '../../types'

/** Mock fetch globally */
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('apiService', () => {
  const mockPin: PinType = {
    id: '1',
    x: 100,
    y: 200,
    path: 'http://localhost:3000',
    feedback: 'Test feedback',
    createdAt: Date.now(),
    emailId: 'test@example.com',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    /** Mock successful response by default */
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: [mockPin], message: 'Success' }),
    })
  })

  describe('getPinsByUrl', () => {
    it('fetches pins for a specific URL and email ID', async () => {
      const url = 'http://localhost:3000/test'
      const emailId = 'user@example.com'

      const result = await apiService.getPinsByUrl(url, emailId)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://feedback-pin-production.up.railway.app/pins?url=http%3A%2F%2Flocalhost%3A3000%2Ftest&emailId=user%40example.com'
      )
      expect(result).toEqual([mockPin])
    })

    it('returns empty array when no data is provided', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ message: 'Success' }),
      })

      const result = await apiService.getPinsByUrl('http://localhost:3000', 'test@example.com')

      expect(result).toEqual([])
    })

    it('handles API error response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({ message: 'Failed to fetch pins' }),
      })

      await expect(
        apiService.getPinsByUrl('http://localhost:3000', 'test@example.com')
      ).rejects.toThrow('Failed to fetch pins')
    })

    it('handles API error response without message', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      })

      await expect(
        apiService.getPinsByUrl('http://localhost:3000', 'test@example.com')
      ).rejects.toThrow('Failed to fetch pins for URL')
    })

    it('handles network error', async () => {
      const networkError = new Error('Network error')
      mockFetch.mockRejectedValue(networkError)

      await expect(
        apiService.getPinsByUrl('http://localhost:3000', 'test@example.com')
      ).rejects.toThrow('Network error')

      expect(console.error).toHaveBeenCalledWith(
        'Error getting pins for URL http://localhost:3000:',
        networkError
      )
    })

    it('properly encodes URL parameters', async () => {
      const url = 'http://localhost:3000/test?param=value&other=test'
      const emailId = 'user+test@example.com'

      await apiService.getPinsByUrl(url, emailId)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://feedback-pin-production.up.railway.app/pins?url=http%3A%2F%2Flocalhost%3A3000%2Ftest%3Fparam%3Dvalue%26other%3Dtest&emailId=user%2Btest%40example.com'
      )
    })
  })

  describe('savePin', () => {
    it('saves a pin successfully', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ message: 'Pin saved successfully' }),
      })

      await apiService.savePin(mockPin)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://feedback-pin-production.up.railway.app/pin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockPin),
        }
      )
    })

    it('handles API error response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({ message: 'Failed to save pin' }),
      })

      await expect(apiService.savePin(mockPin)).rejects.toThrow('Failed to save pin')
    })

    it('handles API error response without message', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      })

      await expect(apiService.savePin(mockPin)).rejects.toThrow('Failed to create/update pin')
    })

    it('handles network error', async () => {
      const networkError = new Error('Network error')
      mockFetch.mockRejectedValue(networkError)

      await expect(apiService.savePin(mockPin)).rejects.toThrow('Network error')

      expect(console.error).toHaveBeenCalledWith('Error saving pin:', networkError)
    })

    it('sends correct request body', async () => {
      const customPin: PinType = {
        id: '2',
        x: 150,
        y: 250,
        path: 'http://localhost:3000/custom',
        feedback: 'Custom feedback',
        createdAt: 1640995200000,
        emailId: 'custom@example.com',
      }

      await apiService.savePin(customPin)

      const callArgs = mockFetch.mock.calls[0]
      const requestBody = JSON.parse(callArgs[1].body)
      expect(requestBody).toEqual(customPin)
    })
  })

  describe('deletePin', () => {
    it('deletes a pin successfully', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ message: 'Pin deleted successfully' }),
      })

      await apiService.deletePin('123')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://feedback-pin-production.up.railway.app/pins?id=123',
        {
          method: 'DELETE',
        }
      )
    })

    it('handles API error response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({ message: 'Failed to delete pin' }),
      })

      await expect(apiService.deletePin('123')).rejects.toThrow('Failed to delete pin')
    })

    it('handles API error response without message', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      })

      await expect(apiService.deletePin('123')).rejects.toThrow('Failed to delete pin')
    })

    it('handles network error', async () => {
      const networkError = new Error('Network error')
      mockFetch.mockRejectedValue(networkError)

      await expect(apiService.deletePin('123')).rejects.toThrow('Network error')

      expect(console.error).toHaveBeenCalledWith('Error deleting pin 123:', networkError)
    })

    it('properly encodes pin ID', async () => {
      const pinId = 'pin-with-special-chars@#$%'

      await apiService.deletePin(pinId)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://feedback-pin-production.up.railway.app/pins?id=pin-with-special-chars%40%23%24%25',
        {
          method: 'DELETE',
        }
      )
    })
  })

  describe('deletePinsByUrl', () => {
    it('deletes pins by URL successfully', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ message: 'Pins deleted successfully' }),
      })

      const url = 'http://localhost:3000/test'
      const emailId = 'user@example.com'

      await apiService.deletePinsByUrl(url, emailId)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://feedback-pin-production.up.railway.app/pins?url=http%3A%2F%2Flocalhost%3A3000%2Ftest&emailId=user%40example.com',
        {
          method: 'DELETE',
        }
      )
    })

    it('handles API error response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({ message: 'Failed to delete pins' }),
      })

      await expect(
        apiService.deletePinsByUrl('http://localhost:3000', 'test@example.com')
      ).rejects.toThrow('Failed to delete pins')
    })

    it('handles API error response without message', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      })

      await expect(
        apiService.deletePinsByUrl('http://localhost:3000', 'test@example.com')
      ).rejects.toThrow('Failed to delete pins for URL')
    })

    it('handles network error', async () => {
      const networkError = new Error('Network error')
      mockFetch.mockRejectedValue(networkError)

      await expect(
        apiService.deletePinsByUrl('http://localhost:3000', 'test@example.com')
      ).rejects.toThrow('Network error')

      expect(console.error).toHaveBeenCalledWith(
        'Error deleting pins for URL http://localhost:3000:',
        networkError
      )
    })

    it('properly encodes URL parameters', async () => {
      const url = 'http://localhost:3000/test?param=value&other=test'
      const emailId = 'user+test@example.com'

      await apiService.deletePinsByUrl(url, emailId)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://feedback-pin-production.up.railway.app/pins?url=http%3A%2F%2Flocalhost%3A3000%2Ftest%3Fparam%3Dvalue%26other%3Dtest&emailId=user%2Btest%40example.com',
        {
          method: 'DELETE',
        }
      )
    })
  })

  describe('API base URL', () => {
    it('uses correct base URL for all endpoints', async () => {
      const expectedBaseUrl = 'https://feedback-pin-production.up.railway.app'

      /** Test getPinsByUrl */
      await apiService.getPinsByUrl('http://localhost:3000', 'test@example.com')
      expect(mockFetch.mock.calls[0][0]).toContain(expectedBaseUrl)

      /** Test savePin */
      await apiService.savePin(mockPin)
      expect(mockFetch.mock.calls[1][0]).toContain(expectedBaseUrl)

      /** Test deletePin */
      await apiService.deletePin('123')
      expect(mockFetch.mock.calls[2][0]).toContain(expectedBaseUrl)

      /** Test deletePinsByUrl */
      await apiService.deletePinsByUrl('http://localhost:3000', 'test@example.com')
      expect(mockFetch.mock.calls[3][0]).toContain(expectedBaseUrl)
    })
  })

  it('logs errors consistently across all methods', async () => {
    const networkError = new Error('Network error')
    mockFetch.mockRejectedValue(networkError)

    /** Test all methods log errors */
    await expect(apiService.getPinsByUrl('url', 'email')).rejects.toThrow()
    expect(console.error).toHaveBeenCalledWith('Error getting pins for URL url:', networkError)

    await expect(apiService.savePin(mockPin)).rejects.toThrow()
    expect(console.error).toHaveBeenCalledWith('Error saving pin:', networkError)

    await expect(apiService.deletePin('123')).rejects.toThrow()
    expect(console.error).toHaveBeenCalledWith('Error deleting pin 123:', networkError)

    await expect(apiService.deletePinsByUrl('url', 'email')).rejects.toThrow()
    expect(console.error).toHaveBeenCalledWith('Error deleting pins for URL url:', networkError)
  })
})
