import React, { useMemo } from 'react'
import { Vector3 } from 'three'
import { DoubleSide } from 'three'
import { MeshLambertMaterial } from 'three'
import { BoxFacade, Canvas3D, Group3DFacade, HtmlOverlay3DFacade, OrthographicCamera3DFacade } from 'troika-3d'
import { createDerivedMaterial } from 'troika-three-utils'

const defaultOption = {
    width: 600,
    height: 400,
    series: [
        {
            data: [
                {
                    name: 'sdf',
                    value: 10,
                    color: 0x028DF2
                },
                {
                    name: 'asdf',
                    value: 20,
                    color: 0x770077
                },
                {
                    name: '2423',
                    value: 17,
                    color: 0x00f0fc
                }
            ]
        },
        {
            data: [
                {
                    name: 'sdf',
                    value: 27,
                    color: 0xf0000f
                },
                {
                    name: 'asdf',
                    value: 15,
                    color: 0x770077
                },
                {
                    name: '2423',
                    value: 30,
                    color: 0x00f0fc
                }
            ]
        },
        {
            data: [
                {
                    name: 'sdf',
                    value: 27,
                    color: 0xf0000f
                },
                {
                    name: 'asdf',
                    value: 15,
                    color: 0x770077
                },
                {
                    name: '2423',
                    value: 30,
                    color: 0x00f0fc
                }
            ]
        },
        {
            data: [
                {
                    name: 'sdf',
                    value: 27,
                    color: 0xf0000f
                },
                {
                    name: 'asdf',
                    value: 15,
                    color: 0x770077
                },
                {
                    name: '2423',
                    value: 30,
                    color: 0x00f0fc
                }
            ]
        }
    ],
    barWidth: 15,
    top: 20,
    bottom: 20,
    left: 30,
    right: 0,
    maskScale: 4,
    barGap: 20,
    xAxis: {
        lineColor: 0xf0f0f0,
        labelColor: 0xf0f0f0,
        data: ['sd', 'asdf', 'asfd']

    },
    yAxis: {
        lineColor: 0xf0f0f0,
        labelColor: 0xf0f0f0,
        min: 0,
        max: 40,
        interval: 10
    }
}
const Bar = (props) => {
    const option = { ...defaultOption, ...(props.option ?? {}) }
    const { width, height, barWidth, maskScale, series, top, bottom, left, right, yAxis, xAxis, barGap } = option
    const maxVal = Math.max(...series.map(s => Math.max(...s.data.map(d => d.value))))
    const wireframe = false
    return <Canvas3D
        width={width}
        height={height}
        lights={[
            { type: 'ambient', color: 0xc0c0c0 },
            { type: 'directional', z: 1000, y: height + 600, x: width + 10 },
            // { type: 'directional', z: 500, y: height + 400, x: -width - 10 },
        ]}
        camera={{
            facade: OrthographicCamera3DFacade,
            z: height * 2 + height / 2,
            y: height + 100,
            lookAt: new Vector3(0, 0, 0),
            left: 0,
            right: width,
            top: height,
            bottom: 0,
            far: 2000,
            near: 0
            // z: 500,
            // y: 500,
            // x: width / 2
        }}
        objects={
            {
                key: 'main',
                facade: Group3DFacade,
                children: [
                    {
                        key: 'bars',
                        facade: Group3DFacade,
                        children: xAxis.data.map((item, i) => {
                            let maxBarHeight = 0
                            const itemWidth = series.length * barWidth + barGap * (series.length - 1)
                            return {
                                key: 'bar_grp_' + i,
                                facade: Group3DFacade,
                                y: maxBarHeight / 2 + bottom,
                                x: left + (width - left - right) / xAxis.data.length * i + (width - left - right) / xAxis.data.length / 2 - barWidth,
                                children: [...series.map((s, j) => {
                                    const item = s.data[i]
                                    const innerBarHeight = item.value / maxVal * (height - top - bottom) * (maxVal / yAxis.max)
                                    const outerBarHeight = item.value / maxVal * (height - top - bottom) * (maxVal / yAxis.max) + maskScale * 2
                                    maxBarHeight = Math.max(maxBarHeight, outerBarHeight)
                                    return {
                                        key: 'series_' + i + '_' + j,
                                        facade: Group3DFacade,
                                        rotateY: Math.PI / 4,
                                        x: barWidth / 2 + (barWidth + barGap) * j - itemWidth / 2,
                                        y: outerBarHeight / 2,
                                        children: [
                                            {
                                                key: 'bar_' + i,
                                                facade: BoxFacade,
                                                width: barWidth,
                                                height: innerBarHeight,
                                                depth: barWidth,
                                                material: createDerivedMaterial(new MeshLambertMaterial({
                                                    transparent: true,
                                                    side: DoubleSide,
                                                    opacity: 0.7,
                                                    color: item.color,
                                                    wireframe: wireframe
                                                }), {
                                                    vertexDefs: `
                                                        varying vec3 vPos;`,
                                                    vertexMainIntro: `vPos = position;`,
                                                    fragmentDefs: `varying vec3 vPos;`,
                                                    fragmentColorTransform: `
                                                        float aa = gl_FragColor.a * (vPos.y + 0.5);
                                                        if (vPos.y >= 0.5) {
                                                            aa = 0.90;
                                                        }
                                                        gl_FragColor = vec4(gl_FragColor.rgb, aa);`
                                                })
                                            },
                                            {
                                                key: 'bar_mask_' + i,
                                                facade: BoxFacade,
                                                width: barWidth + maskScale * 2,
                                                height: outerBarHeight,
                                                depth: barWidth + maskScale * 2,
                                                material: createDerivedMaterial(new MeshLambertMaterial({
                                                    side: DoubleSide,
                                                    transparent: true,
                                                    opacity: 0.2,
                                                    color: item.color,
                                                    wireframe: wireframe
                                                }), {
                                                    vertexDefs: `
                                                        varying vec3 vPos;`,
                                                    vertexMainIntro: `vPos = position;`,
                                                    fragmentDefs: `varying vec3 vPos;`,
                                                    fragmentColorTransform: `
        
                                                        gl_FragColor = vec4(gl_FragColor.rgb, gl_FragColor.a * (vPos.y + 0.5));`
                                                })
                                            }
                                        ],
                                        animation: {
                                            0: { rotateY: 0 },
                                            100: { rotateY: Math.PI * 2 },
                                            duration: 10000,
                                            iterations: Infinity
                                        }
                                    }
                                }), {
                                    key: 'bar_label_' + i,
                                    facade: HtmlOverlay3DFacade,
                                    html: (<div style={{ transform: 'translateX(-50%)', color: '#' + xAxis.labelColor.toString(16).padStart(6, '0') }}>{xAxis.data[i]}</div>),
                                    y: -0.5
                                }]
                            }
                        })
                    },
                    {
                        key: 'xAxis',
                        facade: BoxFacade,
                        x: left + (width - left - right) / 2,
                        width: width - left - right,
                        height: 1,
                        depth: 1,
                        y: bottom,
                        'material.color': xAxis.lineColor
                    },
                    {
                        key: 'yAxis',
                        facade: BoxFacade,
                        x: left,
                        y: bottom + (height - top - bottom + 0) / 2,
                        width: 1,
                        height: height - top - bottom + 0,
                        depth: 1,
                        'material.color': yAxis.lineColor,
                        children: [...Array(Math.ceil(yAxis.max / yAxis.interval)), 1].map((e, i) => {
                            return {
                                key: 'yAxisLabel_' + i,
                                facade: HtmlOverlay3DFacade,
                                y: ((height - top - bottom + 0) / Math.ceil(yAxis.max / yAxis.interval)) * i / (height - top - bottom + 0) - 0.5,
                                html: <div style={{ paddingRight: 6, transform: 'translateX(-100%) translateY(-50%)', color: '#' + yAxis.labelColor.toString(16).padStart(6, '0') }}>{yAxis.interval * i}</div>
                            }
                        })
                    }
                ]
            }
        }
    >
    </Canvas3D>
}

export default Bar
