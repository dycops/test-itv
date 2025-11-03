const apiRoutes: Record<string, string> = {
  '/api/users/123': '/test-itv/api/users/123.json',
  '/api/weather?city=Moscow': '/test-itv/api/weather/moscow.json',
  '/api/weather?city=London': '/test-itv/api/weather/london.json',
  '/api/stocks?symbols=AAPL,GOOG': '/test-itv/api/stocks/aapl-goog.json',
  '/api/dashboard': '/test-itv/api/dashboard.json',
}

const originalFetch = window.fetch

export function initApiMocks() {
  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url

    if (url.startsWith('/api/')) {
      try {
        let mockPath: string | undefined

        if (url === '/api/dashboard') {
          mockPath = apiRoutes['/api/dashboard']
        } else if (url.startsWith('/api/users/123')) {
          mockPath = apiRoutes['/api/users/123']
        } else if (url.startsWith('/api/weather')) {
          const urlObj = new URL(url, window.location.origin)
          const city = urlObj.searchParams.get('city')
          if (city === 'Moscow') {
            mockPath = apiRoutes['/api/weather?city=Moscow']
          } else if (city === 'London') {
            mockPath = apiRoutes['/api/weather?city=London']
          }
        } else if (url.startsWith('/api/stocks')) {
          const urlObj = new URL(url, window.location.origin)
          const symbols = urlObj.searchParams.get('symbols')
          if (symbols === 'AAPL,GOOG') {
            mockPath = apiRoutes['/api/stocks?symbols=AAPL,GOOG']
          }
        }

        if (mockPath) {
          return originalFetch(mockPath, init)
        }
      } catch (error) {
        console.error('Ошибка при загрузке мока:', error)
      }
    }

    return originalFetch(input, init)
  } as typeof fetch
}
