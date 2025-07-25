const snmp = require('net-snmp');
const Device = require('../../models/Device');

class SNMPService {
  constructor(socketService) {
    this.socketService = socketService;
    this.sessions = new Map();
    this.monitoringInterval = null;
  }

  async startMonitoring() {
    console.log('Starting SNMP monitoring...');
    
    // Monitor every 30 seconds
    this.monitoringInterval = setInterval(async () => {
      await this.pollAllDevices();
    }, 30000);

    // Initial poll
    await this.pollAllDevices();
  }

  async pollAllDevices() {
    try {
      const devices = await Device.find({ isMonitored: true });
      
      for (const device of devices) {
        await this.pollDevice(device);
      }
    } catch (error) {
      console.error('Error polling devices:', error);
    }
  }

  async pollDevice(device) {
    try {
      const session = this.getSession(device);
      
      // SNMP OIDs for common metrics
      const oids = [
        '1.3.6.1.2.1.1.3.0',      // sysUpTime
        '1.3.6.1.2.1.25.3.3.1.2', // hrProcessorLoad
        '1.3.6.1.2.1.25.2.3.1.6', // hrStorageUsed
        '1.3.6.1.2.1.2.2.1.10',   // ifInOctets
        '1.3.6.1.2.1.2.2.1.16'    // ifOutOctets
      ];

      session.get(oids, (error, varbinds) => {
        if (error) {
          this.handleDeviceError(device, error);
          return;
        }

        this.processMetrics(device, varbinds);
      });

    } catch (error) {
      console.error(`Error polling device ${device.name}:`, error);
      await this.updateDeviceStatus(device._id, 'offline');
    }
  }

  getSession(device) {
    const key = device._id.toString();
    
    if (!this.sessions.has(key)) {
      const session = snmp.createSession(device.ipAddress, device.snmpCommunity, {
        port: 161,
        retries: 1,
        timeout: 5000,
        version: snmp.Version[device.snmpVersion === '1' ? 'v1' : 'v2c']
      });
      
      this.sessions.set(key, session);
    }
    
    return this.sessions.get(key);
  }

  async processMetrics(device, varbinds) {
    try {
      const metrics = {
        uptime: varbinds[0] ? parseInt(varbinds[0].value) : 0,
        cpuUsage: varbinds[1] ? parseInt(varbinds[1].value) : 0,
        memoryUsage: varbinds[2] ? parseInt(varbinds[2].value) : 0,
        networkTraffic: {
          inbound: varbinds[3] ? parseInt(varbinds[3].value) : 0,
          outbound: varbinds[4] ? parseInt(varbinds[4].value) : 0
        }
      };

      // Determine device status based on thresholds
      let status = 'online';
      if (metrics.cpuUsage > device.thresholds.cpu.critical || 
          metrics.memoryUsage > device.thresholds.memory.critical) {
        status = 'critical';
      } else if (metrics.cpuUsage > device.thresholds.cpu.warning || 
                 metrics.memoryUsage > device.thresholds.memory.warning) {
        status = 'warning';
      }

      // Update device in database
      await Device.findByIdAndUpdate(device._id, {
        status,
        lastSeen: new Date(),
        metrics
      });

      // Emit real-time update
      this.socketService.emitDeviceUpdate(device._id, {
        status,
        metrics,
        lastSeen: new Date()
      });

      // Create alerts if thresholds breached
      if (status === 'critical' || status === 'warning') {
        await this.createAlert(device, metrics, status);
      }

    } catch (error) {
      console.error('Error processing metrics:', error);
    }
  }

  async handleDeviceError(device, error) {
    console.error(`Device ${device.name} error:`, error.message);
    
    await Device.findByIdAndUpdate(device._id, {
      status: 'offline',
      lastSeen: new Date()
    });

    this.socketService.emitDeviceUpdate(device._id, {
      status: 'offline',
      lastSeen: new Date()
    });
  }

  async createAlert(device, metrics, status) {
    // Auto-create ticket for critical issues
    if (status === 'critical') {
      const Ticket = require('../../models/Ticket');
      
      const ticket = new Ticket({
        title: `Critical Alert: ${device.name}`,
        description: `Device ${device.name} has critical metrics:\nCPU: ${metrics.cpuUsage}%\nMemory: ${metrics.memoryUsage}%`,
        type: 'incident',
        priority: 'critical',
        category: 'Infrastructure',
        requester: await this.getSystemUser()
      });

      await ticket.save();
      this.socketService.emitTicketUpdate(ticket);
    }
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    // Close all SNMP sessions
    for (const session of this.sessions.values()) {
      session.close();
    }
    
    this.sessions.clear();
  }
}

module.exports = SNMPService;