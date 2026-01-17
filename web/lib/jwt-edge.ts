import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function verifyEdgeToken(token: string) {
  console.log("came here")
    const { payload } = await jwtVerify(token, secret)
    console.log("paylod:", payload)
  return payload
}
