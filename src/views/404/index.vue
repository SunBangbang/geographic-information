<template>
    <div class="page-404">
        <div>
            <i class="iconfont icon-jianshezhong1"></i>
            <p>页面正在开发中</p>
            <a href="javascript:;" @click="goBack">返回上一页面</a>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            goBack() {
                this.$router.go(-1)
            }
        }
    }
</script>

<style lang="scss" scoped="">
    .page-404 {
        width: 100%;
        height: 100%;
        position: relative;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        > div {
            width: 500px;
            height: 250px;
            position: absolute;
            top: 40%;
            margin-top: -125px;
            left: 50%;
            margin-left: -250px;
            text-align: center;
        }
    }
    .icon-jianshezhong1 {
        color: #409EFF;
        font-size: 170px;
    }
    p {
        text-align: center;
        margin: 20px 0;
        font-size: 28px;
        font-weight: bold;
    }
</style>