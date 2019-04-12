export let transform=function bd_encrypt(gg_lat,gg_lon){
  /*gcj02坐标转百度坐标*/
  let pi_value=Math.PI;
  let X_PI = pi_value * 3000.0 / 180.0;
  let x = gg_lon, y = gg_lat;
  let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
  let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
  let bd_lon = z * Math.cos(theta) + 0.0065;
  let bd_lat = z * Math.sin(theta) + 0.006;
  return {
    bd_lat: bd_lat,
    bd_lon: bd_lon
  };
};
