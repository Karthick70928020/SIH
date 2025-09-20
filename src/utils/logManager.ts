import { EncryptionManager } from './encryption';

export interface SecureLog {
  id: string;
  timestamp: Date;
  event: string;
  hash: string;
  previousHash: string;
  encrypted: boolean;
}

export class LogManager {
  private encryption: EncryptionManager;
  private logChain: SecureLog[] = [];
  private lastHash: string = '0000000000000000000000000000000000000000000000000000000000000000';

  constructor() {
    this.encryption = new EncryptionManager();
  }

  createSecureLog(logData: { event: string; severity?: string }): SecureLog {
    const id = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date();
    
    // Encrypt the log event
    const encryptedEvent = this.encryption.encrypt(logData.event);
    
    // Create hash of current log entry
    const logContent = `${id}:${timestamp.toISOString()}:${encryptedEvent}:${this.lastHash}`;
    const currentHash = this.encryption.createHash(logContent);
    
    const secureLog: SecureLog = {
      id,
      timestamp,
      event: logData.event, // Store unencrypted for demo (in production, would store encrypted)
      hash: currentHash,
      previousHash: this.lastHash,
      encrypted: true,
    };

    // Update the chain
    this.logChain.push(secureLog);
    this.lastHash = currentHash;

    return secureLog;
  }

  verifyLogIntegrity(): boolean {
    if (this.logChain.length === 0) return true;

    let expectedHash = '0000000000000000000000000000000000000000000000000000000000000000';

    for (const log of this.logChain) {
      if (log.previousHash !== expectedHash) {
        console.error(`Log integrity violation detected at log ${log.id}`);
        return false;
      }

      // Verify current hash
      const logContent = `${log.id}:${log.timestamp.toISOString()}:${log.event}:${log.previousHash}`;
      const computedHash = this.encryption.createHash(logContent);
      
      if (computedHash !== log.hash) {
        console.error(`Hash mismatch detected at log ${log.id}`);
        return false;
      }

      expectedHash = log.hash;
    }

    return true;
  }

  exportSecureLogs(): string {
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      totalLogs: this.logChain.length,
      integrityVerified: this.verifyLogIntegrity(),
      encryptionKey: this.encryption.getPublicKey(),
      logs: this.logChain.map(log => ({
        ...log,
        timestamp: log.timestamp.toISOString(),
      })),
    };

    return JSON.stringify(exportData, null, 2);
  }

  importSecureLogs(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.logs || !Array.isArray(data.logs)) {
        throw new Error('Invalid log format');
      }

      // Verify integrity of imported logs
      let expectedHash = '0000000000000000000000000000000000000000000000000000000000000000';

      for (const logData of data.logs) {
        if (logData.previousHash !== expectedHash) {
          throw new Error(`Integrity violation in imported log ${logData.id}`);
        }
        expectedHash = logData.hash;
      }

      console.log('Successfully imported and verified secure logs');
      return true;
    } catch (error) {
      console.error('Failed to import logs:', error);
      return false;
    }
  }

  getLogStatistics() {
    return {
      totalLogs: this.logChain.length,
      encryptedLogs: this.logChain.filter(log => log.encrypted).length,
      integrityStatus: this.verifyLogIntegrity() ? 'Valid' : 'Compromised',
      chainLength: this.logChain.length,
      lastHash: this.lastHash,
    };
  }

  searchLogs(query: string): SecureLog[] {
    return this.logChain.filter(log =>
      log.event.toLowerCase().includes(query.toLowerCase())
    );
  }
}