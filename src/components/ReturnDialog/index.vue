<template>
    <el-dialog
            width="30%"
            title="请填写退回原因"
            :visible.sync="innerVisible"
            :append-to-body="true"
            :close-on-click-modal="false"
            :show-close="false"
    >
        <div>
            <el-input type="textarea" v-model="returnReason"></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeReturnDialog(2)">取 消</el-button>
            <el-button type="primary" @click="closeReturnDialog(1)">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'return-dialog',
        props: {
            // 控制显隐
            innerVisible: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                returnReason: ''
            }
        },
        methods: {
            closeReturnDialog(type) {
                alert(type)
                if (type === 1) { // 确认
                    this.$emit('dialogReturnHide', this.returnReason)
                } else if (type === 2) { // 取消
                    this.returnReason = ''
                    this.$emit('dialogReturnHide')
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .el-dialog__header {
        display: inline-block!important;
    }

    /deep/ .el-dialog__body {
        padding: 0 25px!important;
    }

    /deep/ .el-textarea__inner {
        height: 100px!important;
    }
</style>
