import * as echarts from 'echarts'

function getPointData(data) {
    console.log(data)
    let result = []
    let cityPosition = {}
    data.forEach(element => {
        if(!cityPosition[element.startcs]){
            cityPosition[element.startcs] = [element.startlon, element.startlat, element.startcs]
        }
        if(!cityPosition[element.endcs]){
            cityPosition[element.endcs] = [element.endlon, element.endlat, element.endcs]
            
        }
    });
    for (const key in cityPosition) {
        result.push({
            name: key,
            value: cityPosition[key]
        })
    }
    return result
}

function getLineData(data) {
    let result = []
    data.forEach(element => {
        result.push({
            '出发地': element.startcs,
            "到达地": element.endcs,
            coords: [[element.startlon, element.startlat], [element.endlon, element.endlat]],
            // "到达时间":element.crossingtime,
            // "货运种类":element.goosdtype,
            "荷载量":element.realload,
            
        })
    });
    
    return result
}

function echartsMapInit(element, data) {
    // 城市数据
    let pointData = getPointData(data)
    //飞线数据
    let lineData = getLineData(data)
    console.log(lineData)
    // console.log('data');
    // console.log(data);
    // console.log(pointData);
    // console.log('lineData');
    // console.log(lineData);
    let chart = echarts.init(element);
    
    const flySeries = [];
    flySeries.push({
        type: 'lines',
        // colorBy: 'data',
        color: '#0091FF',
        zlevel: 1,
        symbol: ['none', 'none'],
        symbolSize: 0,
        effect: { //特效线配置
            show: true,
            period: 4, //特效动画时间，单位s
            trailLength: 0, //特效尾迹的长度，从0到1
            symbol: 'arrow',
            symbolSize: 10
        },
        lineStyle: {
            normal: {
                // color: '#f19000',
                width: 2,
                opacity: 0.6,
                curveness: 0.2 //线的平滑度
            }
        },
        data: lineData,
    }, 
    {
        type: 'scatter',
        coordinateSystem: 'geo',
        zlevel: 12,
        color: '#47FDB2',
        symbolSize: 10,
        label: {
            normal: {
                show: true,
                position: 'right',
                formatter: (params) => {
                    if(params.name in []) {
                        return ''
                    }else{
                        return params.name
                    }
                    // return params.name
                }
            }
        },
        data: pointData,
    }, 
    );
    // console.log(flySeries[0].data);
    // console.log(flySeries[1].data);
    //配置项
    let option = {
        backgroundColor: '#C4D7F3',
        title: {
            text: '',
            x: 'center',
            top: "20",
            textStyle: {
                color: '#31afff',
                fontSize: 20,
                fontWeight: 500
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                console.log(params);
                if (params.value) {
                    return params.name + ' : ' + params.value[2];
                } else {
                    var res = ''
                    var datas = params.data
                    var entries = Object.entries(datas)
                    entries.forEach(r=>{
                        if(r[0] == "coords"){
                            r.splice(r,1)
                        }else{
                            res += "<p>" + r[0] + ":" + r[1] +"</p>"
                        }
                    })
                    return res
                }
            }
        },
        geo: {
            map: 'china',
            roam: true, //开启鼠标缩放和漫游
            zoom: 7, //地图缩放级别
            selectedMode: false, //选中模式：single | multiple
            center: [120, 34],
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            layoutCenter: ['50%', '50%'], //设置后left/right/top/bottom等属性无效
            layoutSize: '110%', //保持地图宽高比
            label: {
                show: true,
                emphasis: {
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    areaColor: '#F8F7F3',
                    borderWidth: 1.1,
                    borderColor: '#C4C0B6',
                    label: {
                        show: true
                    }
                },
                emphasis: {
                    areaColor: '#F8F7F3'
                }
            },
        },
        series: flySeries
    };

    chart.setOption(option);
    return chart
}
// echartsMapInit(document.getElementById('map'));
export default echartsMapInit