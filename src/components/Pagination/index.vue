<!--
 * @Description: 
 * @version: 
 * @Author: Chen JianXin
 * @Date: 2020-12-01 15:51:16
 * @LastEditors: Chen JianXin
 * @LastEditTime: 2020-12-29 20:18:36
-->
<template>
    <div class="pagination">
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="pageSizes"
                :page-size="pageSize"
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <el-button size="small" class="confirm-btn">确定</el-button>
    </div>
</template>

<script>
    export default {
        name: 'pagination',
        props: {
            currentPage: {
                type: Number,
                default: 1
            },
            pageSizes: {
                type: Array,
                default: () => {
                    return [10, 12, 14, 16]
                }
            },
            pageSize: {
                type: Number,
                default: 10
            },
            total: {
                type: Number
            }
        },
        data() {
            return {
                page: {
                    pagenum: this.currentPage,
                    pagesize: this.pageSize
                }
            }
        },
        methods: {
            // 当每页条数改变时，重新赋值pagenum，再请求一次数据
            handleSizeChange(val) {
                this.page.pagesize = val;
                this.$emit('pageChange', this.page)
                console.log(`每页 ${val} 条`);
            },
            // 选择下一页或者跳到第几页，重新赋值pagenum，再请求一次数据
            handleCurrentChange(val) {
                this.page.pagenum = val;
                this.$emit('pageChange', this.page)
                console.log(`当前页: ${val}`);
            },
        }
    }
</script>

<style lang="scss" scoped>
     // 当前页码框背景色
     /deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #2a8df0;
	      color: #FFF;
     }
     /deep/.el-pagination.is-background .el-pager li{
       font-weight: 500;
     }
     
    .pagination{
        display: flex;
        .confirm-btn{
            color:white;
            margin-left: 10px;
            background-color:#409EFF;
        }
    }
</style>
