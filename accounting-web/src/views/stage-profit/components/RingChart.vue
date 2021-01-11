<template>
    <div class="ringChart" style="height: 100%; width: 100%" @click="changeData">
        <div style="height: 100%; width: 100%" ref="ringWrap"></div>
    </div>
</template>

<script>
    import echarts from 'echarts/lib/echarts'

    require('echarts/lib/chart/pie')
    require('echarts/lib/component/tooltip')
    require('echarts/lib/component/title')

    export default {
        name: 'BarChart',
        props: {
            ringColor: {
                type: String,
                default: '#2d8cf0'
            },
            ringData: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        watch: {
            ringData: function (v) {
                if (v) {
                    this.initChart(v)
                }
            }
        },
        data () {
            return {
                chart: null
            }
        },
        mounted () {
            const self = this
            this.resize = _.debounce(function () {
                self.chart && self.chart.resize()
            }, 300)
            this.$nextTick(() => {
                this.initChart(this.ringData)
                window.addEventListener("resize", this.resize)
            })
        },
        beforeDestroy () {
            if (!this.chart) {
                return
            }
            window.removeEventListener("resize", this.resize)
            this.chart.dispose()
            this.chart = null
        },

        methods: {
            initChart (data) {
                this.chart = echarts.init(this.$refs['ringWrap'], '')
                var color = this.ringColor
                this.chart.setOption({
                    tooltip: {
                        trigger: 'none'
                        // formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    title: {
                        show: true,
                        text: this.ringData[0].name + '\n\n' + this.ringData[0].value + '%',
                        top: 'center',
                        left: 'center',
                        textStyle: {
                            fontSize: '18px'
                        }
                    },
                    series: [
                        {
                            itemStyle: {
                                normal:{
                                    color:function(params) {
                                        var colorList = ['#f5f5f5'];
                                        if (params.value < 0) {
                                            colorList.unshift('#f5f5f5')
                                        } else {
                                            colorList.unshift(color)
                                        }
                                        return colorList[params.dataIndex]
                                    }
                                },
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            hoverAnimation:false,
                            type:'pie',
                            radius: ['50%', '70%'],
                            label: {
                                show: false
                            },
                            data: data
                        }
                    ]
                })
            },

            changeData () {
                this.$emit('changeType')
            }
        }
    }
</script>
<style>
    .ringChart{
        cursor: pointer;
    }
</style>
