export class RequestValidator {
  static extractLinkId(url: string): string | null {
    const { searchParams } = new URL(url)
    return searchParams.get("linkId")
  }

  static isValidLinkId(linkId: string | null): linkId is string {
    return Boolean(linkId && linkId.trim().length > 0)
  }

  static validateLinkId(url: string): string {
    const linkId = this.extractLinkId(url)

    if (!this.isValidLinkId(linkId)) {
      throw new ValidationError("linkId is required")
    }

    return linkId
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}