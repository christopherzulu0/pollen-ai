/**
 * User-Friendly Error Messages Library
 * Converts technical API errors into clear, actionable messages for users
 */

export interface ErrorResponse {
  title: string
  message: string
  action?: string
}

/**
 * Error context types for different API operations
 */
export type ErrorContext = 'loan' | 'vote' | 'group' | 'fetch' | 'balance-fetch' | 'contribution'

/**
 * Check if error is an Axios error
 */
function isAxiosError(error: any): boolean {
  return error?.isAxiosError === true || (error?.response && error?.config)
}

/**
 * Extract message from Axios error
 */
function getAxiosErrorMessage(error: any): string {
  if (error.response?.data?.error) {
    return error.response.data.error
  }
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.message) {
    return error.message
  }
  return `Error ${error.response?.status || 'unknown'}`
}

/**
 * Get status code from error
 */
function getErrorStatusCode(error: any): number | null {
  // Axios error
  if (error?.response?.status) {
    return error.response.status
  }
  // Fetch error with status in message
  if (error instanceof Error) {
    const match = error.message.match(/(\d{3})/)
    if (match) {
      return parseInt(match[1])
    }
  }
  return null
}

/**
 * Convert API error to user-friendly message
 */
export function getErrorMessage(error: unknown): ErrorResponse {
  // Handle Axios errors
  if (isAxiosError(error)) {
    const axiosError = error as any
    const errorMessage = getAxiosErrorMessage(axiosError).toLowerCase()
    const statusCode = axiosError.response?.status
    
    // Check status code first
    if (statusCode === 401) {
      return {
        title: "Not Signed In",
        message: "Please sign in to continue. Your session may have expired.",
        action: "Sign in to your account"
      }
    }
    
    if (statusCode === 403) {
      return {
        title: "Access Denied",
        message: "You don't have permission to perform this action. Please contact your group admin.",
        action: "Contact your group admin"
      }
    }
    
    if (statusCode === 404) {
      return {
        title: "Not Found",
        message: "The item you're looking for doesn't exist or has been removed.",
        action: "Refresh the page"
      }
    }
    
    if (statusCode >= 500) {
      return {
        title: "Server Problem",
        message: "Something went wrong on our end. Our team has been notified. Please try again in a few moments.",
        action: "Try again in a few moments"
      }
    }
    
    if (statusCode === 429) {
      return {
        title: "Too Many Requests",
        message: "You're doing that too quickly. Please wait a moment and try again.",
        action: "Wait a moment before trying again"
      }
    }
    
    // Check error message content
    return parseErrorMessage(errorMessage)
  }

  // Handle fetch/network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      title: "Connection Problem",
      message: "We couldn't connect to the server. Please check your internet connection and try again.",
      action: "Check your internet connection"
    }
  }

  // Handle Error objects with custom messages
  if (error instanceof Error) {
    const statusCode = getErrorStatusCode(error)
    
    // Check status code
    if (statusCode === 401) {
      return {
        title: "Not Signed In",
        message: "Please sign in to continue. Your session may have expired.",
        action: "Sign in to your account"
      }
    }
    
    if (statusCode === 403) {
      return {
        title: "Access Denied",
        message: "You don't have permission to perform this action. Please contact your group admin.",
        action: "Contact your group admin"
      }
    }
    
    if (statusCode === 404) {
      return {
        title: "Not Found",
        message: "The item you're looking for doesn't exist or has been removed.",
        action: "Refresh the page"
      }
    }
    
    if (statusCode && statusCode >= 500) {
      return {
        title: "Server Problem",
        message: "Something went wrong on our end. Our team has been notified. Please try again in a few moments.",
        action: "Try again in a few moments"
      }
    }
    
    if (statusCode === 429) {
      return {
        title: "Too Many Requests",
        message: "You're doing that too quickly. Please wait a moment and try again.",
        action: "Wait a moment before trying again"
      }
    }

    const message = error.message.toLowerCase()
    return parseErrorMessage(message, error.message)

  }

  // Default error message for unknown errors
  return {
    title: "Something Went Wrong",
    message: "An unexpected error occurred. Please try again or contact support if the problem persists.",
    action: "Try again"
  }
}

/**
 * Parse error message content for specific patterns
 */
