const tankPos = (lat, lng, dist, compass) => {
  const R = 6378.1; //radius of the earch
  const degToRad = (num) => num * (Math.PI / 180);
  const radToDeg = (num) => num * (180 / Math.PI);
  const mToKm = (num) => num / 1000;

  let lat_tank = Math.asin(
    Math.sin(degToRad(lat)) * Math.cos(mToKm(dist) / R) +
      Math.cos(degToRad(lat)) *
        Math.sin(mToKm(dist) / R) *
        Math.cos(degToRad(compass))
  );

  let lng_tank =
    degToRad(lng) +
    Math.atan2(
      Math.sin(degToRad(compass)) *
        Math.sin(mToKm(dist) / R) *
        Math.cos(degToRad(lat)),
      Math.cos(mToKm(dist) / R) - Math.sin(degToRad(lat)) * Math.sin(lat_tank)
    );

  let f_lat = radToDeg(lat_tank);
  let f_lng = radToDeg(lng_tank);

  return { f_lat, f_lng };
};

export { tankPos };
