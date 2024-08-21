<script setup lang="ts" name="Login">

const formRef = ref<FormInst | null>(null)

const loginForm = ref<{ userName: string | null; password: string | null }>({ userName: null, password: null })

const showPassword = ref(false)

const rules: FormRules = {
    userName: [{ required: true, message: '请输入账号', trigger: ['input', 'blur'] }],
    password: [{ required: true, message: '请输入密码', trigger: ['input', 'blur'] }],
}

</script>

<template>
    <div class="login-box">
        <div class="login-left">

        </div>
        <div class="login-form">
            <h2>汉堡王管理</h2>
            <n-form ref="formRef" :model="loginForm" :rules="rules" label-placement="left">
                <n-form-item path="userName" >
                    <n-input v-model:value="loginForm.userName" clearable @keydown.enter.prevent placeholder="请输入账号" />
                </n-form-item>
                <n-form-item path="password">
                    <n-input v-model:value="loginForm.password" clearable show-password type="password"
                        show-password-on="mousedown" @keydown.enter.prevent placeholder="请输入密码">
                    </n-input>
                </n-form-item>
                <n-form-item>
                    <n-button color="#50a7d3" attr-type="button">
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
    .login-left{
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
        h2{
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