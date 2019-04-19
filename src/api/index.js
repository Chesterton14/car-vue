import Axios from 'axios';
import router from '../router'
import {Message} from "element-ui";

if (window.localStorage.getItem('token')) {
  Axios.defaults.headers.common['Authorization'] = `Bearer ` + window.localStorage.getItem('token')
}

export let instance = Axios.create({
  baseURL: 'http://localhost:4000'
});
//request拦截器
instance.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error.response)
  }
)
// response拦截器
instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          Message({
            message: "登录以过期",
            type: 'error',
            center: true,
            duration: 1500
          });
          router.replace({
            path: '/',
            query: {redirect: router.currentRoute.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
          })
      }
    }
    return Promise.reject(error.response)
  }
);

/**********************登录验证相关api******************************/
/*登录*/
export const login = ({loginUser, loginPassword}) => {
  return instance.post('/login', {
    username: loginUser,
    password: loginPassword
  })
};
/*验证token*/
export const getUserInfo = () => {
  return instance.get('/profile')
};

/**********************用户相关api******************************/
/*获取用户信息*/
export const getUser = (id) => {
  return instance.get("/users/finduser?id='" + id + "'")
};
/*更新用户信息*/
export const updateUser = (id, form) => {
  return instance.put("/users/update?id='" + id + "'", {
    username: form.username,
    password: form.password,
    comId: form.comId,
    roleId: form.roleId
  })
};
/*获取所有用户*/
export const getAlluser = () => {
  return instance.get('/users');
};
/*删除用户*/
export const deleteUser = (id) => {
  return instance.delete('/users/delete?id=' + id)
};
/*新增用户*/
export const newUserapi = (form) => {
  return instance.post('/users/new', {
    username: form.username,
    password: form.password,
    comId: form.comId,
    roleId: form.roleId
  })
};


/**********************公司相关api******************************/
/*查找公司*/
export const getCom = (comId) => {
  return instance.get("/company/search?comId='" + comId + "'",)
};
/*获取所有公司*/
export const getAllcom = () => {
  return instance.get('/company/');
};
/*更新公司信息*/
export const updateCom = (comId, form) => {
  return instance.put("/company/update?comId='" + comId + "'", {
    comName: form.comName,
    comPhone: form.comPhone,
    comAddress: form.comAddress
  })
};
/*删除公司*/
export const deleteCom = (comId) => {
  return instance.delete("/company/delete?comId='" + comId + "'")
};
/*新增公司*/
export const newCom = (form) => {
  return instance.post('/company/new', {
    comName: form.comName,
    comPhone: form.comPhone,
    comAddress: form.comAddress
  })
};

/**********************角色相关api******************************/
/*获取所有角色*/
export const getAllroles = () => {
  return instance.get('/role')
};
/*根据roleId查找角色*/
export const getRole = (roleId) => {
  return instance.get("/role/search?roleId=" + roleId)
};

/**********************car相关api******************************/
/*获取所有车辆*/
export const getAllcars = () => {
  return instance.get('/cars')
};
/*获取指定车辆的轨迹数据*/
export const getCar = (carId) => {
  return instance.get('/cars/points?carId=' + carId)
};
/*获取指定用户的车辆*/
export const getUserCar = userId => {
  return instance.get('/cars/userCars?userId=' + userId)
};
/*新增车辆*/
export const newCar = form => {
  return instance.post('/cars/newCar', {
    label: form.label,
    userId: form.userId,
    username: form.username
  })
};
/*更新车辆*/
export const updateCar = (carId, form) => {
  return instance.put('/cars/update?carId=' + carId, {
    label: form.label
  })
};
/*更新车辆位置数据*/
export const updateCarPosition = (pointId, address) => {
  return instance.put('/cars/update/position?pointId=' + pointId, {
    position: address
  })
};
/*删除车辆*/
export const deleteCar = carId => {
  return instance.delete('/cars/delete?carId=' + carId)
};
/*获取用户车辆的数据*/
export const getUserCarPoints = (userId, currentPage, pageSize) => {
  return instance.get('/cars/points/userCar?userId=' + userId + '&currentPage=' + currentPage + '&pageSize=' + pageSize)
};
/*查找行驶轨迹*/
export const searchCar = (carId,startTime,endTime)=>{
  return instance.post('/cars/search',{
    carId:carId,
    startTime:startTime,
    endTime:endTime
  })
}







