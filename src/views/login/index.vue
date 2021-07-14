<template>
  <kinesis-container>
    <div class="login-wrap">
      <kinesis-element :type="parallax">
        <div class="login-box">
          <img src="~@/assets/logo/yd.png" class="logo" alt="" />
          <div class="login-form">
            <a-form
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
                    placeholder="input username"
                    class="login-text"
                    v-model:value="formState.name"
                    autocomplete="off"
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
                  name="password"
                >
                  <a-input
                    type="password"
                    class="login-text"
                    v-model:value="formState.password"
                    placeholder="input password"
                    autocomplete="off"
                  >
                    <template #prefix>
                      <UnlockOutlined />
                    </template>
                  </a-input>
                </a-form-item>
              </div>
              <div class="login-footer">
                <div class="login-btn-wrap">
                  <a-button
                    type="primary"
                    class="login-btn"
                    @click="handlelogin"
                    :disabled="
                      formState.name === '' || formState.password === ''
                    "
                    >{{ t("login.logIn") }}</a-button
                  >
                </div>
              </div>
            </a-form>
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
} from "vue";
import {
  RuleObject,
  ValidateErrorEntity,
} from "ant-design-vue/es/form/interface";
import { UserOutlined, UnlockOutlined } from "@ant-design/icons-vue";
import { useRouter, useRoute } from "vue-router";
import { login, getUserDetail } from "@/api/services/user";
import { message } from "ant-design-vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
interface FormState {
  name: string;
  password: string;
}
export default defineComponent({
  components: {
    UserOutlined,
    UnlockOutlined,
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const store = useStore();
    const formRef: Ref<any> = ref();
    const router = useRouter();
    const label = {
      username: t("login.username"),
      password: t("login.password"),
    };
    // 表单配置
    const formState: UnwrapRef<FormState> = reactive({
      name: "18501092671",
      password: "wasd2671jkluio",
    });
    let validatePass = async (rule: RuleObject, value: string) => {
      if (value === "") {
        return Promise.reject("Please input the password");
      } else {
        return Promise.resolve();
      }
    };
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    const rules = {
      name: [
        {
          required: true,
          min: 3,
          max: 11,
          message: "Length should be 3 to 11",
          trigger: "blur",
        },
      ],
      password: [
        {
          required: true,
          message: "Length should be 6 to 18",
          trigger: "blur",
        },
        { validator: validatePass, trigger: "change" },
      ],
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
      formRef.value
        .validate()
        .then(async () => {
          const query = toRaw(formState);
          let res = await login(query.name, query.password);
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
          window.localStorage.setItem('userInfo',JSON.stringify(userInfo))
          store.commit("SET_USERINFO", userInfo);
        }
      } catch (e) {
        console.log(e);
      }
    };

    return {
      layout,
      formState,
      rules,
      parallax: "depth",
      handlelogin,
      handleFinish,
      handleFinishFailed,
      my_getUserDetail,
      formRef,
      label,
      t,
    };
  },
});
</script>
<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-wrap {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  background: #5dd5c8 url(~@/assets/images/newbg1.png) center bottom no-repeat;
  .login-box {
    overflow: hidden;
    height: 460px;
    width: 350px;
    max-width: 350px;
    position: relative;
    margin: 0 auto;
    background: #fff url(~@/assets/images/logbg.jpg) no-repeat bottom;
    border-radius: 8px;
    box-shadow: 1px 2px 15px rgba(0, 0, 0, 0.3);
    backface-visibility: hidden;
    text-align: center;
    transition-duration: 0.3s;
    z-index: 8;
    .logo {
      width: 55px;
      margin: 40px 0 40px;
    }
    .login-form {
      width: 300px;
      margin: 4em auto;
      .login-input {
        position: relative;
        width: 100%;
        z-index: 1;
        margin-bottom: 10px;
        .login-text {
          font-size: 14px;
          color: #666;
          width: 100%;
        }
      }
      .login-footer {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding-top: 10px;
        .login-btn-wrap {
          width: 100%;
          display: block;
          position: relative;
          z-index: 1;
          overflow: hidden;
          margin: 0 auto;
          .login-btn {
            font-size: 15px;
            line-height: 1.5;
            width: 100%;
            height: 42px;
            border-radius: 3px;
            background: #5dd5c8;
            border: 0;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>