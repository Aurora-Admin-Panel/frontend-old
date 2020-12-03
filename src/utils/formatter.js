export const formatSpeed = (speed, setSpeed, setScalar) => {
  speed = parseInt(speed, 10);
  if (speed % 1000000 === 0) {
    setSpeed(speed / 1000000);
    setScalar(1000000);
  } else if (speed % 1000 === 0) {
    setSpeed(speed / 1000);
    setScalar(1000);
  } else {
    setSpeed(speed);
    setScalar(1);
  }
};
export const formatQuota = (quota, setQuota, setScalar) => {
  if (!quota) {
    setQuota("");
    setScalar(1000000000);
    return;
  }
  quota = parseInt(quota, 10);
  if (quota % 1000000000000 === 0) {
    setQuota(quota / 1000000000000);
    setScalar(1000000000000);
  } else if (quota % 1000000000 === 0) {
    setQuota(quota / 1000000000);
    setScalar(1000000000);
  } else if (quota % 1000000 === 0) {
    setQuota(quota / 1000000);
    setScalar(1000000);
  } else {
    setQuota(quota / 1000);
    setScalar(1000);
  }
};

export const getReadableSize = (num) => {
  const suffix = 'B'
  for (const unit of ["", "K", "M", "G", "T", "P", "E", "Z"]) {
    if (Math.abs(num) < 1000.0) {
      return Math.round(num*100)/100 + unit + suffix;
    }
    num /= 1000.0;
  }
  return Math.round(num*100)/100 + "Y" + suffix;
};
