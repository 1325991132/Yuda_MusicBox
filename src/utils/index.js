/* eslint-disable */
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
    // 从1生成序号
    formatZero(num, len) {
        if (String(num).length > len) return num
        return (Array(len).join(0) + num).slice(-len)
    },
    // 秒转成00:00
    formatSecondTime(interval) {
        interval = interval | 0
        const m = (interval / 60) | 0
        const s = interval % 60 | 0
        return `${this.formatZero(m,2)}:${this.formatZero(s,2)}`
    },
    // 数组内容随机
    shuffle(arr) {
        var len = arr.length;
        for (var i = 0; i < len - 1; i++) {
            var index = parseInt(Math.random() * (len - i));
            var temp = arr[index];
            arr[index] = arr[len - i - 1];
            arr[len - i - 1] = temp;
        }
        return arr;
    }
}