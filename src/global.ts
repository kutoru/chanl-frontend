// Global variables and utility functions

const apiurl = "192.168.1.12:4000/api"

async function fetchWithTimeout(url: string, options: any) {
  let timeout = 5000
  if (options && options.timeout) {
    timeout = options.timeout
  }

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  const response = await fetch(url, {
    ...options,
    signal: controller.signal,
  })
  clearTimeout(id)

  return response
}

export { apiurl, fetchWithTimeout }
