<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>当前list有{{ count }}个</h2>
    <h2 ref="helloh2" >当前待办人为{{ username }}{{ englishname }}</h2>
    <div class="list_wrapper">
      <useript @listchange="list_according_ipt" name="dsb" value='123'></useript>
      <div class="List" :class="list.length ? 'things' : ''">
        <ul>
          <li v-for="(item, index) in list" :key="index">{{ item }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  Ref,
  ref,
  computed,
  watch,
  toRefs,
  watchEffect,
  provide,
  readonly,
  onMounted
} from "vue";
import useript from "./input/index.vue";

export default defineComponent({
  name: "HelloWorld",
  setup(props, context) {
    //   -----------------------------------provide传值给子组件------------------------------------------
    // provide("name","msg from father components")//不是响应式
    const msg_to_child:Ref<string> = ref("msg from father components")
    provide("name",readonly(msg_to_child))//响应式给子组件传参
    provide("changeName",(msg:string)=>{
        msg_to_child.value = msg
    })

    const { attrs } = context;
    const msg: any = attrs.msg;
    let list: Array<string> = reactive([]);
    // -----------------------------------------计算属性---------------------------------------
    const count = computed(() => {
      return list.length;
    });
    // // 计算属性的第二种用法，有get和set
    // const count = computed({
    //   get:():number=>{
    //     return list.length;
    //   },
    //   set:(param):void=>{
    //     count.value = param-1;
    //   }
    // });

    // --------------------------------------------watch---------------------------------------------------
    watch(
      count,
      (n, o) => {
        console.log(n, o);
      },
      { immediate: true }//首次立即执行
    );

    // 测试watch对象,监听对象的时候需要使用函数，例如()=>things.username，多个的时候需要放在数组里
    let things = reactive({ username: "曲耀达", englishname: "qyd" });
    const { username, englishname } = toRefs(things);
    watch(
      [() => things.username, () => things.englishname],
      ([nun, nen], [oun, oen]) => {
        console.log(nun, nen, "------", oun, oen);
      }
    );

    setTimeout(() => {
      username.value = "乔越鑫";
      englishname.value = "qyx";
    }, 1000);

    setTimeout(() => {
      username.value = "孟繁松";
      englishname.value = "mfs";
    }, 3000);
    // ----------------------------------watchEffect 立即执行--------------------------------------
    const stop = watchEffect(()=>{
        console.log('effect console----',things.username)
        setTimeout(()=>{
            stop()
        },2000)
    })


    // ------------------------------------使用ref获取dom--------------------------------------
    const helloh2 = ref(null)
    onMounted(()=>{
        console.log('h2')
        console.log(helloh2.value)
    })

    return {
      msg,
      list,
      count,
      things,
      username,
      englishname,
      helloh2
    };
  },
  methods: {
    list_according_ipt: function (ipt:string) {
      this.list.push(ipt);
    },
  },
  components: { useript },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.list_wrapper {
  width: 500px;
  margin: 0 auto;
  position: relative;
  .useript_wrapper {
    display: flex;
    width: 100%;
  }
  .List {
    position: absolute;
    list-style: none;
    width: 100%;
    top: 100%;
    left: 0;
    background: #fff;
    transition-property: top;
    transition-duration: 0.2s;
    transition-timing-function: ease-in-out;
    opacity: 0;
    z-index: 0;
    // box-shadow: 0 10px 30px 0 rgba(65, 67, 70, 0.08);
    border-radius: 4px;
    &.things {
      top: 110%;
      opacity: 1;
    }
    ul {
      li {
        height: 35px;
        line-height: 35px;
        font-weight: 300;
        background: #fff;
        cursor: pointer;
        transition: background 0.1s;
        &:hover {
          background: #f5f5f5;
        }
      }
    }
  }
}
</style>
