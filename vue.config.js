const path = require('path');        //引入path模块
function resolve(dir) {
    return path.join(__dirname, dir)  //path.join(__dirname)设置绝对路径
}
const __DEV__ = process.env.NODE_ENV === 'development'
module.exports = {
    outputDir:'dist',
    productionSourceMap:process.env.NODE_ENV!=='production',
    chainWebpack: (config) => {
        config.resolve.alias
            //set第一个参数：设置的别名，第二个参数：设置的路径
            .set('@', resolve('./src'))
            .set('assets', resolve('.src/assets'))
            .set('components', resolve('./src/components'))
            .set('views', resolve('src/views'))
            .set('common', resolve('src/common'))
        if (__DEV__) {
            config.resolve.alias.set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js')
        }
        const oneOfsMap = config.module.rule('scss').oneOfs.store;
        oneOfsMap.forEach(item => {
            item
                .use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    // resources: './src/assets/styles/variable.scss'
                    // 也可以选择全局变量路径数组, 如果你有多个文件需要成为全局,就可以采用这种方法
                    resources: ['./src/common/styles/base.scss']
                    // 或者你可以将多个scss文件@import到一个main.scss用第一种方法，都是可以的
                })
                .end()
        })
    },
    devServer: {
        port: 8088,
        open: true,
        hotOnly: true
    }
}