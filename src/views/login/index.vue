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
                <a-form-item required name="name" label="Name" has-feedback>
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
                  label="Password"
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
                    >登录</a-button
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
import { useRouter, useRoute, Router } from "vue-router";
import { login } from "@/api/services/user";
import { message } from "ant-design-vue";
import { useStore } from "vuex";
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
    const store = useStore();
    const formRef: Ref<any> = ref();
    const router: Router = useRouter();

    // 表单配置
    const formState: UnwrapRef<FormState> = reactive({
      name: "",
      password: "",
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
            window.localStorage.setItem("token", res.token);
            window.localStorage.setItem("loginStatu", "true");
            store.commit("SET_LOGINSTATU",true);
            save_loginStatus(true);
            setTimeout(() => {
              router.push({
                name: "home"
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

    return {
      layout,
      formState,
      rules,
      parallax: "depth",
      handlelogin,
      handleFinish,
      handleFinishFailed,
      formRef,
    };
  }
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