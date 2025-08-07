import { toast } from 'sonner';
import CryptoJS from 'crypto-js';

// Security Configuration
const SECURITY_CONFIG = {
  // Encryption
  ENCRYPTION_KEY: import.meta.env.VITE_ENCRYPTION_KEY || 'yapee-vietnam-default-key-2024',
  
  // Session
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  
  // Password Policy
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SPECIAL: true,
  
  // Rate Limiting
  API_RATE_LIMIT: 100, // requests per minute
  
  // CSRF
  CSRF_TOKEN_LENGTH: 32,
  
  // Content Security
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
};

// Interfaces
export interface SecurityValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface LoginAttempt {
  email: string;
  timestamp: number;
  success: boolean;
  ip?: string;
}

export interface SessionData {
  userId: string;
  email: string;
  role: string;
  loginTime: number;
  lastActivity: number;
  csrfToken: string;
}

// Rate Limiting Class
class RateLimiter {
  private attempts = new Map<string, number[]>();
  
  isAllowed(identifier: string, limit: number = SECURITY_CONFIG.API_RATE_LIMIT): boolean {
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window
    
    if (!this.attempts.has(identifier)) {
      this.attempts.set(identifier, []);
    }
    
    const userAttempts = this.attempts.get(identifier)!;
    
    // Remove old attempts
    const recentAttempts = userAttempts.filter(time => time > windowStart);
    this.attempts.set(identifier, recentAttempts);
    
    if (recentAttempts.length >= limit) {
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    
    return true;
  }
  
  getRemainingAttempts(identifier: string, limit: number = SECURITY_CONFIG.API_RATE_LIMIT): number {
    const now = Date.now();
    const windowStart = now - 60000;
    
    if (!this.attempts.has(identifier)) {
      return limit;
    }
    
    const recentAttempts = this.attempts.get(identifier)!
      .filter(time => time > windowStart);
    
    return Math.max(0, limit - recentAttempts.length);
  }
}

// Security Service Class
class SecurityService {
  private rateLimiter = new RateLimiter();
  private loginAttempts = new Map<string, LoginAttempt[]>();
  private sessionData: SessionData | null = null;
  
  /**
   * Validate password strength
   */
  validatePassword(password: string): SecurityValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
      errors.push(`Mật khẩu phải có ít nhất ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} ký tự`);
    }
    
    if (SECURITY_CONFIG.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('Mật khẩu phải chứa ít nhất 1 chữ hoa');
    }
    
    if (SECURITY_CONFIG.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('Mật khẩu phải chứa ít nhất 1 chữ thường');
    }
    
    if (SECURITY_CONFIG.PASSWORD_REQUIRE_NUMBERS && !/\d/.test(password)) {
      errors.push('Mật khẩu phải chứa ít nhất 1 số');
    }
    
    if (SECURITY_CONFIG.PASSWORD_REQUIRE_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt');
    }
    
