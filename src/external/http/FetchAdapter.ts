import { HttpClient } from '@infra/http/HttpClient.ts'

export class FetchAdapter implements HttpClient {
  async get(url: string): Promise<HttpClient.Response> {
    const response = await fetch(url)
    const responseBody = await this.parseBody(response)
    return {
      statusCode: response.status,
      body: responseBody,
    }
  }

  async post(url: string, body: any): Promise<HttpClient.Response> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const responseBody = await this.parseBody(response)
    return {
      statusCode: response.status,
      body: responseBody,
    }
  }

  async put(url: string, body: any): Promise<HttpClient.Response> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const responseBody = await this.parseBody(response)
    return {
      statusCode: response.status,
      body: responseBody,
    }
  }

  async delete(url: string): Promise<HttpClient.Response> {
    const response = await fetch(url, {
      method: 'DELETE',
    })
    const responseBody = await this.parseBody(response)
    return {
      statusCode: response.status,
      body: responseBody,
    }
  }

  private async parseBody(response: Response): Promise<any> {
    const text = await response.text()
    if (!text.length) return
    return JSON.parse(text)
  }
}
