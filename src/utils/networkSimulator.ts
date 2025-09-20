// Network Traffic Simulator for Demo Purposes
export class NetworkSimulator {
  private sourceIPs: string[] = [
    '192.168.1.10',
    '192.168.1.15',
    '192.168.1.20',
    '192.168.1.100', // Suspicious IP
    '10.0.0.25',
    '10.0.0.30',
    '10.0.0.50',     // Suspicious IP
    '172.16.0.10',
    '203.0.113.45',  // External IP
    '198.51.100.33', // External IP
  ];

  private destinationIPs: string[] = [
    '192.168.1.1:80',
    '192.168.1.1:443',
    '192.168.1.1:22',
    '8.8.8.8:53',
    '1.1.1.1:53',
    '74.125.224.72:443',
    '13.107.42.14:443',
    '52.96.202.62:443',
  ];

  private protocols: string[] = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS'];

  generatePacket() {
    const timestamp = new Date();
    const source = this.getRandomElement(this.sourceIPs);
    const destination = this.getRandomElement(this.destinationIPs);
    const protocol = this.getRandomElement(this.protocols);
    
    // Generate packet size based on protocol
    let size: number;
    switch (protocol) {
      case 'ICMP':
        size = 64 + Math.floor(Math.random() * 500);
        break;
      case 'UDP':
        size = 100 + Math.floor(Math.random() * 1400);
        break;
      case 'HTTP':
      case 'HTTPS':
        size = 500 + Math.floor(Math.random() * 4000);
        break;
      default:
        size = 64 + Math.floor(Math.random() * 1500);
    }

    // Occasionally generate large packets (potential DDoS)
    if (Math.random() > 0.95) {
      size = 5000 + Math.floor(Math.random() * 5000);
    }

    return {
      id: `packet_${timestamp.getTime()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp,
      source,
      destination,
      protocol,
      size,
    };
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Simulate different types of network attacks
  generateAttackPacket(attackType: 'ddos' | 'portscan' | 'bruteforce' = 'ddos') {
    const basePacket = this.generatePacket();

    switch (attackType) {
      case 'ddos':
        return {
          ...basePacket,
          source: this.getRandomElement(['192.168.1.100', '10.0.0.50']),
          size: 8000 + Math.floor(Math.random() * 2000),
          protocol: 'UDP',
        };

      case 'portscan':
        return {
          ...basePacket,
          source: '203.0.113.45',
          destination: `192.168.1.1:${22 + Math.floor(Math.random() * 100)}`,
          size: 64,
          protocol: 'TCP',
        };

      case 'bruteforce':
        return {
          ...basePacket,
          source: '198.51.100.33',
          destination: '192.168.1.1:22',
          size: 100 + Math.floor(Math.random() * 200),
          protocol: 'TCP',
        };

      default:
        return basePacket;
    }
  }

  // Generate burst of packets (simulating attack)
  generatePacketBurst(count: number = 10, attackType?: 'ddos' | 'portscan' | 'bruteforce') {
    const packets = [];
    for (let i = 0; i < count; i++) {
      if (attackType && Math.random() > 0.7) {
        packets.push(this.generateAttackPacket(attackType));
      } else {
        packets.push(this.generatePacket());
      }
    }
    return packets;
  }

  // Get network statistics
  getNetworkStats() {
    return {
      monitoredSources: this.sourceIPs.length,
      monitoredDestinations: this.destinationIPs.length,
      supportedProtocols: this.protocols.length,
      simulationActive: true,
    };
  }
}