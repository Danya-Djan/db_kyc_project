export const checkMobile = () => {
    const devices = new RegExp(
      "Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini",
      "i"
    );

    if(devices.test(navigator.userAgent)) {
        return true
    };

    return false;
};

export const checkIOS = () => {
  const devicesIpone = new RegExp("iPhone|iPad|iPod", "i");

  if (devicesIpone.test(navigator.userAgent)) {
    return true;
  }

  return false;
};