type FetchAdapterProps = {
  url: string;
  options: RequestInit;
};

export type ApiResponse<T> = {
  data: T | null;
  status: number;
  error: string | null;
};

export async function fetchAdapter<T>({
  url,
  options,
}: FetchAdapterProps): Promise<ApiResponse<T>> {
  const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  try {
    const response = await fetch(`${apiBaseUrl}${url}`, {
      ...options,
      headers: {
        'Content-type': 'application/json',
        ...options.headers,
      },
    });
    const status = response.status;
    const data: T = await response.json();

    if (!response.ok) {
      return {
        data: null,
        status,
        error: `[fetchAdapter] - Erro ao buscar dados em ${url}, status: ${status}`,
      };
    }

    return { data, status, error: null };
  } catch (error) {
    console.error(`[fetchAdapter] - Erro ao buscar dados em ${url}:`, error);
    return {
      data: null,
      status: 500,
      error: `[fetchAdapter] - Erro ao buscar dados em ${url}: ${error}`,
    };
  }
}
