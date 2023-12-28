declare global {
  interface ErrorConstructor {
    captureStackTrace(targetObject: Object, constructorOpt?: Function): void;
  }
}

export class RefundableError extends Error {
  constructor(...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RefundableError);
    }

    Object.setPrototypeOf(this, RefundableError.prototype);
    this.name = "RefundableError";
  }
}

export class NoCreditsError extends Error {
  constructor(...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NoCreditsError);
    }

    this.name = "NoCreditsError";

    Object.setPrototypeOf(this, NoCreditsError.prototype);
  }
}

export class DatabaseError extends Error {
  public statusCode: number;
  constructor(message, statusCode) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
    }
    this.statusCode = statusCode || 500;

    this.name = "DatabaseError";

    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

export class DuplicateDocumentError extends DatabaseError {
  constructor(message) {
    super(message, 409);
    this.name = "DuplicateDocumentError";
    Object.setPrototypeOf(this, DuplicateDocumentError.prototype);
  }
}
export class ApplicationError extends Error {
  constructor(
    message: string,
    public data: Record<string, any> = {},
  ) {
    super(message);
  }
}

export class UserError extends ApplicationError {}

export interface GeneratedAnswerErrorPayload {
  message?: string;
  code?: number;
}

export class FatalError extends Error {
  constructor(public payload: GeneratedAnswerErrorPayload) {
    super(payload.message);
  }
}

export class RetryableError extends Error {}