    // Common password patterns
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /admin/i,
      /letmein/i
    ];
    
    if (commonPatterns.some(pattern => pattern.test(password))) {
      warnings.push('Mật khẩu này quá phổ biến, hãy chọn mật khẩu khác');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * Validate email format
   */
  validateEmail(email: string): SecurityValidationResult {
    const errors: string[] = [];
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Định dạng email không hợp lệ');
    }
    
    // Check for suspicious patterns
    if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
      errors.push('Email chứa ký tự không hợp lệ');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Sanitize input to prevent XSS
   */
  sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  
  /**
   * Validate file upload
   */
  validateFileUpload(file: File): SecurityValidationResult {
    const errors: string[] = [];
    
    // Check file type
    if (!SECURITY_CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
      errors.push('Loại file không được phép. Chỉ chấp nhận: ' + 
        SECURITY_CONFIG.ALLOWED_FILE_TYPES.join(', '));
    }
    
    // Check file size
    if (file.size > SECURITY_CONFIG.MAX_FILE_SIZE) {
      const maxSizeMB = SECURITY_CONFIG.MAX_FILE_SIZE / (1024 * 1024);
      errors.push(`Kích thước file vượt quá ${maxSizeMB}MB`);
    }
    
    // Check file name
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.js', '.vbs'];
    if (suspiciousExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
      errors.push('Tên file chứa phần mở rộng không an toàn');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Generate CSRF token
   */
  generateCSRFToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < SECURITY_CONFIG.CSRF_TOKEN_LENGTH; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  /**
   * Validate CSRF token
   */
  validateCSRFToken(token: string): boolean {
    if (!this.sessionData) {
      return false;
    }
    return this.sessionData.csrfToken === token;
  }
  
  /**
   * Encrypt sensitive data
   */
  encrypt(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, SECURITY_CONFIG.ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Lỗi mã hóa dữ liệu');
    }
  }
  
  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECURITY_CONFIG.ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Lỗi giải mã dữ liệu');
    }
  }
  
  /**
   * Hash password
   */
  hashPassword(password: string, salt?: string): string {
    const saltToUse = salt || CryptoJS.lib.WordArray.random(128/8).toString();
    const hash = CryptoJS.PBKDF2(password, saltToUse, {
      keySize: 256/32,
      iterations: 10000
    }).toString();
    return `${saltToUse}:${hash}`;
  }
  
  /**
   * Verify password
   */
  verifyPassword(password: string, hashedPassword: string): boolean {
    try {
      const [salt, hash] = hashedPassword.split(':');
      const computedHash = CryptoJS.PBKDF2(password, salt, {
        keySize: 256/32,
        iterations: 10000
      }).toString();
      return hash === computedHash;
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }
  
  /**
   * Check rate limiting
   */
  checkRateLimit(identifier: string, action: string = 'api'): boolean {
    const key = `${action}:${identifier}`;
    return this.rateLimiter.isAllowed(key);
  }
  
  /**
   * Record login attempt
   */
  recordLoginAttempt(email: string, success: boolean, ip?: string): void {
    if (!this.loginAttempts.has(email)) {
      this.loginAttempts.set(email, []);
    }
    
    const attempts = this.loginAttempts.get(email)!;
    attempts.push({
      email,
      timestamp: Date.now(),
      success,
      ip
    });
    
    // Keep only recent attempts (last 24 hours)
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentAttempts = attempts.filter(attempt => attempt.timestamp > oneDayAgo);
    this.loginAttempts.set(email, recentAttempts);
  }
  
  /**
   * Check if account is locked
   */
  isAccountLocked(email: string): boolean {
    const attempts = this.loginAttempts.get(email) || [];
    const recentFailures = attempts
      .filter(attempt => 
        !attempt.success && 
        Date.now() - attempt.timestamp < SECURITY_CONFIG.LOCKOUT_DURATION
      );
    
    return recentFailures.length >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS;
  }
  
  /**
   * Get remaining lockout time
   */
  getLockoutTimeRemaining(email: string): number {
    const attempts = this.loginAttempts.get(email) || [];
    const recentFailures = attempts.filter(attempt => !attempt.success);
    
    if (recentFailures.length < SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
      return 0;
    }
    
    const lastFailure = Math.max(...recentFailures.map(attempt => attempt.timestamp));
    const lockoutEnd = lastFailure + SECURITY_CONFIG.LOCKOUT_DURATION;
    
    return Math.max(0, lockoutEnd - Date.now());
  }
  
  /**
   * Create secure session
   */
  createSession(userId: string, email: string, role: string): SessionData {
    const sessionData: SessionData = {
      userId,
      email,
      role,
      loginTime: Date.now(),
      lastActivity: Date.now(),
      csrfToken: this.generateCSRFToken()
    };
    
    this.sessionData = sessionData;
    
    // Store in localStorage with encryption
    const encryptedSession = this.encrypt(JSON.stringify(sessionData));
    localStorage.setItem('yapee_session', encryptedSession);
    
    return sessionData;
  }
  
  /**
   * Validate session
   */
  validateSession(): boolean {
    try {
      const encryptedSession = localStorage.getItem('yapee_session');
      if (!encryptedSession) {
        return false;
      }
      
      const sessionJson = this.decrypt(encryptedSession);
      const session: SessionData = JSON.parse(sessionJson);
      
      // Check session timeout
      if (Date.now() - session.lastActivity > SECURITY_CONFIG.SESSION_TIMEOUT) {
        this.destroySession();
        return false;
      }
      
      // Update last activity
      session.lastActivity = Date.now();
      this.sessionData = session;
      
      // Update stored session
      const updatedEncryptedSession = this.encrypt(JSON.stringify(session));
      localStorage.setItem('yapee_session', updatedEncryptedSession);
      
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      this.destroySession();
      return false;
    }
  }
  
  /**
   * Get current session
   */
  getCurrentSession(): SessionData | null {
    if (this.validateSession()) {
      return this.sessionData;
    }
    return null;
  }
  
  /**
   * Destroy session
   */
  destroySession(): void {
    this.sessionData = null;
    localStorage.removeItem('yapee_session');
    
    // Clear other sensitive data
    localStorage.removeItem('yapee_cart');
    sessionStorage.clear();
  }
  
  /**
   * Generate secure random string
   */
  generateSecureRandom(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  /**
   * Log security event
   */
  logSecurityEvent(event: string, details: any = {}): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.sessionData?.userId || 'anonymous'
    };
    
    console.warn('Security Event:', logEntry);
    
    // In production, send to security monitoring service
    // await fetch('/api/security/log', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(logEntry)
    // });
  }
  
  /**
   * Check for suspicious activity
   */
  detectSuspiciousActivity(): boolean {
    // Check for rapid requests
    const identifier = this.sessionData?.userId || 'anonymous';
    if (!this.checkRateLimit(identifier, 'suspicious_check')) {
      this.logSecurityEvent('RATE_LIMIT_EXCEEDED', { identifier });
      return true;
    }
    
    // Check for unusual patterns
    const userAgent = navigator.userAgent;
    if (userAgent.includes('bot') || userAgent.includes('crawler')) {
      this.logSecurityEvent('BOT_DETECTED', { userAgent });
      return true;
    }
    
    return false;
  }
}

// Export singleton instance
export const securityService = new SecurityService();

// Export configuration
export { SECURITY_CONFIG };

// Export types
export type { SecurityValidationResult, LoginAttempt, SessionData };