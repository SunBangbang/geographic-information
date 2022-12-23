<template>
  <el-container class="mian">
    <el-aside width="300px">
      <div class="top">
        <div class="asidertop">
          <div class="asidertext s-t">废危转移联单查询</div>
        </div>
        <div class="input">
          <i class="el-icon-s-order"></i>
          <div>基本信息检索</div>
        </div>
        <div class="input1">
          <div class="text">转移联单号:</div>
          <el-input type="text" placeholder="LH4223"></el-input>
        </div>
        <div class="input1">
          <div class="text1">废危名称:</div>
          <el-input type="text" placeholder="请输入名称"></el-input>
        </div>
        <div class="input1">
          <div class="text1">废危代码:</div>
          <el-input type="text" placeholder="LK156263521"></el-input>
        </div>
        <div class="input1">
          <div class="text1">废危来源:</div>
          <el-input type="text" placeholder="请输入来源"></el-input>
        </div>

        <div class="input">
          <i class="el-icon-s-order"></i>
          <div>时间检索</div>
        </div>

        <div class="input2">
          <el-date-picker type="year" placeholder="选择年"></el-date-picker>
          <el-date-picker type="month" placeholder="选择月"></el-date-picker>
        </div>
        <div class="input2">
          <el-time-select
            placeholder="起始时间"
            :picker-options="{
      start: '08:30',
      step: '00:15',
      end: '18:30'
    }"
          ></el-time-select>
          <el-time-select
            placeholder="结束时间"
            :picker-options="{
      start: '08:30',
      step: '00:15',
      end: '18:30',
    }"
          ></el-time-select>
        </div>
      </div>
      <div class="footer">
        <div class="button button1">
          <el-button type="primary">确定</el-button>
        </div>
        <div class="button">
          <el-button type="warning">重置</el-button>
        </div>
      </div>
    </el-aside>
    <el-main>
      <div class="top1">
        <div class="topbar">
          <div class="text s-t">废危转移联单记录列表</div>
          <el-button type="primary" icon="el-icon-upload ">导出</el-button>
        </div>
        <div class="table">
          <el-table :data="tableData" height="500">
            <el-table-column prop="number" label="转移联单号" width="140"></el-table-column>
            <el-table-column prop="moveNumber" label="转移批次编号" width="120"></el-table-column>
            <el-table-column prop="date" label="日期"></el-table-column>
            <el-table-column prop="source" label="废物来源"></el-table-column>
            <el-table-column prop="title" label="废物名称"></el-table-column>
            <el-table-column prop="code" label="废物代码"></el-table-column>
            <el-table-column prop="inputAmount" label="移入量"></el-table-column>
            <el-table-column prop="outAmount" label="移出量"></el-table-column>
            <el-table-column prop="shape" label="形态"></el-table-column>
            <el-table-column prop="pack" label="包装"></el-table-column>
          </el-table>
        </div>

        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="24"
          ></el-pagination>
          <el-button type="primary">确定</el-button>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data () {
    const item = {
      number: '20221541564684',
      moveNumber: '16516541641',
      date: '2020-03-05',
      source: '尼康电子',
      title: '废酒精',
      code: '900-403-06',
      inputAmount: '29.63',
      outAmount: '',
      shape: '液态',
      pack: '桶托盘',
    };
    return {
      tableData: Array(5).fill(item),
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);
    }
  },

};


</script>

<style scoped lang='scss'>
.top1 {
  width: 100%;
  height: 100%;
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: space-between;
  position: relative;
  .topbar {
    width: 100%;
    height: 52px;
    // position: absolute;
    // left: 0;
    // top: 0;
    display: flex;
    justify-content: space-between !important;
    .text {
      color: #2a8df0;
      border-left: 3px solid #2a8df0;
      padding-left: 5px;
    }

    .el-button {
      padding: 0;
      width: 80px;
      height: 30px;
    }
  }
  .table {
    position: absolute;
    top: 52px;
    left: 0;
    right: 0;
    bottom: 50px;
  }
  .el-table {
    // flex: 1;
    height: 100%;
    // position: absolute;
    // top: 50px;
    // left: 0;
    // overflow: auto;
  }
  .block {
    height: 52px;
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    .el-button {
      background: #2a8df0;
      text-align: center;
      height: 26px;
      padding: 0;
      padding-left: 10px;
      padding-right: 10px;
    }
  }
}

.el-main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  //   .block {
  //     margin-top: 20px;
  //     align-self: flex-end;
  //   }
}
.el-aside {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.input2 {
  /deep/.el-input__inner {
    width: 280px;
    margin-bottom: 10px;
    height: 32px;
  }
  /deep/.el-input__icon {
    line-height: 33px;
    padding-bottom: 6px;
  }
}
.button {
  display: flex;
  flex-direction: column;
  padding-right: 20px;
  .el-button {
    height: 30px;
    line-height: 5px;
    margin-bottom: 10px;
  }
}

.mian {
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  background: #f3f4f9;
  .el-aside {
    background: #fff;
    margin-right: 10px;
    padding-left: 10px;
  }
  .el-main {
    background: #fff;
  }
}
.input1 {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .el-input {
    margin-left: 10px;
    width: 200px;
  }
  /deep/.el-input__inner {
    height: 32px !important;
  }
  .text1 {
    margin-right: 12px;
  }
}
.asidertop {
  border-left: 3px solid #2a8df0;
  height: 22px;
  margin-top: 20px;
  margin-bottom: 15px;
  .asidertext {
    color: #2a8df0;
    padding-left: 5px;
    margin-bottom: 15px;
  }
}
.el-container {
  width: 100%;
  height: 100%;
  display: flex;
}
.input {
  display: flex;
  color: #fda624;
  font-size: 12px;
  margin-bottom: 20px;
}
</style>