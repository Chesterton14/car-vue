export let createMap = function () {
  var map = new BMap.Map("allmap");
  var point = new BMap.Point(113.484908, 23.107454);
  var myDis = new BMapLib.DistanceTool(map);
  map.centerAndZoom(point, 18);
  map.addControl(new BMap.NavigationControl());
  map.addControl(new BMap.ScaleControl());
  map.addControl(new BMap.OverviewMapControl());
  map.addControl(new BMap.MapTypeControl());
  map.enableScrollWheelZoom();
  map.setCurrentCity("广州"); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用
};
export let delPoint = function () {
  map.clearOverlays();
};