function parseErrorMessage(message: string, originalMessage?: string): ErrorResponse {
  // Validation errors
  if (message.includes('validation') || message.includes('invalid')) {
      return {
        title: "Invalid Information",
        message: "Please check your information and try again. Some fields may have invalid values.",
        action: "Review your information"
      }
    }

  // Timeout errors
  if (message.includes('timeout') || message.includes('timed out')) {
      return {
        title: "Request Timeout",
        message: "The request took too long to complete. Please check your connection and try again.",
        action: "Check your connection"
      }
    }

    // Already exists errors
    if (message.includes('already exists') || message.includes('duplicate')) {
      return {
        title: "Already Exists",
        message: "This item already exists. Please check and try with different information.",
        action: "Use different information"
      }
    }

    // Insufficient funds/balance errors
    if (message.includes('insufficient') || message.includes('not enough')) {
      return {
        title: "Insufficient Balance",
        message: "You don't have enough balance to complete this action.",
        action: "Add funds to continue"
      }
    }

    // Group membership errors
    if (message.includes('not a member') || message.includes('membership')) {
      return {
        title: "Membership Required",
        message: "You need to be a member of this group to perform this action.",
        action: "Join the group first"
      }
    }

    // Vote already cast errors
    if (message.includes('already voted')) {
      return {
        title: "Already Voted",
        message: "You have already cast your vote on this request.",
        action: "Wait for voting results"
      }
    }

    // Loan limit errors
    if (message.includes('loan limit') || message.includes('maximum loans')) {
      return {
        title: "Loan Limit Reached",
        message: "You have reached the maximum number of active loans. Please repay existing loans before requesting a new one.",
        action: "Repay existing loans"
      }
    }

    // Group limit errors
    if (message.includes('group limit') || message.includes('maximum groups')) {
      return {
        title: "Group Limit Reached",
        message: "You have reached the maximum number of groups you can join (2 groups).",
        action: "Leave a group to join another"
      }
    }

    // Voting period errors
    if (message.includes('voting closed') || message.includes('voting ended')) {
      return {
        title: "Voting Closed",
        message: "The voting period for this request has ended.",
        action: "View voting results"
      }
    }

  // Return the original error message if it's already user-friendly (no status codes)
  if (originalMessage && !message.match(/\d{3}/) && originalMessage.length < 200) {
    return {
      title: "Error",
      message: originalMessage,
      action: "Please try again"
    }
  }

  // Default error message for unknown errors
  return {
    title: "Something Went Wrong",
    message: "An unexpected error occurred. Please try again or contact support if the problem persists.",
    action: "Try again"
  }
}

/**
 * Specific error handlers for common API operations
 */

export function getLoanSubmissionError(error: unknown): ErrorResponse {
  const baseError = getErrorMessage(error)
  
  // Get message from either regular Error or Axios error
  let message = ''
  if (isAxiosError(error)) {
    message = getAxiosErrorMessage(error).toLowerCase()
  } else if (error instanceof Error) {
    message = error.message.toLowerCase()
  }
  
  if (message) {
    
    if (message.includes('group not found')) {
      return {
        title: "Group Not Found",
        message: "The group you selected no longer exists or you don't have access to it.",
        action: "Select a different group"
      }
    }

    if (message.includes('amount') && message.includes('exceed')) {
      return {
        title: "Amount Too Large",
        message: "The loan amount exceeds the group's lending limit or your borrowing capacity.",
        action: "Request a smaller amount"
      }
    }

    if (message.includes('repayment date')) {
      return {
        title: "Invalid Repayment Date",
        message: "The repayment date must be in the future and within the allowed timeframe.",
        action: "Choose a valid repayment date"
      }
    }
  }

  return baseError
}

export function getVotingError(error: unknown): ErrorResponse {
  const baseError = getErrorMessage(error)
  
  // Get message from either regular Error or Axios error
  let message = ''
  if (isAxiosError(error)) {
    message = getAxiosErrorMessage(error).toLowerCase()
  } else if (error instanceof Error) {
    message = error.message.toLowerCase()
  }
  
  if (message) {
    
    if (message.includes('not active') || message.includes('suspended')) {
      return {
        title: "Membership Inactive",
        message: "Your membership in this group is not active. Only active members can vote.",
        action: "Contact group admin"
      }
    }

    if (message.includes('loan request not found')) {
      return {
        title: "Request Not Found",
        message: "This loan request no longer exists or has been withdrawn.",
        action: "Refresh the page"
      }
    }

    if (message.includes('already approved') || message.includes('already rejected')) {
      return {
        title: "Voting Complete",
        message: "This loan request has already been decided and voting has closed.",
        action: "View the decision"
      }
    }
  }

  return baseError
}

