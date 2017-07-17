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

      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>        
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
        tableData: [
          { name: 'MODIFY', value: 138, washaway: 0.21014492753623193 }, 
          { name: 'PRERELEASE', value: 109, washaway: 0.5596330275229358 }, 
          { name: 'RELEASING', value: 48, washaway: 0 }          
        ],
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''        
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
        const colorSet = {
          MODIFY: '#4FAAEB',
          PRERELEASE: '#9AD681',
          RELEASING: '#FED46B'
        };

        const Shape = G2.Shape;

        Shape.registShape('interval', 'textInterval', {
          drawShape (cfg, group) {
            const points = this.parsePoints(cfg.points); // 将0-1空间的坐标转换为画布坐标
            const value = cfg.origin._origin.value;
            group.addShape('text', {
              attrs: {
                text: value,
                textAlign: 'center',
                x: points[1].x + cfg.size / 2,
                y: points[1].y,
                fontFamily: 'PingFang SC',
                fontSize: 12,
                fill: '#BBB'
              }
            });
            const polygon = group.addShape('polygon', {
              attrs: {
                points: points.map(point => [point.x, point.y]),
                fill: cfg.color
              }
            });
            return polygon;
          }
        });

        let dataLength = this.tableData.length;
        Shape.registShape('interval', 'fallFlag', {
          getShapePoints ({x, y, y0, size}) {
            return [
              { x: x + size, y: y0 + size },
              { x, y }
            ];
          },
          drawShape (cfg, group) {
            if (cfg.origin.index === dataLength - 1) {
              return;
            }
            const points = this.parsePoints(cfg.points); // 将0-1空间的坐标转换为画布坐标
            const p1 = points[0];
            const width = 9;
            const washaway = cfg.origin._origin.washaway;
            group.addShape('text', {
              attrs: {
                text: `${(washaway * 100).toFixed(1)} %`,
                x: p1.x - width / 2 - 14,
                y: p1.y - 14,
                fontFamily: 'PingFang SC',
                fontSize: 12,
                fill: '#BBB'
              }
            });
            const polygon = group.addShape('image', {
              attrs: {
                x: p1.x - 16,
                y: p1.y - 16,
                img: 'https://zos.alipayobjects.com/rmsportal/JuBdciUyUAkewNAetxtS.png',
                width: 32,
                height: 32
              }
            });
            return polygon; // 将自定义Shape返回
          }
        });

        const chart = new G2.Chart({
          id: 'c1',
          forceFit: true,
          height: 320,
          plotCfg: {
            margin: [40, 80, 80, 80]
          }
        });

        chart.legend({
          mode: false,
          position: 'bottom',
          dy: 5
        });

        chart.source(this.tableData, {
          value: {
            alias: '访问数'
          },
          name: {
            alias: '步骤名称'
          }
        });

        chart.axis('name', {
          title: null
        });

        chart.interval()
          .shape('textInterval')
          .position('name*value')
          .color('name', value => colorSet[value])
          .size(30);

        chart.interval()
          .position('name*value')
          .color('#E4E4E4')
          .shape('fallFlag');

        chart.render();       
      }
    }
  }
</script>
