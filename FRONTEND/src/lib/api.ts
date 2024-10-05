export const baseUrl = process.env.API_URL || 'http://127.0.0.1:8001/';
type TResponse<T> = {
  data?: T;
  error?: { error: string };
};
const getToken = async () => {
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers');
    return cookies().get('access')?.value;
  } else {
    return document.cookie.replace(
      /(?:(?:^|.*;\s*)access\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
  }
};
export const api = async <T>(
  endpoint: string | URL,
  init?: RequestInit | undefined
): Promise<TResponse<T>> => {
  const token = await getToken();
  const res = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
    method: init?.method,
    body: init?.body,
    next: { tags: init?.next?.tags },
  });
  if (res.ok) return { data: await res.json() };
  return { error: await res.json() };
};
