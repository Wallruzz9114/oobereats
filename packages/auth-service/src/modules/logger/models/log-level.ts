export enum LogLevel {
  /** Critical error, system stability is affected. */
  Error = 'error',
  /** Non-critical error, system stability is not affected, but issue should be investigated. */
  Warn = 'warn',
  /** Informative message. */
  Info = 'info',
  /** HTTP access logging. */
  HTTP = 'http',
  /** More verbose informative message. */
  Verbose = 'verbose',
  /** Message to assist with debugging. */
  Debug = 'debug',
  /** Unnecessarily noisy or frequent message. */
  Silly = 'silly',
}
