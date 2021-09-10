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
        return `${this.formatZero(m, 2)}:${this.formatZero(s, 2)}`
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
    },
    // 获取是几几后
    getAstro(timestamp) {
        let newDate = new Date()
        newDate.setTime(timestamp)
        let birthday = newDate.toLocaleDateString(timestamp)
        let birthdayArr = birthday.split('/')
        let year = birthdayArr[0].substring(birthdayArr[0].length - 2) + '后'
        let month = birthdayArr[1]
        let day = birthdayArr[2]
        return (
            year +
            ' - ' +
            '魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯'.substr(
                month * 2 - (day < '102223444433'.charAt(month - 1) - -19) * 2,
                2
            ) +
            '座'
        )
    },
    // 日期格式化
    dateFormat(str, type) {
        let date = new Date(str)
        let year = date.getFullYear()
        let month = this.formatZero(date.getMonth() + 1, 2)
        let day = this.formatZero(date.getDate(), 2)
        let hour = this.formatZero(date.getHours(), 2)
        let minute = this.formatZero(date.getMinutes(), 2)
        let seconds = this.formatZero(date.getSeconds(), 2)
        if (type == 'YYYY-MM-DD') {
            return `${year}-${month}-${day}`
        } else if (type == 'YYYY-MM-DD HH:MM:SS') {
            return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`
        } else if (type == 'MM/DD  HH:MM:SS') {
            return `${month}/${day} ${hour}:${minute}:${seconds}`
        }
    },
}