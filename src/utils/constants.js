export const SpeedLimitOptions = [
  { label: "kbit/s", value: 1 },
  { label: "Mbit/s", value: 1000 },
  { label: "Gbit/s", value: 1000000 },
];
export const QuotaOptions = [
  { label: "kB", value: 1000 },
  { label: "MB", value: 1000000 },
  { label: "GB", value: 1000000000 },
  { label: "TB", value: 1000000000000 },
];

export const DueActionOptions = [
  { label: "无动作", value: 0 },
  { label: "限速10kb/s", value: 1 },
  { label: "限速100kb/s", value: 2 },
  { label: "限速1Mb/s", value: 3 },
  { label: "限速10Mb/s", value: 4 },
  { label: "限速30Mb/s", value: 5 },
  { label: "限速100Mb/s", value: 6 },
  { label: "限速1Gb/s", value: 7 },
  { label: "删除转发规则", value: 8 },
];

export const DateOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: false,
};

export const ReverseProxies = [
  "caddy"
]