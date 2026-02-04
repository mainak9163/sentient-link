import { NextResponse } from "next/server"
import { LinkNotFoundError } from "./agent-sync.service"
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
    console.error(`${LOG_PREFIXES.AGENT_SYNC} Request failed`, {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    if (error instanceof LinkNotFoundError) {
      return NextResponse.json(
        { message: ERROR_MESSAGES.LINK_NOT_FOUND },
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
    console.warn(`${LOG_PREFIXES.AGENT_SYNC} Unauthorized request`)
    return NextResponse.json(
      { message: ERROR_MESSAGES.UNAUTHORIZED },
      { status: HTTP_STATUS.UNAUTHORIZED }
    )
  }

  static missingLinkId(): NextResponse {
    console.warn(`${LOG_PREFIXES.AGENT_SYNC} Missing linkId parameter`)
    return NextResponse.json(
      { message: ERROR_MESSAGES.MISSING_LINK_ID },
      { status: HTTP_STATUS.BAD_REQUEST }
    )
  }
}