import { auth, db } from './firebase';
import {
  RecaptchaVerifier,
  PhoneAuthProvider,
  multiFactor,
  MultiFactorError,
  getMultiFactorResolver,
  PhoneMultiFactorGenerator,
} from 'firebase/auth';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Security Configuration
export const SECURITY_CONFIG = {
  // Password requirements
  passwordMinLength: 8,
  passwordRequireUppercase: true,
  passwordRequireLowercase: true,
  passwordRequireNumbers: true,
  passwordRequireSpecialChars: true,

  // Session management
  sessionTimeoutMinutes: 30,
  maxConcurrentSessions: 3,

  // Rate limiting
  maxLoginAttempts: 5,
  lockoutDurationMinutes: 15,

  // Two-factor authentication
  enable2FA: true,
  require2FAForSensitiveActions: true,

  // Data encryption
  encryptSensitiveData: true,
  encryptionKeyRotationDays: 90,
};

// Password validation
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < SECURITY_CONFIG.passwordMinLength) {
    errors.push(`Password must be at least ${SECURITY_CONFIG.passwordMinLength} characters`);
  }

  if (SECURITY_CONFIG.passwordRequireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (SECURITY_CONFIG.passwordRequireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (SECURITY_CONFIG.passwordRequireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (SECURITY_CONFIG.passwordRequireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Two-Factor Authentication Setup
export async function setupTwoFactorAuth(
  phoneNumber: string,
  recaptchaContainerId: string
): Promise<{ success: boolean; verificationId?: string; error?: string }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'No authenticated user' };
    }

    // Initialize reCAPTCHA
    const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
      size: 'invisible',
    });

    // Get phone auth provider
    const phoneAuthProvider = new PhoneAuthProvider(auth);

    // Send verification code
    const verificationId = await phoneAuthProvider.verifyPhoneNumber(
      phoneNumber,
      recaptchaVerifier
    );

    return { success: true, verificationId };
  } catch (error: any) {
    console.error('2FA setup error:', error);
    return {
      success: false,
      error: error.message || 'Failed to setup 2FA'
    };
  }
}

// Verify 2FA and enroll
export async function verifyAndEnrollTwoFactor(
  verificationId: string,
  verificationCode: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'No authenticated user' };
    }

    const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(credential);

    await multiFactor(user).enroll(multiFactorAssertion, 'Phone Number');

    // Update user document
    await updateDoc(doc(db, 'users', user.uid), {
      twoFactorEnabled: true,
      twoFactorMethod: 'phone',
      securityUpdatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('2FA verification error:', error);
    return {
      success: false,
      error: error.message || 'Failed to verify 2FA'
    };
  }
}

// Disable 2FA
export async function disableTwoFactorAuth(): Promise<{ success: boolean; error?: string }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'No authenticated user' };
    }

    const enrolledFactors = await multiFactor(user).getEnrolledFactors();

    if (enrolledFactors.length === 0) {
      return { success: false, error: 'No 2FA factors enrolled' };
    }

    // Unenroll all factors
    for (const factor of enrolledFactors) {
      await multiFactor(user).unenroll(factor);
    }

    // Update user document
    await updateDoc(doc(db, 'users', user.uid), {
      twoFactorEnabled: false,
      twoFactorMethod: null,
      securityUpdatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('2FA disable error:', error);
    return {
      success: false,
      error: error.message || 'Failed to disable 2FA'
    };
  }
}

// Security logging
export async function logSecurityEvent(
  eventType: 'login' | 'logout' | 'password_change' | '2fa_enabled' | '2fa_disabled' | 'suspicious_activity',
  details: Record<string, any> = {}
): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const securityLog = {
      userId: user.uid,
      eventType,
      timestamp: serverTimestamp(),
      ipAddress: details.ipAddress || 'unknown',
      userAgent: details.userAgent || 'unknown',
      location: details.location || 'unknown',
      success: details.success !== false,
      details,
    };

    // Add to security logs collection
    await addDoc(collection(db, 'security_logs'), securityLog);

    // Update user's last security event
    await updateDoc(doc(db, 'users', user.uid), {
      lastSecurityEvent: securityLog,
    });
  } catch (error) {
    console.error('Security logging error:', error);
  }
}

