import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { ConflictError } from "./link.service"
import { HTTP_STATUS, ERROR_MESSAGES, LOG_PREFIXES } from "./constants"

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export class ErrorHandler {
  static handle(error: unknown): NextResponse {
    console.error(`${LOG_PREFIXES.LINKS} Request failed`, {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    if (error instanceof ConflictError) {
      return NextResponse.json(
        { message: ERROR_MESSAGES.CODE_IN_USE },
        { status: HTTP_STATUS.CONFLICT }
      )
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        { errors: error.flatten().fieldErrors },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }

    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      )
    }

    return NextResponse.json(
      { message: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    )
  }

  static unauthorized(): NextResponse {
    console.warn(`${LOG_PREFIXES.LINKS} Unauthorized request`)
    return NextResponse.json(
      { message: ERROR_MESSAGES.UNAUTHORIZED },
      { status: HTTP_STATUS.UNAUTHORIZED }
    )
  }
}