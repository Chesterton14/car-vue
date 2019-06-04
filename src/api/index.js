import service from '../utils/request'

/**********************登录验证相关api******************************/
/*登录*/
export const login = ({loginUser, loginPassword,vertifyCode}) => {
  return service.post('/login', {
    username: loginUser,
    password: loginPassword,
    vertifycode:vertifyCode
  })
};
/*验证token*/
export const getUserInfo = () => {
  return service.get('/profile')
};

/**********************用户相关api******************************/
/*获取用户信息*/
export const getUser = (id) => {
  return service.get("/users/finduser?id='" + id + "'")
};
/*更新用户信息*/
export const updateUser = (id, form) => {
  return service.put("/users/update?id='" + id + "'", {
    username: form.username,
    password: form.password,
    comId: form.comId,
    roleId: form.roleId
  })
};
/*获取所有用户*/
export const getAlluser = () => {
  return service.get('/users');
};
/*删除用户*/
export const deleteUser = (id) => {
  return service.delete('/users/delete?id=' + id)
};
/*新增用户*/
export const newUserapi = (form) => {
  return service.post('/users/new', {
    username: form.username,
    password: form.password,
    comId: form.comId,
    roleId: form.roleId
  })
};

/**********************公司相关api******************************/
/*查找公司*/
export const getCom = (comId) => {
  return service.get("/company/search?comId='" + comId + "'",)
};
/*获取所有公司*/
export const getAllcom = () => {
  return service.get('/company/');
};
/*更新公司信息*/
export const updateCom = (comId, form) => {
  return service.put("/company/update?comId='" + comId + "'", {
    comName: form.comName,
    comPhone: form.comPhone,
    comAddress: form.comAddress
  })
};
/*删除公司*/
export const deleteCom = (comId) => {
  return service.delete("/company/delete?comId='" + comId + "'")
};
/*新增公司*/
export const newCom = (form) => {
  return service.post('/company/new', {
    comName: form.comName,
    comPhone: form.comPhone,
    comAddress: form.comAddress
  })
};

/**********************角色相关api******************************/
/*获取所有角色*/
export const getAllroles = () => {
  return service.get('/role')
};
/*根据roleId查找角色*/
export const getRole = (roleId) => {
  return service.get("/role/search?roleId=" + roleId)
};

/**********************car相关api******************************/
/*获取所有车辆*/
export const getAllcars = () => {
  return service.get('/cars')
};
/*获取指定车辆的轨迹数据*/
export const getCar = (carId) => {
  return service.get('/cars/points?carId=' + carId)
};
/*获取指定用户的车辆*/
export const getUserCar = userId => {
  return service.get('/cars/userCars?userId=' + userId)
};
/*新增车辆*/
export const newCar = form => {
  return service.post('/cars/newCar', {
    label: form.label,
    userId: form.userId,
    username: form.username
  })
};
/*更新车辆*/
export const updateCar = (carId, form) => {
  return service.put('/cars/update?carId=' + carId, {
    label: form.label
  })
};
/*更新车辆位置数据*/
export const updateCarPosition = (pointId, address) => {
  return service.put('/cars/update/position?pointId=' + pointId, {
    position: address
  })
};
/*删除车辆*/
export const deleteCar = carId => {
  return service.delete('/cars/delete?carId=' + carId)
};
/*获取用户车辆的数据*/
export const getUserCarPoints = (userId, currentPage, pageSize) => {
  return service.get('/cars/points/userCar?userId=' + userId + '&currentPage=' + currentPage + '&pageSize=' + pageSize)
};
/*查找行驶轨迹*/
export const searchCar = (carId,startTime,endTime)=>{
  return service.post('/cars/search',{
    carId:carId,
    startTime:startTime,
    endTime:endTime
  })
}
/*获取验证码*/
export const getCode =()=>{
  return service.get('/getCode?'+Math.random())
}
