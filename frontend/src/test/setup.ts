import '@testing-library/jest-dom'
import { vi } from 'vitest'

/** Mock window.confirm and window.alert */
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: vi.fn(() => true),
})

Object.defineProperty(window, 'alert', {
  writable: true,
  value: vi.fn(),
})

/** Mock window.location */
Object.defineProperty(window, 'location', {
  writable: true,
  value: {
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
  },
})

/** Mock scrollX and scrollY */
Object.defineProperty(window, 'scrollX', {
  writable: true,
  value: 0,
})

Object.defineProperty(window, 'scrollY', {
  writable: true,
  value: 0,
})

/** Mock fetch */
global.fetch = vi.fn()

/** Mock console methods to avoid noise in tests */
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
}
