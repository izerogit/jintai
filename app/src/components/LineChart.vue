<template>
  <div id="wrapper">
    <!--内容工具栏-->
    <div>
      <el-button-group>
        <el-button type="primary" icon="edit" @click="handleOpen"></el-button>
        <el-button type="primary" icon="share" @click="handleClose"></el-button>
        <el-button type="primary" icon="delete"></el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="primary" icon="arrow-left">上一页</el-button>
        <el-button type="primary">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </el-button-group>   
    </div>

    <!--图表栏-->
    <div id="c1"></div>

    <!--数据栏-->
    <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="date"
          label="类型"
          sortable
          width="180">
        </el-table-column>
        <el-table-column
          prop="pv"
          label="名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="successRate"
          label="值">
        </el-table-column>
        <el-table-column
          prop="time"
          label="名称"
          width="180">
        </el-table-column>        
        <el-table-column
          prop="count"
          label="标签"
          width="100"
          :filters="[{ text: '4', value: '4' }, { text: '6', value: '6' }]"
          :filter-method="filterTag"
          filter-placement="bottom-end">
          <template scope="scope">
            <el-tag
              :type="scope.row.tag === '4' ? 'primary' : 'success'"
              close-transition>{{scope.row.tag}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
  var G2 = require('g2');

  export default {
    name: 'landing-page',
    data () {
      return {
        tableData: [
          {'date': 1489593600000, 'pv': 17, 'successRate': 0.23529411764705882, 'time': 12351000, 'count': 4},
          {'date': 1489680000000, 'pv': 10, 'successRate': 0.6, 'time': 18000, 'count': 6},
          {'date': 1489766400000, 'pv': 3, 'successRate': 0, 'time': 0, 'count': 0},
          {'date': 1489852800000, 'pv': 3, 'successRate': 0, 'time': 0, 'count': 0},
          {'date': 1489939200000, 'pv': 18, 'successRate': 0.2222222222222222, 'time': 21157000, 'count': 4},
          {'date': 1490025600000, 'pv': 32, 'successRate': 0.25, 'time': 3543000, 'count': 8},
          {'date': 1490112000000, 'pv': 25, 'successRate': 0.56, 'time': 10000, 'count': 14},
          {'date': 1490198400000, 'pv': 23, 'successRate': 0.43478260869565216, 'time': 24000, 'count': 10},
          {'date': 1490284800000, 'pv': 7, 'successRate': 0.2857142857142857, 'time': 0, 'count': 2}
        ]
      }
    },
    mounted () {
      this.show();
    },
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath);
      },
      show () {
        const second = 1000;
        const minute = 1000 * 60;
        const hour = 60 * minute;
        const day = 24 * hour;

        function toInterge (number, fix = 1) {
          if (Math.round(number) === number) {
            return `${number}`;
          }
          return `${Number(number).toFixed(fix)}`;
        }

        function humanizeDuration (duration, fix = 1) {
          if (duration === 0) {
            return 0;
          }
          if (duration < minute) {
            return `${toInterge(duration / second, fix)} 秒`;
          }
          if (duration < hour) {
            return `${toInterge(duration / minute, fix)} 分`;
          }
          if (duration < day) {
            return `${toInterge(duration / hour, fix)} 小时`;
          }
          return `${toInterge(duration / hour / 24, fix)} 天`;
        }

        const dash = [
          {'count': 4, 'date': 1489593600000, 'time': null},
          {'count': 6, 'date': 1489680000000, 'time': 18000},
          {'count': 0, 'date': 1489766400000, 'time': 0},
          {'count': 0, 'date': 1489852800000, 'time': 0},
          {'count': 4, 'date': 1489939200000, 'time': 21157000},
          {'count': 8, 'date': 1490025600000, 'time': null},
          {'count': 14, 'date': 1490112000000, 'time': null},
          {'count': 10, 'date': 1490198400000, 'time': 24000},
          {'count': 2, 'date': 1490284800000, 'time': 0}
        ];

        function pick (data, field) {
          return data.map(item => {
            const result = {};
            for (const key in item) {
              if (item.hasOwnProperty(key) && field.indexOf(key) !== -1) {
                result[key] = item[key];
              }
            }
            return result;
          });
        }

        const chart = new G2.Chart({
          id: 'c1',
          forceFit: true,
          height: 320,
          plotCfg: {
            margin: [ 40, 80, 80, 80 ]
          }
        });

        chart.legend({
          mode: false,
          position: 'bottom',
          dy: 5
        });

        chart.axis('date', {
          title: false
        });

        const scale = {
          date: {
            alias: '日期',
            type: 'time',
            mask: 'mm-dd'
          },
          pv: {
            alias: '进入次数',
            min: 0
          },
          time: {
            alias: '平均时长',
            formatter: value => humanizeDuration(value, 0)
          },
          count: {
            alias: '次数'
          }
        };

        const view1 = chart.createView();
        view1.source(pick(this.tableData, [ 'pv', 'time', 'date' ]), scale);
        view1.line().position('date*pv*count').color('#4FAAEB').size(2);
        view1.line().position('date*time').color('#9AD681').size(2);

        const view2 = chart.createView();
        view2.source(pick(dash, [ 'pv', 'time', 'date' ]), scale);
        view2.col('time', {
          alias: ' '
        });
        view2.axis('time', false);
        view2.tooltip(false);
        view2.line().position('date*time').color('white').size(3).style({
          lineDash: [ 4, 4 ]
        });
        chart.render();        
      }
    }
  }
</script>
