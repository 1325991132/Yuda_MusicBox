<template>
  <kinesis-container>
    <div class="login-wrap">
      <kinesis-element :type="parallax">
        <div class="login-box">
          <img v-if="showDefaultImg" src="~@/assets/logo/yd.png" class="logo" alt="" />
          <img v-else style="transform: scale(5);" :src="imgBase64" class="logo" alt="" />
          <div class="login-form">
            <a-form
              hideRequiredMark
              :model="formState"
              :rules="rules"
              ref="formRef"
              labelAlign="left"
              v-bind="layout"
              @finish="handleFinish"
              @finishFailed="handleFinishFailed"
            >
              <div class="login-input">
                <a-form-item
                  required
                  name="name"
                  :label="label.username"
                  has-feedback
                >
                  <a-input
                    id="nameIptDom"
                    :placeholder="
                      pswLogin ? '用户名或者手机号码' : '请输入手机号码'
                    "
                    class="login-text"
                    v-model:value="formState.name"
                    autocomplete="off"
                    :maxlength="26"
                  >
                    <template #prefix>
                      <user-outlined type="user" />
                    </template>
                  </a-input>
                </a-form-item>
              </div>
              <div class="login-input">
                <a-form-item
                  required
                  has-feedback
                  :label="label.password"
                  :name="'password'"
                  v-if="pswLogin"
                >
                  <a-input
                    type="password"
                    class="login-text"
                    v-model:value="formState.password"
                    placeholder="请输入密码"
                    autocomplete="off"
                    :maxlength="20"
                  >
                    <template #prefix>
                      <UnlockOutlined />
                    </template>
                  </a-input>
                </a-form-item>
                <div v-else style="position: reactive">
                  <a-form-item
                    has-feedback
                    :label="label.ctcode"
                    :wrapperCol="{ span: 8 }"
                    :name="'ctcode'"
                  >
                    <a-input
                      type="ctcode"
                      class="login-text"
                      v-model:value="formState.ctcode"
                      placeholder="验证码"
                      oninput="value = value.replace(/[^\d]/g , '') "
                      autocomplete="off"
                      :maxlength="4"
                    >
                      <template #prefix>
                        <MessageOutlined />
                      </template>
                    </a-input>
                  </a-form-item>
                  <a-button
                    @click="getUserCtcode"
                    v-show="!showSendCtcodeLoading"
                    style="
                      position: absolute;
                      right: 0;
                      top: 0;
                      font-size: 0.625rem;
                      padding: 0 10px;
                      width: 95px;
                    "
                    >发送验证码</a-button
                  >
                  <a-button
                    @click="getUserCtcode"
                    v-show="showSendCtcodeLoading"
                    style="
                      position: absolute;
                      right: 0;
                      top: 0;
                      font-size: 0.625rem;
                      padding: 0 10px;
                      width: 95px;
                    "
                    loading
                    >{{ timeForYZM }}</a-button
                  >
                </div>
              </div>
              <div class="login-footer">
                <div class="login-btn-wrap">
                  <a-button
                    type="primary"
                    class="login-btn"
                    @click="handlelogin"
                    :disabled="
                      formState.name === '' ||
                      (formState.password === '' && formState.ctcode === '')
                    "
                    >{{ t("login.logIn") }}</a-button
                  >
                  <a-button class="ctcode-btn" ghost @click="changeLoginType">{{
                    pswLogin ? t("login.ctcodeLogin") : t("login.pswLogin")
                  }}</a-button>
                  <a-button class="ctcode-btn" ghost  @click="changeQrLoginType">{{'二维码登录'}}</a-button>
                </div>
              </div>
            </a-form>
          </div>
          <!-- <div class="fixedMsg" v-if="parallax.length > 0"> -->
          <div class="fixedMsg" >
            <p ref="reveal" class="reveal">@请使用网易云音1乐账号登录</p>
          </div>
        </div>
      </kinesis-element>
    </div>
    
  </kinesis-container>
