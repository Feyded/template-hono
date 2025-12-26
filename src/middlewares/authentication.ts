import { UserRoleType } from "@/db/types.js";
import { ForbiddenError, UnauthorizedError } from "@/utils/error.js";
import {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/utils/jwt.js";
import type { Context, Next } from "hono";
import { setCookie, getCookie } from "hono/cookie";

export function authenticationMiddleware(requiredRoles: UserRoleType[] = []) {
  return async (c: Context, next: Next) => {
    let accessToken = getCookie(c, "auth__access_token");

    let verifiedAccessToken = accessToken
      ? await verifyAccessToken(accessToken)
      : null;

    if (!verifiedAccessToken) {
      const refreshToken = getCookie(c, "auth__refresh_token");

      if (!refreshToken) {
        throw new UnauthorizedError("refresh token is required");
      }

      const verifiedRefreshToken = await verifyRefreshToken(refreshToken);

      if (!verifiedRefreshToken) {
        throw new UnauthorizedError("Invalid Refresh token");
      }

      accessToken = await generateAccessToken({
        id: verifiedRefreshToken.id as string,
        mobile_number: verifiedRefreshToken.mobile_number as string,
        role: verifiedRefreshToken.role as string,
      });

      setCookie(c, "auth__access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
      });

      verifiedAccessToken = await verifyAccessToken(accessToken);
    }

    if (
      requiredRoles.length > 0 &&
      !requiredRoles.includes(verifiedAccessToken?.role as UserRoleType)
    ) {
      throw new ForbiddenError(
        "You do not have permission to perform this action."
      );
    }

    c.set("session", {
      id: verifiedAccessToken?.id,
      mobile_number: verifiedAccessToken?.mobile_number,
      role: verifiedAccessToken?.role,
    });

    return next();
  };
}
