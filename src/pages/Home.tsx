import React, { useState } from "react";
import {
  IconWifi,
  IconHomeLink,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";

interface SystemInfo {
  id: string;
  timestamp: number;
  wan_interface: string;
  model: string;
  hostname: string;
  version: string;
  serialno: string;
  uptime: { day: number; hour: number; minute: number };
  load_avg: number[];
}

interface Interface {
  name: string;
  mac: string;
  link_status: string;
  duplex: string;
  speed: number;
}

interface GPRS {
  status: string;
  session_uptime: { day: number; hour: number; minute: number; second: number };
  signal_power: number;
  network: string;
  interface: {
    address: string;
    netmask: string;
    name: string;
    link_status: string;
  };
}

interface Lease {
  mac: string;
  address: string;
  expires_in: string;
  hostname: string;
}

interface Pool {
  name: string;
  netmap: null;
  start_address: string;
  end_address: string;
  status: string;
  leases: Lease[];
}

interface DHCPInfo {
  hostname: string;
  pools: Pool[];
}

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = "" }) => (
  <div
    className={`rounded-lg border-2 border-blue-400 bg-white shadow ${className}`}
  >
    <div className="flex items-center justify-between bg-blue-400 p-2">
      <h2 className="font-montserrat text-xl font-normal text-white">
        {title}
      </h2>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

interface InfoItemProps {
  label: string;
  value: string | number | React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <div className="mb-2">
    <span className="font-medium">{label}:</span> {value}
  </div>
);

const StatusIndicator: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`mr-2 inline-block h-3 w-3 rounded-full ${
      status.toLowerCase() === "active" || status.toLowerCase() === "up"
        ? "bg-green-500"
        : "bg-red-500"
    }`}
  ></span>
);

