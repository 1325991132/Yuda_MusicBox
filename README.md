# YD Music Box (vue3)

#### 第三方网易云播放器

### 初衷：vue3练手小项目
### （vue3,vue-router4,vuex4,sass,antd-vue）

### 演示网站，使用网易云音乐账号登录，开启属于你自己的音乐盒
```
http://www.qyd123.cn

接口来自 https://neteasecloudmusicapi.vercel.app/#/
```

### 后台api来自网易云音乐，node后台工程文件中的wyapi文件夹中,进入该目录下，可运行后台接口
```
yarn install
yarn start
```

## Project setup
```
yarn install
yarn serve
```

<!-- node modules -->
由于 lyric-parser 过滤的歌词顺序有时会发生问题，所以作如下处理，将 node modules 下 lyric-parser 中 dist 文件夹内 lyric.js 中的第482行稍做处理:
time: result[1] * 60 * 1000 + result[2] * 1000 + (parseInt(result[3]) || 0)
