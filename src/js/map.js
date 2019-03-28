import {Message} from 'element-ui';
export let createMap = () => {
  var map = new BMap.Map("allmap");
  var point = new BMap.Point(113.484908, 23.107454);
  var myDis = new BMapLib.DistanceTool(map);
  map.centerAndZoom(point, 18);
  map.addControl(new BMap.NavigationControl());
  map.addControl(new BMap.ScaleControl());
  map.addControl(new BMap.OverviewMapControl());
  map.addControl(new BMap.MapTypeControl());
  map.addControl(new BMap.OverviewMapControl({
    isOpen: true,
    anchor: BMAP_ANCHOR_BOTTOM_RIGHT
  }));
  map.enableScrollWheelZoom();
  map.setCurrentCity("广州"); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用
  var navigationControl = new BMap.NavigationControl({
    // 靠左上角位置
    anchor: BMAP_ANCHOR_TOP_LEFT,
    // LARGE类型
    type: BMAP_NAVIGATION_CONTROL_LARGE,
    // 启用显示定位
    enableGeolocation: true
  });
  map.addControl(navigationControl);
  // 添加定位控件
  var geolocationControl = new BMap.GeolocationControl();
  geolocationControl.addEventListener("locationSuccess", function (e) {
    // 定位成功事件
    var address = '';
    address += e.addressComponent.province;
    address += e.addressComponent.city;
    address += e.addressComponent.district;
    address += e.addressComponent.street;
    address += e.addressComponent.streetNumber;
    Message({
      type: 'success',
      message: "当前定位地址为：" + address
    })
    //alert();
  });
  geolocationControl.addEventListener("locationError", function (e) {
    // 定位失败事件
    alert(e.message);
    Message({
      type: 'error',
      message: e.message
    })
  });
  map.addControl(geolocationControl);
  return map;
};
