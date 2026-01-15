import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken"

/* =========================
   ENV VALIDATION
========================= */

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT secrets are not defined")
}

const ACCESS_SECRET_KEY: Secret = ACCESS_SECRET
const REFRESH_SECRET_KEY: Secret = REFRESH_SECRET

/* =========================
   ACCESS TOKEN
========================= */

export function signAccessToken(payload: object): string {
  const options: SignOptions = {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"] ?? "15m",
  }

  return jwt.sign(payload, ACCESS_SECRET_KEY, options)
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET_KEY) as JwtPayload
}

/* =========================
   REFRESH TOKEN
========================= */

export function signRefreshToken(payload: object): string {
  const options: SignOptions = {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"] ?? "7d",
  }

  return jwt.sign(payload, REFRESH_SECRET_KEY, options)
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET_KEY) as JwtPayload
}
