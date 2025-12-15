import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { NotFoundError } from "./error.js";
import { envConfig } from "@/env.js";
import type { Session } from "@/types/auth.js";

const getAccessSecret = () => {
  const secretString = envConfig.JWT_ACCESS_SECRET;
  if (!secretString) throw new NotFoundError("JWT_ACCESS_SECRET is not set");
  return new TextEncoder().encode(secretString);
};

const getRefreshSecret = () => {
  const secretString = envConfig.JWT_REFRESH_SECRET;
  if (!secretString) throw new NotFoundError("JWT_REFRESH_SECRET is not set");
  return new TextEncoder().encode(secretString);
};

export const generateAccessToken = async (payload: Session) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m") // short-lived access token
    .sign(getAccessSecret());
};

export const generateRefreshToken = async (payload: Session) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d") // long-lived refresh token
    .sign(getRefreshSecret());
};

export const verifyAccessToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, getAccessSecret());
    return payload as JWTPayload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, getRefreshSecret());
    return payload as JWTPayload;
  } catch {
    return null;
  }
};
