<script setup lang="ts" name="Login">
import type { FormInst, FormRules } from 'naive-ui';
import { loginApi } from "@/api/login"
import { Store } from "@/store";

const { user } = Store();

const router = useRouter()

const formRef = ref<FormInst | null>(null)
//18941925188  qwertyuiop
const loginForm = ref<{ accountId: string; enPwd: string }>({ accountId: "", enPwd: "" })

const rules: FormRules = {
    userName: [{ required: true, message: '请输入账号', trigger: ['input', 'blur'] }],
    password: [{ required: true, message: '请输入密码', trigger: ['input', 'blur'] }],
}

const submitLogin = async () => {
    const { code, data } = await loginApi(loginForm.value);
    if (code === 0) {
        user.setToken(data.token)
        user.setUserName(data.userName)
        router.push({ name: "PC-Home" })
    }
}

</script>

<template>
    <div class="login-box">
        <div class="login-left">

        </div>
        <div class="login-form">
            <h2>管理后台</h2>
            <n-form ref="formRef" :model="loginForm" :rules="rules" label-placement="left">
                <n-form-item path="accountId">
                    <n-input v-model:value="loginForm.accountId" clearable @keydown.enter.prevent placeholder="请输入账号" />
                </n-form-item>
                <n-form-item path="enPwd">
                    <n-input v-model:value="loginForm.enPwd" clearable show-password type="password"
                        show-password-on="mousedown" @keydown.enter.prevent placeholder="请输入密码">
                    </n-input>
                </n-form-item>
                <n-form-item>
                    <n-button color="#50a7d3" attr-type="button" @click="submitLogin">
                        登录
                    </n-button>
                </n-form-item>
            </n-form>
        </div>
    </div>
</template>

<route lang="json">{
    "meta": {
        "layout": false
    }
}</route>

<style scoped lang="scss">
.login-box {
    height: 100vh;
    display: flex;
    justify-content: space-between;

    // background-color: rgb(168, 214, 237);
    .login-left {
        width: 50%;
        background-image: url('@/assets/PC/loginBg.png');
        background-repeat: no-repeat;
        background-size: cover;
    }

    .login-form {
        width: 400px;
        height: 250px;
        margin: auto auto;
        padding: 30px 50px;
        background-color: rgb(168, 214, 237);

        h2 {
            margin: 0px 0px 15px 0px;
            text-align: center;
        }

        .n-form {
            .n-form-item {
                .n-button {
                    width: 100%;
                    margin: 0px auto;
                }
            }
        }
    }

}
</style>