
interface LogContext {
  component?: string;
  action?: string;
  endpoint?: string;
  status?: number;
  data?: any;
  error?: any;
  timestamp?: string;
}

class LoggingService {
  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = this.formatTimestamp();
    const contextStr = context ? JSON.stringify(context, null, 2) : '';
    return `[${timestamp}] ${level}: ${message}${contextStr ? '\n' + contextStr : ''}`;
  }

  // API Request Logging
  logApiRequest(endpoint: string, method: string, context?: any) {
    console.log(`🔄 API REQUEST: ${method} ${endpoint}`, {
      endpoint,
      method,
      timestamp: this.formatTimestamp(),
      ...context
    });
  }

  logApiSuccess(endpoint: string, method: string, status: number, data?: any) {
    console.log(`✅ API SUCCESS: ${method} ${endpoint} (${status})`, {
      endpoint,
      method,
      status,
      dataCount: Array.isArray(data) ? data.length : data ? Object.keys(data).length : 0,
      timestamp: this.formatTimestamp()
    });
  }

  logApiError(endpoint: string, method: string, error: any, context?: any) {
    console.error(`❌ API ERROR: ${method} ${endpoint}`, {
      endpoint,
      method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      errorData: error.response?.data,
      errorMessage: error.message,
      timestamp: this.formatTimestamp(),
      ...context
    });
  }

  // Authentication Logging
  logAuthAttempt(action: string, context?: any) {
    console.log(`🔐 AUTH: ${action}`, {
      action,
      timestamp: this.formatTimestamp(),
      ...context
    });
  }

  logAuthSuccess(action: string, user?: any) {
    console.log(`✅ AUTH SUCCESS: ${action}`, {
      action,
      user: user ? { id: user.user_id, username: user.username } : 'unknown',
      timestamp: this.formatTimestamp()
    });
  }

  logAuthError(action: string, error: any) {
    console.error(`❌ AUTH ERROR: ${action}`, {
      action,
      error: error.message,
      status: error.response?.status,
      timestamp: this.formatTimestamp()
    });
  }

  // Redux State Logging
  logReduxAction(action: string, payload?: any) {
    console.log(`🏪 REDUX: ${action}`, {
      action,
      payload: payload ? (Array.isArray(payload) ? `${payload.length} items` : typeof payload) : 'none',
      timestamp: this.formatTimestamp()
    });
  }

  logReduxError(action: string, error: any) {
    console.error(`❌ REDUX ERROR: ${action}`, {
      action,
      error,
      timestamp: this.formatTimestamp()
    });
  }

  // Component Lifecycle Logging
  logComponentMount(componentName: string) {
    console.log(`🔄 COMPONENT: ${componentName} mounted`, {
      component: componentName,
      action: 'mount',
      timestamp: this.formatTimestamp()
    });
  }

  logComponentError(componentName: string, error: any) {
    console.error(`❌ COMPONENT ERROR: ${componentName}`, {
      component: componentName,
      error: error.message || error,
      stack: error.stack,
      timestamp: this.formatTimestamp()
    });
  }

  // Navigation Logging
  logNavigation(from: string, to: string) {
    console.log(`🧭 NAVIGATION: ${from} → ${to}`, {
      from,
      to,
      timestamp: this.formatTimestamp()
    });
  }

  // Data Processing Logging
  logDataProcess(operation: string, dataCount: number, context?: any) {
    console.log(`📊 DATA: ${operation}`, {
      operation,
      count: dataCount,
      timestamp: this.formatTimestamp(),
      ...context
    });
  }

  // Performance Logging
  logPerformance(operation: string, duration: number, context?: any) {
    const level = duration > 1000 ? '⚠️' : duration > 500 ? '⏳' : '⚡';
    console.log(`${level} PERFORMANCE: ${operation} (${duration}ms)`, {
      operation,
      duration,
      timestamp: this.formatTimestamp(),
      ...context
    });
  }

  // General Error Logging
  logError(source: string, error: any, context?: any) {
    console.error(`❌ ERROR in ${source}:`, {
      source,
      message: error.message || error,
      stack: error.stack,
      timestamp: this.formatTimestamp(),
      ...context
    });
  }

  // General Info Logging
  logInfo(message: string, context?: any) {
    console.log(`ℹ️ INFO: ${message}`, {
      message,
      timestamp: this.formatTimestamp(),
      ...context
    });
  }

  // Debug Logging (only in development)
  logDebug(message: string, context?: any) {
    if (import.meta.env.DEV) {
      console.debug(`🐛 DEBUG: ${message}`, {
        message,
        timestamp: this.formatTimestamp(),
        ...context
      });
    }
  }

  // Warn Logging
  logWarn(message: string, context?: any) {
    console.warn(`⚠️ WARN: ${message}`, {
      message,
      timestamp: this.formatTimestamp(),
      ...context
    });
  }
}

export const logger = new LoggingService();
