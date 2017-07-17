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
          prop="type"
          label="类型"
          sortable
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="value"
          label="值"
          :formatter="formatter">
        </el-table-column>
        <el-table-column
          prop="tag"
          label="标签"
          width="100"
          :filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]"
          :filter-method="filterTag"
          filter-placement="bottom-end">
          <template scope="scope">
            <el-tag
              :type="scope.row.tag === '家' ? 'primary' : 'success'"
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
        tableData: [{
          value: 335,
          type: '直达',
          name: '直达',
          tag: '家'
        }, {
          value: 310,
          type: '营销广告',
          name: '邮件营销',
          tag: '家'
        }, {
          value: 234,
          type: '营销广告',
          name: '联盟广告',
          tag: '公司'
        }, {
          value: 135, 
          type: '营销广告', 
          name: '视频广告',
          tag: '家'
        }, {
          value: 1048,
          type: '搜索引擎',
          name: '百度',
          tag: '公司'
        }, {
          value: 251,
          type: '搜索引擎',
          name: '谷歌',
          tag: '家'
        }, {
          value: 147,
          type: '搜索引擎',
          name: '必应',
          tag: '家'
        }, {
          value: 102,
          type: '搜索引擎',
          name: '其他',
          tag: '家'
        }]
      }
    },    
    mounted () {
      this.show();
    },
    methods: {
      formatter (row, column) {
        return row.value;
      },
      filterTag (value, row) {
        return row.tag === value;
      },      
      handleOpen (key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath);
      },
      show () {
        var Stat = G2.Stat;
        var chart = new G2.Chart({
          id: 'c1',
          forceFit: true,
          height: 450,
          plotCfg: {
            margin: 35
          }
        });

        chart.source(this.tableData);
        chart.legend(false);
        chart.coord('theta', {
          radius: 0.5 // 设置饼图的大小
        });

        // 绘制内部的饼图
        chart.intervalStack()
          .position(Stat.summary.percent('value'))
          .color('type', ['#4E7CCC', '#36B3C3', '#F9815C'])
          .label('type', {
            offset: -10,
            label: {
              fontSize: 12
            }
          });

        // 绘制外圈饼图
        var view = chart.createView();
        view.source(this.tableData);
        view.coord('theta', {
          inner: 0.75 // 设置空心部分的大小
        });
        view.intervalStack()
          .position(Stat.summary.percent('value'))
          .color('name')
          .label('name*type')
          .selected({
            mode: 'multiple' // 设置 geom 的选择模式
          });
        chart.render();

        // 交互，内部饼图某个部分被点击触发外圈饼图选中
        chart.on('plotclick', function (ev) {
          var chartGeom = chart.get('geoms')[0];
          var viewGeom = view.get('geoms')[0];
          viewGeom.clearSelected();
          var selected = chartGeom.getSelected();
          if (selected) {
            var data = selected['_origin'];
            var selectedType = data.type;
            var items = viewGeom.getData();
            for (var i = 0; i < items.length; i++) {
              var item = items[i];
              if (item['_origin'].type === selectedType) {
                viewGeom.setSelected(item);
              }
            }
          }
        });        
      }
    }
  }
</script>
