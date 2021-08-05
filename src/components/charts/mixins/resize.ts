import { ref } from 'vue'

export default function () {
    const chart = ref<any>();
    const initResizeEvent = ()=>{
        window.addEventListener('resize',chartResizeHandle)
    }
    const destroyResizeEvent = ()=>{
        window.removeEventListener('resize',chartResizeHandle)
    }

    const chartResizeHandle = ()=>{
        chart.value.resize()
    }
    const mounted = ()=>{
        initResizeEvent()
    }
    const beforeDestroy = ()=> {
        destroyResizeEvent()
    }
    const destroyed = () =>{
        destroyResizeEvent()
    }
    const activated = ()=>{
        console.log('activated')
        initResizeEvent()
    }
    const deactivated = ()=> {
        console.log('deactivated')
        destroyResizeEvent()
    }
    return {
        chart,
        mounted,
        beforeDestroy,
        destroyed,
        activated,
        deactivated
    }
}