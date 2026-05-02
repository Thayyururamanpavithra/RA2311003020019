export const Log = async (
  stack: "frontend" | "backend",
  level: "info" | "debug" | "error" | "warn",
  pkg: "api" | "component" | "hook" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils",
  message: string
) => {
  const token = process.env.NEXT_PUBLIC_API_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwdDEzNzlAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMjA4OSwiaWF0IjoxNzc3NzAxMTg5LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOTlmZmQzNTUtNGY1Yy00MWY1LWI2N2YtMzMyOTQ2ZWNmZmNiIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidCByIHBhdml0aHJhIiwic3ViIjoiMzc2ZTAwOGEtNWM3Yi00NWZhLWI2ODctYmQxZTMwNDFkZmE2In0sImVtYWlsIjoicHQxMzc5QHNybWlzdC5lZHUuaW4iLCJuYW1lIjoidCByIHBhdml0aHJhIiwicm9sbE5vIjoicmEyMzExMDAzMDIwMDE5IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMzc2ZTAwOGEtNWM3Yi00NWZhLWI2ODctYmQxZTMwNDFkZmE2IiwiY2xpZW50U2VjcmV0IjoiTUJKcFZiR1J2dWtUY1BDUyJ9.mAVJWN61oJRSuBJMYfDm8aN-YYbmhQmNIfm1S0ptjzE";
  const url = process.env.NEXT_PUBLIC_LOG_API_URL || "/api/evaluation-service/logs";
  
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