</template>
<script lang="ts">
import {
  reactive,
  ref,
  Ref,
  toRaw,
  UnwrapRef,
  defineComponent,
  onMounted,
  computed,
  nextTick,
} from "vue";
import {
  RuleObject,
  ValidateErrorEntity,
} from "ant-design-vue/es/form/interface";
import {
  UserOutlined,
  UnlockOutlined,
  MessageOutlined,
} from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import {
  login,
  loginqr,
  loginqr2,
  loginqr3,
  getUserDetail,
  getCtcode,
  checkCtcode,
  captchalogin,
} from "@/api/services/user";
import { message } from "ant-design-vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import utils from "@/utils/index.js";
interface FormState {
  name: string;
  password: string;
  ctcode: string;
}
export default defineComponent({
  components: {
    UserOutlined,
    UnlockOutlined,
    MessageOutlined,
  },
  directives: {
    focus: {
      // 指令的定义
      mounted(el) {
        el.focus();
      },
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const store = useStore();
    const formRef: Ref<any> = ref();
    const router = useRouter();
    const label = {
      username: t("login.username"),
      password: t("login.password"),
      ctcode: t("login.ctcode"),
    };
    let pswLogin: Ref<boolean> = ref(false); //是否密码登录
    let showSendCtcodeLoading: Ref<boolean> = ref(false); //是否显示验证码上的loading
    let unikey = ref(false);
    const showDefaultImg = ref(true);
    const imgBase64 = ref('');
    const imgTimer = ref(null);

    let parallax: Ref<string> = ref("depth");
    const changeLoginType = () => {
      pswLogin.value = !pswLogin.value;
    };

    const changeQrLoginType = async ()=>{
      const query = {}
      const res = await loginqr();
      if (res.code === 200) {
        console.log(res)
        unikey.value = res.data.unikey
        const key = res.data.unikey
        const res2 = await loginqr2(key);
        if(res2.code === 200){
          console.log(res2)
          imgBase64.value = res2.data.qrimg
          showDefaultImg.value = false
          if(imgTimer.value){
            clearInterval(imgTimer.value)
          }
          setInterval(async ()=>{
              const res3 = await loginqr3(key);
              console.log(res3)
            },2000)
        }
      }
    }
    // 表单配置
    const formState: UnwrapRef<FormState> = reactive({
      name: "",
      password: "",
      ctcode: "",
    });

    onMounted(() => {
      if (utils.checkUserDevice() !== "window") parallax.value = "";
      store.commit("SET_USER_DEVICE", utils.checkUserDevice());
      let name: any = document.getElementById("name");
      name.focus();

      document.onkeydown = function (e) { // 回车提交表单
      // 兼容FF和IE和Opera
          var theEvent:any = window.event || e;
          var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
          if (code == 13) {
              handlelogin()
          }
      }
    });

    const checkPhone = () => {
      if (pswLogin.value) return;
      let RE = new RegExp(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/);
      if (!RE.test(formState.name)) {
        message.error("手机号格式有误");
        return false;
      }
      return true;
    };

    let validatePass = async (rule: RuleObject, value: string) => {
      if (value === "") {
        return Promise.reject("密码不能为空");
      } else {
        return Promise.resolve();
      }
    };
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    const rules = {
      name: [
        {
          required: true,
          min: 1,
          max: 20,
          message: "请输入正确的账号",
          trigger: "blur",
        },
      ],
      password: [
        {
          required: true,
          max: 20,
          message: "密码不能为空",
          trigger: "blur",
        },
        { validator: validatePass, trigger: "change" },
      ],
    };
    const getUserDevice = computed(() => store.getters.getUserDevice); //获取用户设备
    onMounted(() => {
      nextTick(() => {
        if (getUserDevice.value !== "window") {
          rules.name[0].message = "";
          rules.password[0].message = "";
        }
      });
    });

    const TIME_COUNT = 60;
    const timeForYZM: Ref<number> = ref(TIME_COUNT);

    // 获取用户验证码
    const getUserCtcode = async () => {
      if (!checkPhone()) return;
      const res = await getCtcode(formState.name);
      if (!res.data) return;
      message.success("验证码已发送，请尽快填写");
      let timer: any = null;
      if (!timer) {
        showSendCtcodeLoading.value = true;
        timeForYZM.value = TIME_COUNT;
        timer = setInterval(() => {
          if (timeForYZM.value > 0 && timeForYZM.value <= TIME_COUNT) {
            timeForYZM.value--;
          } else {
            if (timer) clearInterval(timer);
            timer = null;
            showSendCtcodeLoading.value = false;
            timeForYZM.value = TIME_COUNT;
          }
        }, 1000);
      }
    };

    const handleFinish = (values: FormState) => {
      console.log(values, formState);
    };
    const handleFinishFailed = (errors: ValidateErrorEntity<FormState>) => {
      console.log(errors);
    };

    const save_loginStatus = (msg) => {
      emit("setLoginStatu", msg);
    };

    const handlelogin = () => {
      checkPhone();
      formRef.value
        .validate()
        .then(async () => {
          let res: any = null;
          const query = toRaw(formState);
          if (!pswLogin.value) {
            const ctres = await checkCtcode(query.name, query.ctcode);
            console.log("res.data", ctres.data);
            if (!ctres.data) return message.error("验证码不正确");
          }
          console.log(query.name, query.ctcode, !pswLogin.value);
          res = !pswLogin.value
            ? await captchalogin(query.name, query.ctcode)
            : await login(query.name, query.password);
          if (res.code === 200) {
            my_getUserDetail(res.profile.userId);
            window.localStorage.setItem("token", res.token);
            window.localStorage.setItem("loginStatu", "true");
            store.commit("SET_LOGINSTATU", true);
            save_loginStatus(true);
            setTimeout(() => {
              router.push({
                name: "home",
              });
            }, 1000);
            message.success("登录成功");
          } else {
            console.log(res);
            return message.error("登录失败，请检查用户名和密码");
          }
        })
        .catch(() => {
          console.log("请正确输入信息");
        });
    };

    const my_getUserDetail = async (uid: any) => {
      console.log("uid", uid);
      try {
        let res: any = await getUserDetail(uid);
        if (res.code === 200) {
          let userInfo = res.profile;
          userInfo.level = res.level;
          userInfo.listenSongs = res.listenSongs;
          userInfo.createTime = res.createTime;
          userInfo.createDays = res.createDays;
          window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
          store.commit("SET_USERINFO", userInfo);
        }
      } catch (e) {
        console.log(e);
      }
    };

    // 文字内容及动效
    const reveal: any = ref(null);
    onMounted(() => {
      const delay = 0.8;
      let revealText = reveal.value.textContent;
      console.log(revealText);
      let letters = revealText.split("");
      reveal.value.textContent = "";
      let middle = letters.filter((letter) => letter !== " ").length / 2;
      letters.forEach((letter, index) => {
        let span = document.createElement("span");
        span.textContent = letter;
        span.className = "revealletter";
        span.style.animationDelay = `${
          delay + Math.abs(index - middle) * 0.1
        }s`;
        reveal.value.appendChild(span);
      });
    });

    return {
      layout,
      formState,
      rules,
      parallax,
      handlelogin,
      handleFinish,
      handleFinishFailed,
      imgTimer,
      my_getUserDetail,
      formRef,
      label,
      showDefaultImg,
      imgBase64,
      t,
      changeLoginType, //更改登录模式
      changeQrLoginType,
      pswLogin, //使用密码登录
      getUserCtcode,
      showSendCtcodeLoading, //显示获取验证码的按钮Loading
      timeForYZM, //验证码倒计时
      checkPhone, //使用验证码登录时，blur事件触发后会校验一次手机号码
      reveal, //title文字dom
    };
  },
});
</script>
<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

@import "./textAnimate.scss";

@mixin loginInput() {
  position: relative;
  width: 100%;
  z-index: 1;
  margin-bottom: 10px;
  .login-text {
    font-size: 0.875rem;
    color: #666;
    width: 100%;
  }
}

@mixin loginFooter() {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 10px;
  .login-btn-wrap {
    width: 100%;
    display: flex;
    position: relative;
    z-index: 1;
    overflow: hidden;
    margin: 0 auto;
    .login-btn {
      font-size: 0.9375rem;
      line-height: 1.5;
      flex-grow: 8;
      height: 42px;
      border-radius: 3px;
      background: #5dd5c8;
      border: 0;
      color: #fff;
    }
    .ctcode-btn {
      flex-grow: 1;
      font-size: 0.75rem;
      line-height: 1.5;
      height: 42px;
      border-radius: 3px;
      margin-left: 10px;
      border: 0;
      border: #ccc 1px solid;
      color: #666;
      width: 60px;
    }
  }
}

@mixin loginBox($height, $width, $maxWidth) {
  // overflow: hidden;
  height: $height;
  width: $width;
  max-width: $width;
  position: relative;
  margin: 0 auto;
  background: #fff url(~@/assets/images/logbg.jpg) no-repeat bottom;
  border-radius: 8px;
  box-shadow: 1px 2px 15px rgba(0, 0, 0, 0.3);
  backface-visibility: hidden;
  text-align: center;
  transition-duration: 0.3s;
  z-index: 8;
}

@mixin logo() {
  width: 55px;
  margin: 40px 0 40px;
}

@mixin fixedMsg() {
  position: absolute;
  bottom: 4px;
  right: 10px;
  color: #f0f0f0;
  p {
    font-size:0.75rem;
    cursor: default;
  }
}

.login-wrap {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  align-items: center;
  background: #5dd5c8 url(~@/assets/images/newbg1.png) center bottom no-repeat;
  
  @media only screen and (min-width: 769px) {
    .login-box {
      @include loginBox(460px, 350px, 350px);
      .logo {
        @include logo;
      }
      .login-form {
        width: 300px;
        margin: 4em auto;
        .login-input {
          @include loginInput;
        }
        .login-footer {
          @include loginFooter;
        }
      }
      .fixedMsg {
        @include fixedMsg;
      }
    }
  }

  @media only screen and (max-width: 768px) {
    ::v-deep(.ant-form-item-explain) {
      display: none;
    }
    ::v-deep(.ant-form-item) {
      margin-bottom: 0;
    }
    .login-box {
      @include loginBox(460px, 330px, 350px);
      padding: 0 30px;
      .logo {
        @include logo;
      }
      .login-form {
        width: 100%;
        margin: 4em auto;
        .login-input {
          @include loginInput;
        }
        .login-footer {
          @include loginFooter;
        }
      }
      .fixedMsg {
        @include fixedMsg;
      }
    }
  }
}

</style>