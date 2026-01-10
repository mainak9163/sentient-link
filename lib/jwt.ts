import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!
console.log("JWT_SECRET:", JWT_SECRET)

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined")
}

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  })
}

export function verifyToken(token: string) {
  console.log("JWT_SECRET:", JWT_SECRET)
  return jwt.verify(token, JWT_SECRET)
}