// Get security logs for user
export async function getUserSecurityLogs(
  userId: string,
  limit: number = 20
): Promise<any[]> {
  try {
    const q = query(
      collection(db, 'security_logs'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limit)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching security logs:', error);
    return [];
  }
}

// Data encryption utilities (client-side)
export class DataEncryption {
  private static async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  private static async exportKey(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('jwk', key);
    return JSON.stringify(exported);
  }

  private static async importKey(jwk: string): Promise<CryptoKey> {
    const keyData = JSON.parse(jwk);
    return await crypto.subtle.importKey(
      'jwk',
      keyData,
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  static async encrypt(data: string, key: CryptoKey): Promise<string> {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(data);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encoded
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  static async decrypt(encryptedData: string, key: CryptoKey): Promise<string> {
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }
}

// Privacy settings management
export async function updatePrivacySettings(
  userId: string,
  settings: {
    profileVisibility: 'public' | 'private' | 'connections';
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    allowMessages: boolean;
    dataSharing: boolean;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateDoc(doc(db, 'users', userId), {
      privacy: settings,
      privacyUpdatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Privacy settings update error:', error);
    return {
      success: false,
      error: error.message || 'Failed to update privacy settings'
    };
  }
}

// Account lockout management
export async function handleFailedLoginAttempt(
  email: string,
  ipAddress: string
): Promise<{ locked: boolean; remainingAttempts?: number; lockoutUntil?: Date }> {
  try {
    const userQuery = query(collection(db, 'users'), where('email', '==', email));
    const snapshot = await getDocs(userQuery);

    if (snapshot.empty) {
      return { locked: false, remainingAttempts: SECURITY_CONFIG.maxLoginAttempts };
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    const currentAttempts = userData.failedLoginAttempts || 0;
    const lockoutUntil = userData.lockoutUntil ? new Date(userData.lockoutUntil.seconds * 1000) : null;

    // Check if currently locked out
    if (lockoutUntil && lockoutUntil > new Date()) {
      return {
        locked: true,
        lockoutUntil
      };
    }

    // Increment failed attempts
    const newAttempts = currentAttempts + 1;

    if (newAttempts >= SECURITY_CONFIG.maxLoginAttempts) {
      // Lock the account
      const lockoutTime = new Date();
      lockoutTime.setMinutes(lockoutTime.getMinutes() + SECURITY_CONFIG.lockoutDurationMinutes);

      await updateDoc(doc(db, 'users', userDoc.id), {
        failedLoginAttempts: newAttempts,
        lockoutUntil: lockoutTime,
        lastFailedLoginIP: ipAddress,
        lastFailedLoginAt: serverTimestamp(),
      });

      await logSecurityEvent('suspicious_activity', {
        email,
        ipAddress,
        reason: 'Account locked due to multiple failed login attempts',
      });

      return {
        locked: true,
        lockoutUntil: lockoutTime
      };
    }

    // Update failed attempts
    await updateDoc(doc(db, 'users', userDoc.id), {
      failedLoginAttempts: newAttempts,
      lastFailedLoginIP: ipAddress,
      lastFailedLoginAt: serverTimestamp(),
    });

    return {
      locked: false,
      remainingAttempts: SECURITY_CONFIG.maxLoginAttempts - newAttempts
    };
  } catch (error) {
    console.error('Failed login attempt handling error:', error);
    return { locked: false, remainingAttempts: SECURITY_CONFIG.maxLoginAttempts };
  }
}

// Reset failed login attempts on successful login
export async function resetFailedLoginAttempts(userId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', userId), {
      failedLoginAttempts: 0,
      lockoutUntil: null,
    });
  } catch (error) {
    console.error('Error resetting failed login attempts:', error);
  }
}

// Session management
export async function createSession(userId: string, deviceInfo: {
  userAgent: string;
  ipAddress: string;
  location?: string;
}): Promise<string> {
  try {
    const sessionData = {
      userId,
      deviceInfo,
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
      expiresAt: new Date(Date.now() + SECURITY_CONFIG.sessionTimeoutMinutes * 60 * 1000),
    };

    const docRef = await addDoc(collection(db, 'sessions'), sessionData);
    return docRef.id;
  } catch (error) {
    console.error('Session creation error:', error);
    throw error;
  }
}

export async function validateSession(sessionId: string): Promise<boolean> {
  try {
    const sessionDoc = await getDoc(doc(db, 'sessions', sessionId));

    if (!sessionDoc.exists()) {
      return false;
    }

    const sessionData = sessionDoc.data();
    const expiresAt = sessionData.expiresAt ? new Date(sessionData.expiresAt.seconds * 1000) : null;

    if (expiresAt && expiresAt < new Date()) {
      // Session expired
      await deleteDoc(doc(db, 'sessions', sessionId));
      return false;
    }

    // Update last active time
    await updateDoc(doc(db, 'sessions', sessionId), {
      lastActive: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
}

export async function terminateSession(sessionId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'sessions', sessionId));
  } catch (error) {
    console.error('Session termination error:', error);
  }
}

export async function terminateAllUserSessions(userId: string, exceptSessionId?: string): Promise<void> {
  try {
    const q = query(collection(db, 'sessions'), where('userId', '==', userId));
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
      if (doc.id !== exceptSessionId) {
        batch.delete(doc.ref);
      }
    });

    await batch.commit();
  } catch (error) {
    console.error('Error terminating user sessions:', error);
  }
}

// Get active sessions for user
export async function getUserActiveSessions(userId: string): Promise<any[]> {
  try {
    const q = query(
      collection(db, 'sessions'),
      where('userId', '==', userId),
      orderBy('lastActive', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    return [];
  }
}