export const Log = async (
  stack: "frontend" | "backend",
  level: "info" | "debug" | "error" | "warn",
  pkg: "api" | "component" | "hook" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils",
  message: string
) => {
  const token = process.env.NEXT_PUBLIC_API_TOKEN;
  const url = process.env.NEXT_PUBLIC_LOG_API_URL || "http://20.244.56.144/evaluation-service/logs";
  
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message
      })
    });
  } catch (e) {
    // Silently fail if logging fails
  }
};