export function getGroupFetchError(error: unknown): ErrorResponse {
  const baseError = getErrorMessage(error)
  
  // Get message from either regular Error or Axios error
  let message = ''
  if (isAxiosError(error)) {
    message = getAxiosErrorMessage(error).toLowerCase()
  } else if (error instanceof Error) {
    message = error.message.toLowerCase()
  }
  
  if (message) {
    
    if (message.includes('no groups found') || message.includes('empty')) {
      return {
        title: "No Groups Found",
        message: "You are not a member of any groups yet. Join or create a group to get started.",
        action: "Create or join a group"
      }
    }
  }

  return baseError
}

export function getLoanFetchError(error: unknown): ErrorResponse {
  const baseError = getErrorMessage(error)
  
  // Get message from either regular Error or Axios error
  let message = ''
  if (isAxiosError(error)) {
    message = getAxiosErrorMessage(error).toLowerCase()
  } else if (error instanceof Error) {
    message = error.message.toLowerCase()
  }
  
  if (message) {
    
    if (message.includes('no loans found')) {
      return {
        title: "No Loan Requests",
        message: "There are no loan requests at the moment.",
        action: "Check back later"
      }
    }
  }

  return baseError
}

export function getBalanceFetchError(error: unknown): ErrorResponse {
  const baseError = getErrorMessage(error)
  
  // Get message from either regular Error or Axios error
  let message = ''
  if (isAxiosError(error)) {
    message = getAxiosErrorMessage(error).toLowerCase()
  } else if (error instanceof Error) {
    message = error.message.toLowerCase()
  }
  
  if (message) {
    if (message.includes('wallet not found')) {
      return {
        title: "Wallet Not Found",
        message: "Your wallet hasn't been set up yet. We'll create one for you automatically.",
        action: "Refresh the page"
      }
    }
    
    if (message.includes('balance')) {
      return {
        title: "Balance Unavailable",
        message: "We couldn't fetch your current balance. Please try again.",
        action: "Refresh the page"
      }
    }
  }

  return baseError
}

export function getContributionError(error: unknown): ErrorResponse {
  const baseError = getErrorMessage(error)
  
  // Get message from either regular Error or Axios error
  let message = ''
  if (isAxiosError(error)) {
    message = getAxiosErrorMessage(error).toLowerCase()
  } else if (error instanceof Error) {
    message = error.message.toLowerCase()
  }
  
  if (message) {
    if (message.includes('group not found')) {
      return {
        title: "Group Not Found",
        message: "The group you're trying to contribute to no longer exists or you don't have access.",
        action: "Select a different group"
      }
    }
    
    if (message.includes('not a member')) {
      return {
        title: "Not a Member",
        message: "You must be an active member of this group to make contributions.",
        action: "Join the group first"
      }
    }
    
    if (message.includes('insufficient')) {
      return {
        title: "Insufficient Balance",
        message: "You don't have enough funds in your wallet to make this contribution.",
        action: "Add funds to your wallet"
      }
    }
    
    if (message.includes('amount') && (message.includes('invalid') || message.includes('minimum'))) {
      return {
        title: "Invalid Amount",
        message: "The contribution amount is invalid. Please check the group's contribution requirements.",
        action: "Enter a valid amount"
      }
    }
    
    if (message.includes('suspended') || message.includes('inactive')) {
      return {
        title: "Membership Inactive",
        message: "Your membership in this group is not active. Please contact the group admin.",
        action: "Contact group admin"
      }
    }
  }

  return baseError
}

/**
 * Format error for toast notification
 */
export function formatErrorForToast(error: unknown, context?: ErrorContext): {
  title: string
  description: string
} {
  let errorResponse: ErrorResponse

  switch (context) {
    case 'loan':
      errorResponse = getLoanSubmissionError(error)
      break
    case 'vote':
      errorResponse = getVotingError(error)
      break
    case 'group':
      errorResponse = getGroupFetchError(error)
      break
    case 'fetch':
      errorResponse = getLoanFetchError(error)
      break
    case 'balance-fetch':
      errorResponse = getBalanceFetchError(error)
      break
    case 'contribution':
      errorResponse = getContributionError(error)
      break
    default:
      errorResponse = getErrorMessage(error)
  }

  return {
    title: errorResponse.title,
    description: errorResponse.message + (errorResponse.action ? ` • ${errorResponse.action}` : '')
  }
}

