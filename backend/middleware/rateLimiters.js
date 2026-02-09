import rateLimit from 'express-rate-limit'

const DEFAULT_MESSAGE = 'Too many requests, please try again later.'

const resolveMessage = (message) => {
  return typeof message === 'string' ? message : DEFAULT_MESSAGE
}

const limiterHandler = (req, res, next, options) => {
  const message = resolveMessage(options?.message)
  res.status(options?.statusCode || 429).json({ error: message })
}

const createLimiter = (overrides) => {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    standardHeaders: true,
    legacyHeaders: false,
    handler: limiterHandler,
    ...overrides
  })
}

export const apiLimiter = createLimiter({
  max: 300
})

export const orderLimiter = createLimiter({
  max: 20,
  message: 'Too many orders sent. Please try again later.'
})

export const paymentLimiter = createLimiter({
  max: 30,
  message: 'Too many payment attempts. Please try again later.'
})

export const contactLimiter = createLimiter({
  max: 10,
  message: 'Too many contact requests. Please try again later.'
})