const Home: React.FC = () => {
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [expandedPools, setExpandedPools] = useState<{ [key: string]: boolean }>({});
  const [expandedLeases, setExpandedLeases] = useState<{ [key: string]: boolean }>({});

  const togglePoolExpand = (poolName: string) => {
    setExpandedPools((prev) => ({ ...prev, [poolName]: !prev[poolName] }));
  };

  const toggleLeaseExpand = (leaseId: string) => {
    setExpandedLeases((prev) => ({ ...prev, [leaseId]: !prev[leaseId] }));
  };

  const systemInfo: SystemInfo = {
    id: "00:0d:5a:22:3a:54",
    timestamp: 1717040232,
    wan_interface: "wwan0",
    model: "Tesse LEVANTO520 Multiprotocol Router",
    hostname: "520-ITVM-TEST01",
    version: "5.5.0-3-R-0.24150",
    serialno: "SN-24LEV0008",
    uptime: { day: 0, hour: 12, minute: 2 },
    load_avg: [0.44, 0.3, 0.11],
  };

  const interfaces: Interface[] = [
    {
      name: "eth0",
      mac: "00:0d:5a:22:3a:54",
      link_status: "down",
      duplex: "half",
      speed: 10,
    },
    {
      name: "eth1",
      mac: "00:0d:5a:a2:3a:54",
      link_status: "up",
      duplex: "full",
      speed: 100,
    },
  ];

  const gprs: GPRS = {
    status: "ACTIVE",
    session_uptime: { day: 0, hour: 12, minute: 0, second: 41 },
    signal_power: -71,
    network: "LTE vodafone IT DATA ONLY",
    interface: {
      address: "10.101.167.50",
      netmask: "255.255.255.252",
      name: "wwan0",
      link_status: "up",
    },
  };

  const dhcpInfo: DHCPInfo = {
    hostname: "520-ITVM-TEST01",
    pools: [
      {
        name: "eth1",
        netmap: null,
        start_address: "10.15.125.82",
        end_address: "10.15.125.82",
        status: "ACTIVE",
        leases: [
          {
            mac: "00:0d:5a:f0:04:02",
            address: "10.15.125.82",
            expires_in: "01:07:29",
            hostname: "5860-CLIENT",
          },
          {
            mac: "00:0d:5a:f0:04:03",
            address: "10.15.125.83",
            expires_in: "01:08:30",
            hostname: "5860-CLIENT-2",
          },
        ],
      },
      {
        name: "eth2",
        netmap: null,
        start_address: "10.15.125.82",
        end_address: "10.15.125.82",
        status: "ACTIVE",
        leases: [
          {
            mac: "00:0d:5a:f0:04:04",
            address: "10.15.125.84",
            expires_in: "01:09:31",
            hostname: "5860-CLIENT-3",
          },
          {
            mac: "00:0d:5a:f0:04:05",
            address: "10.15.125.85",
            expires_in: "01:10:32",
            hostname: "5860-CLIENT-4",
          },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl bg-white p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card title="System Information">
          <InfoItem label="ID" value={systemInfo.id} />
          <InfoItem label="Model" value={systemInfo.model} />
          <InfoItem label="Hostname" value={systemInfo.hostname} />
          <InfoItem label="Version" value={systemInfo.version} />
          <InfoItem label="Serial No" value={systemInfo.serialno} />
          <InfoItem
            label="Uptime"
            value={`${systemInfo.uptime.day}d ${systemInfo.uptime.hour}h ${systemInfo.uptime.minute}m`}
          />
          <InfoItem
            label="Load Average"
            value={systemInfo.load_avg.join(", ")}
          />
        </Card>

        <Card title="GPRS Information">
          <InfoItem label="Status" value={gprs.status} />
          <InfoItem
            label="Session Uptime"
            value={`${gprs.session_uptime.day}d ${gprs.session_uptime.hour}h ${gprs.session_uptime.minute}m ${gprs.session_uptime.second}s`}
          />
          <InfoItem label="Signal Power" value={`${gprs.signal_power} dBm`} />
          <InfoItem label="Network" value={gprs.network} />
          <InfoItem label="Interface" value={gprs.interface.name} />
          <InfoItem label="IP Address" value={gprs.interface.address} />
          <InfoItem label="Netmask" value={gprs.interface.netmask} />
          <InfoItem label="Link Status" value={gprs.interface.link_status} />
        </Card>
      </div>

      <Card title="Network Interfaces" className="mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">MAC</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Duplex</th>
                <th className="px-4 py-2 text-left">Speed</th>
              </tr>
            </thead>
            <tbody>
              {interfaces.map((iface, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-2">{iface.name}</td>
                  <td className="px-4 py-2">{iface.mac}</td>
                  <td className="px-4 py-2">{iface.link_status}</td>
                  <td className="px-4 py-2">{iface.duplex}</td>
                  <td className="px-4 py-2">{iface.speed} Mbps</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="DHCP Server Information" className="mt-6">
        <InfoItem label="Hostname" value={dhcpInfo.hostname} />
        <h3 className="mb-2 mt-4 text-lg font-medium">DHCP Pools</h3>
        <div className="flex">
          <div className="w-1/2 pr-4">
            {dhcpInfo.pools.map((pool) => (
              <div key={pool.name} className="mb-2">
                <div
                  className={`flex cursor-pointer items-center justify-between rounded p-2 ${
                    selectedPool === pool.name ? "bg-blue-100" : "bg-gray-100"
                  }`}
                  onClick={() => {
                    setSelectedPool(pool.name);
                    togglePoolExpand(pool.name);
                  }}
                >
                  <div className="flex items-center">
                    <StatusIndicator status={pool.status} />
                    <IconWifi size={20} className="mr-2" />
                    <span className="font-medium">{pool.name}</span>
                  </div>
                  {expandedPools[pool.name] ? (
                    <IconChevronUp size={16} />
                  ) : (
                    <IconChevronDown size={16} />
                  )}
                </div>
                {expandedPools[pool.name] && (
                  <div className="mt-2 pl-7">
                    <InfoItem label="Start Address" value={pool.start_address} />
                    <InfoItem label="End Address" value={pool.end_address} />
                    <InfoItem label="Netmap" value="N.A." />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="w-1/2 border-l pl-4">
            {selectedPool && (
              <>
                <h4 className="mb-2 font-medium">Leases</h4>
                {dhcpInfo.pools
                  .find((p) => p.name === selectedPool)
                  ?.leases.map((lease, leaseIndex) => {
                    const leaseId = `${selectedPool}-${leaseIndex}`;
                    return (
                      <div key={leaseId} className="mb-2">
                        <div
                          className="flex cursor-pointer items-center justify-between rounded bg-gray-50 p-2"
                          onClick={() => toggleLeaseExpand(leaseId)}
                        >
                          <div className="flex items-center">
                            <IconHomeLink size={20} className="mr-2" />
                            <span>{lease.hostname}</span>
                          </div>
                          {expandedLeases[leaseId] ? (
                            <IconChevronUp size={16} />
                          ) : (
                            <IconChevronDown size={16} />
                          )}
                        </div>
                        {expandedLeases[leaseId] && (
                          <div className="mt-1 pl-6">
                            <InfoItem label="IP" value={lease.address} />
                            <InfoItem label="Expires in" value={lease.expires_in} />
                            <InfoItem label="Mac" value={lease.mac} />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Home;