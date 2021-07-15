export default {
    // 节流函数--目前有问题，需要后续在组合式api中测试
    throttle(fn) {
        let canRun = true
        return function () {
            if (!canRun) return
            canRun = false
            setTimeout(() => {
                console.log(this)
                fn.call(this, ...arguments)
                canRun = true
            }, 3000);
        }
    },
    // 转换成秒
    formatSecond(time) {
        // console.log('time is', time)
        // 取整
        time = ~~time
        var secondTime
        if (time < 10) {
            secondTime = '00:0' + time
        } else if (time < 60) {
            secondTime = '00:' + time
        } else {
            var m = ~~parseInt((time % (1000 * 60 * 60)) / (1000 * 60))
            var s = ~~parseInt((time % (1000 * 60)) / 1000)
            secondTime = Number(m * 60 + s)
        }
        return secondTime
    },
}