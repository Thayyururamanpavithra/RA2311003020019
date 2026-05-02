export const Log = async (
  stack: 'frontend' | 'backend',
  level: 'info' | 'debug' | 'error' | 'warn',
  pkg:
    | 'api'
    | 'component'
    | 'hook'
    | 'page'
    | 'state'
    | 'style'
    | 'auth'
    | 'config'
    | 'middleware'
    | 'utils',
  message: string
) => {
  const token = process.env.NEXT_PUBLIC_API_TOKEN;
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ||
    'http://20.207.122.201/evaluation-service';
  const url =
    process.env.NEXT_PUBLIC_LOG_API_URL || `${base}/logs`;

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });
  } catch {
    /* logging must not break the app */
  }
};
