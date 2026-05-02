"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const Log = (stack, level, pkg, message) => __awaiter(void 0, void 0, void 0, function* () {
    const token = process.env.NEXT_PUBLIC_API_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwdDEzNzlAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMjA4OSwiaWF0IjoxNzc3NzAxMTg5LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOTlmZmQzNTUtNGY1Yy00MWY1LWI2N2YtMzMyOTQ2ZWNmZmNiIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidCByIHBhdml0aHJhIiwic3ViIjoiMzc2ZTAwOGEtNWM3Yi00NWZhLWI2ODctYmQxZTMwNDFkZmE2In0sImVtYWlsIjoicHQxMzc5QHNybWlzdC5lZHUuaW4iLCJuYW1lIjoidCByIHBhdml0aHJhIiwicm9sbE5vIjoicmEyMzExMDAzMDIwMDE5IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMzc2ZTAwOGEtNWM3Yi00NWZhLWI2ODctYmQxZTMwNDFkZmE2IiwiY2xpZW50U2VjcmV0IjoiTUJKcFZiR1J2dWtUY1BDUyJ9.mAVJWN61oJRSuBJMYfDm8aN-YYbmhQmNIfm1S0ptjzE";
    const url = process.env.NEXT_PUBLIC_LOG_API_URL || "/api/evaluation-service/logs";
    try {
        yield fetch(url, {
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
    }
    catch (e) {
        // Silently fail if logging fails
    }
});
exports.Log = Log;
