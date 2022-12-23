export class NewMeasure {
    constructor(Cesium, viewer) {
        this._Cesium = Cesium;
        this._viewer = viewer;
        this._cacheHash = {}; // 缓存测量点位
        this._uuid = null;
        this._handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        this._closeHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        this._flag = false;
    }
    /**
     * 开始测量
     * @param {String} type 选择测量类型
     * @param {Number} mode 选择测量模式 1:水平测量 2:贴地测量
     */
    startMeasure(type, callBack) {
        this.reset();
        if(type === 'distance')
            this.measureDistance(type, callBack);
        if (type === 'area')
            this.measureArea(type, callBack);
        if (type === 'height')
            this.measureHeight(type, callBack);
        if (type === 'angle')
            this.measureAngle(type, callBack);
    }
    // 测距
    measureDistance(type, callBack) {
        this._flag = true; // 判断是否进入测量模式
        let cacheHash = this._cacheHash;
        let uuid = this._uuid = this.uuid(); // 生成uuid，区分多次测量
        let polyLineEntity = null; // 测量线实例
        // let labelEntity = null;
        let closeTipEntity = null; // 关闭测量的实例
        let notPick = ['measureLabel', 'measurePolygon', 'measurePoint', 'measureLine'];
        cacheHash[uuid] = {
            "type": type,
            "result": 0,
            "positions": [], // 存放该次测量点击点位
            "entities" : [],  // 存放该次测量生成实例
            "labelEntity": null // 存放该次测量生成的随鼠标位置显示总长的label实例
        }
        // 鼠标左击事件-绘点
        this._handler.setInputAction(movement => {
            let position = this.hasPick(movement.position, notPick);
            // 跳出地球时异常
            if(!this._Cesium.defined(position)) return false;
            // 测量点击点位数据存入数组
            cacheHash[uuid].positions.push(position);
            // 判断测量点击点位数量
            if(cacheHash[uuid].positions.length > 1) {
                this.getSpaceDistance(uuid, type);
            } else {
                let pointEntity = this.createPointEntity(position, "起点");
                cacheHash[uuid].entities.push(pointEntity);
            }
        }, this._Cesium.ScreenSpaceEventType.LEFT_CLICK);
        // 鼠标移动事件-绘线
        this._handler.setInputAction(movement => {
            let linePointsCollection = cacheHash[uuid].positions.concat();
            let position = this.hasPick(movement.endPosition, notPick);
            // 跳出地球时异常
            if(!this._Cesium.defined(position)) return false;
            // 判断测量点击点位数量
            linePointsCollection.push(position);
            if(linePointsCollection.length >= 1) {
                // 判断测量线实例是否存在
                if(!this._Cesium.defined(polyLineEntity)) {
                    polyLineEntity = this.createLineEntity();
                    cacheHash[uuid].entities.push(polyLineEntity);
                } else {
                    polyLineEntity.polyline.positions = new this._Cesium.CallbackProperty(() => {
                        return linePointsCollection;
                    }, false);
                    if(linePointsCollection.length < 2) return false;
                    // 随鼠标位置动态显示当前总长
                    // if(mode === 1) {
                        let positions = linePointsCollection;
                        //只计算最后一截，与前面累加
                        //因move和鼠标左击事件，最后两个点坐标重复
                        let i = positions.length - 2;
                        // 笛卡尔坐标转经纬度（弧度值）
                        let cartographic1 = this._Cesium.Cartographic.fromCartesian(positions[i]);
                        let cartographic2 = this._Cesium.Cartographic.fromCartesian(positions[i + 1]);
                        let lng1 = this._Cesium.Math.toDegrees(cartographic1.longitude);
                        let lng2 = this._Cesium.Math.toDegrees(cartographic2.longitude);
                        let lat1 = this._Cesium.Math.toDegrees(cartographic1.latitude);
                        let lat2 = this._Cesium.Math.toDegrees(cartographic2.latitude);
                        let distance = Number((turf.distance(
                            turf.point([lng1, lat1]),
                            turf.point([lng2, lat2]),
                            { units: "kilometers" }
                        ) * 1000).toFixed(0));
                        let textDistance = '';
                        let cumulative = this._cacheHash[uuid].result + distance;
                        if(cumulative <= 1000)
                            textDistance = '总长：' + (cumulative).toFixed(2) + '米';
                        else
                            textDistance = '总长：' + (cumulative / 1000).toFixed(2) + '公里';
                        if(!this._Cesium.defined(this._cacheHash[uuid].labelEntity)) {
                            this._cacheHash[uuid].labelEntity = this.createLabelEntity(positions[positions.length - 1], '');
                        } else {
                            this._cacheHash[uuid].labelEntity.label.text = textDistance;
                            this._cacheHash[uuid].labelEntity.position = positions[positions.length - 1];
                        }
                    // }
                }
            }
        }, this._Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        // 鼠标左双击事件-结束绘制
        this._handler.setInputAction(movement => {
            let position = this.hasPick(movement.position, notPick);
            // 跳出地球时异常
            if(!this._Cesium.defined(position)) return false;
            // 删除由双击触发单击事件所打的点
            this._viewer.entities.remove(cacheHash[uuid].entities[cacheHash[uuid].entities.length - 2]);
            for(let i = 0; i < cacheHash[uuid].entities.length; i++) {
                if(i == (cacheHash[uuid].entities.length - 2)) {
                    cacheHash[uuid].entities.splice(i, 1);
                    i ++;
                }
            }
            cacheHash[uuid].positions.splice((cacheHash[uuid].positions.length - 1), 1);
            // 修改最后一个点位实例的label的文本信息
            cacheHash[uuid].entities[cacheHash[uuid].entities.length - 1].label.text = 
            '总长：' + cacheHash[uuid].entities[cacheHash[uuid].entities.length - 1].label.text;
            // 隐藏根据鼠标动态显示总长的label
            if(this._Cesium.defined(this._cacheHash[uuid].labelEntity)) {
                this._cacheHash[uuid].labelEntity.show = false;
            }
            closeTipEntity = this.createCloseEntity(position, uuid);
            cacheHash[uuid].entities.push(closeTipEntity);
            // 测量完成后回调
            callBack({
                uuid: uuid,
                type: cacheHash[uuid].type,
                result: cacheHash[uuid].result,
                status: 200
            })
            this.clearInputAction();
            this._uuid = null;
        }, this._Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        // 鼠标右击事件-移除点
        this._handler.setInputAction(movement => {
            this.reset(callBack);
        }, this._Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        this._closeHandler.setInputAction(movement => {
            if(this._flag) return false;
            let closeFeature = this._viewer.scene.pick(movement.position);
            if (this._Cesium.defined(closeFeature) && closeFeature.id && closeFeature.id._name === 'closeTip') {
                let uuid = closeFeature.id._id.split('_')[1]
                this._cacheHash[uuid].entities.forEach(e => {
                    this._viewer.entities.remove(e);
                });
                if(this._Cesium.defined(this._cacheHash[uuid].labelEntity)) {
                    this._viewer.entities.remove(this._cacheHash[uuid].labelEntity);
                }
                delete this._cacheHash[uuid];
            }
        }, this._Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    // 测面
    measureArea(type, callBack) {
        this._flag = true; // 判断是否进入测量模式
        let cacheHash = this._cacheHash;
        let uuid = this._uuid = this.uuid(); // 生成uuid，区分多次测量
        let polygonEntity = null; // 测量面实例
        let polyLineEntity = null; // 测量线实例
        let closeTipEntity = null; // 关闭测量的实例
        let notPick = ['measureLabel', 'measurePolygon', 'measurePoint', 'measureLine'];
        cacheHash[uuid] = {
            "type": type,
            "result": 0,
            "positions": [], // 存放该次测量点击点位
            "entities" : [],  // 存放该次测量生成实例
            "labelEntity": null // 存放该次测量生成的随鼠标位置显示总长的label实例
        }
        this._handler.setInputAction(movement => {
            let position = this.hasPick(movement.position, notPick);
            // 跳出地球时异常
            if(!this._Cesium.defined(position)) return false;
            cacheHash[uuid].positions.push(position);

            let pointEntity = this.createPointEntity(position);
            cacheHash[uuid].entities.push(pointEntity);
        }, this._Cesium.ScreenSpaceEventType.LEFT_CLICK);
        // 鼠标移动事件-绘线
        this._handler.setInputAction(movement => {
            // if(this._polygonPositions.length < 1) return false;
            let pointsCollection = cacheHash[uuid].positions.concat();
            let position = this.hasPick(movement.endPosition, notPick);
            // 跳出地球时异常
            if(!this._Cesium.defined(position)) return false;
            // 判断测量点击点位数量
            pointsCollection.push(position);
            if(pointsCollection.length > 2) {
                pointsCollection.push(pointsCollection[0]);
                let areaMeasure = this.getAreaMeasure(uuid, pointsCollection);
                let centerLng = areaMeasure.centerLng;
                let centerLat = areaMeasure.centerLat;
                let centerHeight = areaMeasure.centerHeight;
                let areaValue = areaMeasure.areaValue;
                if(!this._Cesium.defined(this._cacheHash[uuid].labelEntity)) {
                    this._cacheHash[uuid].labelEntity = this.createAreaLabelEntity(this._Cesium.Cartesian3.fromDegrees(centerLng, centerLat, centerHeight), areaValue + '平方千米');
                } else {
                    this._cacheHash[uuid].labelEntity.label.text = areaValue + "平方千米";
                    this._cacheHash[uuid].labelEntity.position = new this._Cesium.CallbackProperty(() => {
                        return this._Cesium.Cartesian3.fromDegrees(centerLng, centerLat, centerHeight);
                    }, false);
                }
            }
            if(pointsCollection.length >= 1) {
                if(!this._Cesium.defined(polyLineEntity)) {
                    polyLineEntity = this.createLineEntity();
                    cacheHash[uuid].entities.push(polyLineEntity);
                } else {
                    polyLineEntity.polyline.positions = new this._Cesium.CallbackProperty(() => {
                        return pointsCollection;
                    }, false);
                }
            }
            if(pointsCollection.length >= 2) {
                if(!this._Cesium.defined(polygonEntity)) {
                    polygonEntity = this.createPolygonEntity(new this._Cesium.PolygonHierarchy(pointsCollection));
                    cacheHash[uuid].entities.push(polygonEntity);
                } else {
                    polygonEntity.polygon.hierarchy = new this._Cesium.CallbackProperty(() => {
                        return new this._Cesium.PolygonHierarchy(pointsCollection);
                    }, false);
                }
            }
        }, this._Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this._handler.setInputAction(movement => {
            let position = this.hasPick(movement.position, notPick);
            // 跳出地球时异常
            if(!this._Cesium.defined(position)) return false;
            // 删除由双击触发单击事件所打的点
            this._viewer.entities.remove(cacheHash[uuid].entities[cacheHash[uuid].entities.length - 2]);
            for(let i = 0; i < cacheHash[uuid].entities.length; i++) {
                if(i == (cacheHash[uuid].entities.length - 2)) {
                    cacheHash[uuid].entities.splice(i, 1);
                    i ++;
                }
            }
            cacheHash[uuid].positions.splice((cacheHash[uuid].positions.length - 1), 1);
            //事件清除
            closeTipEntity = this.createCloseEntity(position, uuid);
            cacheHash[uuid].entities.push(closeTipEntity);
            // 测量完成后回调
            callBack({
                uuid: uuid,
                type: cacheHash[uuid].type,
                result: cacheHash[uuid].result,
                status: 200
            })
            this.clearInputAction();
            this._uuid = null;
        }, this._Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        this._handler.setInputAction(movement => {
            this.reset(callBack);
        }, this._Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        this._closeHandler.setInputAction(movement => {
            if(this._flag) return false;
            let closeFeature = this._viewer.scene.pick(movement.position);
            if (this._Cesium.defined(closeFeature) && closeFeature.id && closeFeature.id._name === 'closeTip') {
                let uuid = closeFeature.id._id.split('_')[1]
                this._cacheHash[uuid].entities.forEach(e => {
                    this._viewer.entities.remove(e);
                });
                if(this._Cesium.defined(this._cacheHash[uuid].labelEntity)) {
                    this._viewer.entities.remove(this._cacheHash[uuid].labelEntity);
                }
                delete this._cacheHash[uuid];
            }
        }, this._Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    // 测高
    measureHeight(type, callBack) {
        this._flag = true; // 判断是否进入测量模式
        let cacheHash = this._cacheHash;
        let uuid = this._uuid = this.uuid(); // 生成uuid，区分多次测量
        let polyLineEntity = null; // 测量线实例
        let closeTipEntity = null; // 关闭测量的实例
        let notPick = ['measureLabel', 'measurePolygon', 'measurePoint', 'measureLine'];
        cacheHash[uuid] = {
            "type": type,
            "result": 0,
            "positions": [], // 存放该次测量点击点位
            "entities" : [],  // 存放该次测量生成实例
            "labelEntity": null // 存放该次测量生成的随鼠标位置显示总长的label实例
        }
        // 鼠标左击事件-绘点
        this._handler.setInputAction(movement => {
            let position = this.hasPick(movement.position, notPick);
            // 跳出地球时异常
            if(!this._Cesium.defined(position)) return false;
            // 测量点击点位数据存入数组
            cacheHash[uuid].positions.push(position);
            let pointEntity = this.createPointEntity(position, "");
            cacheHash[uuid].entities.push(pointEntity);
            if(cacheHash[uuid].positions.length > 1) {
                closeTipEntity = this.createCloseEntity(position, uuid);
                cacheHash[uuid].entities.push(closeTipEntity);
                // 测量完成后回调
                callBack({
                    uuid: uuid,
                    type: cacheHash[uuid].type,
                    result: cacheHash[uuid].result,
                    status: 200
                })
                this.clearInputAction();
                this._uuid = null;
            }
        }, this._Cesium.ScreenSpaceEventType.LEFT_CLICK);
        // 鼠标移动事件-绘线
        this._handler.setInputAction(movement => {
            let position = this.hasPick(movement.endPosition, notPick);
             // 跳出地球时异常
            if(!this._Cesium.defined(position)) return false;
            if(cacheHash[uuid].positions.length === 1) {
                let positions_collection = [];
                let cachePosition = this.transform(cacheHash[uuid].positions[0]);
                let curPosition = this.transform(position);
                positions_collection.push(cachePosition.lng, cachePosition.lat, cachePosition.alt);
                positions_collection.push(curPosition.lng, curPosition.lat, curPosition.alt);
                positions_collection.push(cachePosition.lng, cachePosition.lat, curPosition.alt);
                positions_collection.push(cachePosition.lng, cachePosition.lat, cachePosition.alt);

                let resultHeight = Math.abs(curPosition.alt - cachePosition.alt).toFixed(2);
                
                let tipPosition = {
                    lng: cachePosition.lng,
                    lat: cachePosition.lat,
                    alt: (curPosition.alt + cachePosition.alt) / 2
                }
                if(!this._Cesium.defined(cacheHash[uuid].labelEntity)) {
                    cacheHash[uuid].labelEntity = this.createAreaLabelEntity(this._Cesium.Cartesian3.fromDegrees(tipPosition.lng, tipPosition.lat, tipPosition.alt), resultHeight + '米');
                } else {
                    // 将测量最终值赋予对象
                    cacheHash[uuid].result = resultHeight;
                    cacheHash[uuid].labelEntity.label.text = resultHeight + '米';
                    cacheHash[uuid].labelEntity.position = new this._Cesium.CallbackProperty(() => {
                        return this._Cesium.Cartesian3.fromDegrees(tipPosition.lng, tipPosition.lat, tipPosition.alt);
                    }, false);
                }
                if(!this._Cesium.defined(polyLineEntity)) {
                    polyLineEntity = this.createLineEntity(false);
                    cacheHash[uuid].entities.push(polyLineEntity);
                } else {
                    polyLineEntity.polyline.positions = new this._Cesium.CallbackProperty(() => {
                        return this._Cesium.Cartesian3.fromDegreesArrayHeights(positions_collection);
                    }, false);
                }
            }
        }, this._Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        // 鼠标右击事件-终止
        this._handler.setInputAction(movement => {
            this.reset(callBack);
        }, this._Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        this._closeHandler.setInputAction(movement => {
            if(this._flag) return false;
            let closeFeature = this._viewer.scene.pick(movement.position);
            if (this._Cesium.defined(closeFeature) && closeFeature.id && closeFeature.id._name === 'closeTip') {
                let uuid = closeFeature.id._id.split('_')[1]
                this._cacheHash[uuid].entities.forEach(e => {
                    this._viewer.entities.remove(e);
                });
                if(this._Cesium.defined(this._cacheHash[uuid].labelEntity)) {
                    this._viewer.entities.remove(this._cacheHash[uuid].labelEntity);
                }
                delete this._cacheHash[uuid];
            }
        }, this._Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    // 测角
    measureAngle() {

    }
    // 重制/中断测量
    reset(callBack) {
        if(this._uuid) {
            if(this._cacheHash[this._uuid].type === "distance") {
                let positions = this._cacheHash[this._uuid].positions;
                let entities = this._cacheHash[this._uuid].entities;
                // 隐藏根据鼠标动态显示总长的label
                if(this._Cesium.defined(this._cacheHash[this._uuid].labelEntity)) {
                    this._cacheHash[this._uuid].labelEntity.show = false;
                }
                if(positions.length > 1) {
                    this._cacheHash[this._uuid].entities[this._cacheHash[this._uuid].entities.length - 1].label.text = 
                    '总长：' + this._cacheHash[this._uuid].entities[this._cacheHash[this._uuid].entities.length - 1].label.text;
                    let closeTipEntity = this.createCloseEntity(positions[positions.length - 1], this._uuid);
                    this._cacheHash[this._uuid].entities.push(closeTipEntity);
                    entities.forEach(e => {
                        if(e._name === 'measureLine') {
                            e.polyline.positions = new this._Cesium.CallbackProperty(() => {
                                return positions;
                            }, false);
                        }
                    });
                    // 测量完成后回调
                    if(callBack) {
                        callBack({
                            uuid: this._uuid,
                            type: this._cacheHash[this._uuid].type,
                            result: this._cacheHash[this._uuid].result,
                            status: 200
                        })
                    }
                } else {
                    // 测量完成后回调
                    if(callBack) {
                        callBack({
                            uuid: this._uuid,
                            type: this._cacheHash[this._uuid].type,
                            result: this._cacheHash[this._uuid].result,
                            status: 404
                        })
                    }
                    entities.forEach(e => {
                        this._viewer.entities.remove(e);
                    });
                    this._viewer.entities.remove(this._cacheHash[this._uuid].labelEntity);
                    delete this._cacheHash[this._uuid];
                }
            } else if (this._cacheHash[this._uuid].type === "area") {
                let positions = this._cacheHash[this._uuid].positions;
                // let type = this._cacheHash[this._uuid].type;
                let entities = this._cacheHash[this._uuid].entities;
                let loopPositions = [];
                if(positions.length > 2) {
                    loopPositions = positions.concat();
                    loopPositions.push(loopPositions[0]);
                    entities.forEach(e => {
                        if(e._name === 'measureLine') {
                            e.polyline.positions = new this._Cesium.CallbackProperty(() => {
                                return loopPositions;
                            }, false);
                        }
                        if(e._name === 'measurePolygon') {
                            e.polygon.hierarchy = new this._Cesium.CallbackProperty(() => {
                                return new this._Cesium.PolygonHierarchy(positions);
                            }, false);
                        }
                    });
                    let areaMeasure = this.getAreaMeasure(this._uuid, loopPositions);
                    let centerLng = areaMeasure.centerLng;
                    let centerLat = areaMeasure.centerLat;
                    let centerHeight = areaMeasure.centerHeight;
                    let areaValue = areaMeasure.areaValue;
                    if(!this._Cesium.defined(this._cacheHash[this._uuid].labelEntity)) {
                        this._cacheHash[this._uuid].labelEntity = this.createAreaLabelEntity(this._Cesium.Cartesian3.fromDegrees(centerLng, centerLat, centerHeight), areaValue + '平方千米');
                    } else {
                        this._cacheHash[this._uuid].labelEntity.label.text = areaValue + "平方千米";
                        this._cacheHash[this._uuid].labelEntity.position = new this._Cesium.CallbackProperty(() => {
                            return this._Cesium.Cartesian3.fromDegrees(centerLng, centerLat, centerHeight);
                        }, false);
                    }
                    // 事件清除
                    let closeTipEntity = this.createCloseEntity(positions[positions.length - 1], this._uuid);
                    this._cacheHash[this._uuid].entities.push(closeTipEntity);
                    // 测量完成后回调
                    if(callBack) {
                        callBack({
                            uuid: this._uuid,
                            type: this._cacheHash[this._uuid].type,
                            result: this._cacheHash[this._uuid].result,
                            status: 404
                        })
                    }
                } else {
                    // 测量完成后回调
                    this._cacheHash[this._uuid].result = 0;
                    if(callBack) {
                        callBack({
                            uuid: this._uuid,
                            type: this._cacheHash[this._uuid].type,
                            result: this._cacheHash[this._uuid].result,
                            status: 404
                        })
                    }
                    entities.forEach(e => {
                        this._viewer.entities.remove(e);
                    });
                    this._viewer.entities.remove(this._cacheHash[this._uuid].labelEntity);
                    delete this._cacheHash[this._uuid];
                }
            } else if (this._cacheHash[this._uuid].type === "height") {
                // 测量完成后回调
                this._cacheHash[this._uuid].result = 0;
                if(callBack) {
                    callBack({
                        uuid: this._uuid,
                        type: this._cacheHash[this._uuid].type,
                        result: this._cacheHash[this._uuid].result,
                        status: 404
                    })
                }
                let entities = this._cacheHash[this._uuid].entities;
                entities.forEach(e => {
                    this._viewer.entities.remove(e);
                });
                this._viewer.entities.remove(this._cacheHash[this._uuid].labelEntity);
                delete this._cacheHash[this._uuid];
            }
            this._uuid = null;
        }
        this.clearInputAction();
    }
    // 移除cesium鼠标事件
    clearInputAction() {
        this._flag = false;
        this._handler.removeInputAction(this._Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this._handler.removeInputAction(this._Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this._handler.removeInputAction(this._Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }
    // 生成关闭测量的实例
    createCloseEntity(positions, uuid) {
        return this._viewer.entities.add({
            position: positions,
            name: 'closeTip',
            id: 'closeTip_' + uuid,
            label: {
                font: '16px Helvetica',
                text: '×',
                fillColor: this._Cesium.Color.RED,
                showBackground: true,//指定标签后面背景的可见性
                backgroundColor: this._Cesium.Color.WHITE, // 背景颜色
                backgroundPadding: new this._Cesium.Cartesian2(2, 2.5),
                pixelOffset: new this._Cesium.Cartesian2(20, 0),
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        });
    }
    // 生成测量点实例
    createPointEntity(position, text) {
        return this._viewer.entities.add({
            position: position,
            name: 'measurePoint',
            point: {
                color: this._Cesium.Color.WHITE,
                outlineColor: this._Cesium.Color.RED,
                outlineWidth: 2,
                pixelSize: 6,
                heightReference: this._Cesium.HeightReference.NONE,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
            label: {
                show: text ? true : false,
                text: text,
                font: '14px sans-serif',
                fillColor: this._Cesium.Color.BLACK,
                style: this._Cesium.LabelStyle.FILL,
                scale: .7,
                showBackground: true,//指定标签后面背景的可见性
                backgroundColor: this._Cesium.Color.WHITE, // 背景颜色
                verticalOrigin: this._Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new this._Cesium.Cartesian2(0, -20),
                // heightReference: this._Cesium.HeightReference.NONE,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            }
        });
    }
    // 生成测量线实例
    createLineEntity(clamp) {
        return this._viewer.entities.add({
            name: 'measureLine',
            polyline: {
                positions: [],
                width: 4,
                clampToGround: clamp != undefined ? clamp : true,
                material: this._Cesium.Color.RED.withAlpha(0.6)
            }
        });
    }
    // 生成测量面实例
    createPolygonEntity(hierarchy) {
        return this._viewer.entities.add({
            name: 'measurePolygon',
            polygon: {
                hierarchy: hierarchy,
                material: this._Cesium.Color.RED.withAlpha(0.2),
                clampToGround: true,
                outline: true, // height is required for outline to display
                outlineColor: this._Cesium.Color.RED.withAlpha(0.2),
                // perPositionHeight: true
            }
        });
    }
    // 生成测量label实例
    createLabelEntity(position, text) {
        return this._viewer.entities.add({
            position: position,
            name: 'measureLabel',
            label: {
                text: text || "",
                font: '14px sans-serif',
                fillColor: this._Cesium.Color.BLACK,
                style: this._Cesium.LabelStyle.FILL,
                scale: .7,
                showBackground: true,//指定标签后面背景的可见性
                backgroundColor: this._Cesium.Color.WHITE, // 背景颜色
                verticalOrigin: this._Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new this._Cesium.Cartesian2(48, 40),
                // heightReference: this._Cesium.HeightReference.NONE,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            }
        });
    }
    // 生成面积label实例
    createAreaLabelEntity(position, text) {
        return this._viewer.entities.add({
            position: position,
            name: 'measureLabel',
            label: {
                text: text || "",
                font: '14px sans-serif',
                fillColor: this._Cesium.Color.BLACK,
                style: this._Cesium.LabelStyle.FILL,
                scale: .7,
                showBackground: true,//指定标签后面背景的可见性
                backgroundColor: this._Cesium.Color.WHITE, // 背景颜色
                verticalOrigin: this._Cesium.VerticalOrigin.BOTTOM,
                // heightReference: this._Cesium.HeightReference.NONE,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            }
        });
    }
    // 判断是否拾取到地形、模型
    hasPick(movement, notPick) {
        let pickedFeature = this._viewer.scene.pick(movement);
        let position = null;
        if(pickedFeature && pickedFeature.id && pickedFeature.id.name === "measurePoint") {
            // 此处写法根据版本变换或应用场景不同变换
            // position = pickedFeature.id.position.getValue();
            position = pickedFeature.id.position._value;
            // console.log('我在点位上')
        } else {
            if(pickedFeature && pickedFeature.primitive && (pickedFeature.primitive instanceof this._Cesium.Cesium3DTileset || pickedFeature.primitive instanceof this._Cesium.Model)) {
                position = this._viewer.scene.pickPosition(movement);
                // console.log('我在模型上1')
            } else {
                if(this.filterPick(pickedFeature, notPick)) {
                    position = this._viewer.scene.pickPosition(movement);
                    // console.log('我在模型上2')
                } else {
                    let ray = this._viewer.camera.getPickRay(movement);
                    if(!ray) return false;
                    position = this._viewer.scene.globe.pick(ray, this._viewer.scene);
                    // console.log('我在摄像机上')
                }
            }
        }
        return position;
    }
    // 过滤拾取某个实例
    filterPick(pickedFeature, notPick) {
        let isFilter = false;
        if(pickedFeature && this._Cesium.defined(pickedFeature.id)) {
            let entity = pickedFeature.id;
            if(notPick.indexOf(entity.name) > -1) isFilter = true;
        }
        if(pickedFeature && this._Cesium.defined(pickedFeature.primitive)) {
            let primitive = pickedFeature.primitive;
            if(primitive == notPick) isFilter = true;
        }
        return isFilter;
    }
    // 计算空间距离
    getSpaceDistance(uuid, type) {
        let positions = this._cacheHash[uuid].positions;
        //只计算最后一截，与前面累加
        //因move和鼠标左击事件，最后两个点坐标重复
        let i = positions.length - 2;
        // 笛卡尔坐标转经纬度（弧度值）
        let cartographic1 = this._Cesium.Cartographic.fromCartesian(positions[i]);
        let cartographic2 = this._Cesium.Cartographic.fromCartesian(positions[i + 1]);
        if(type === "distance") {
            let lng1 = this._Cesium.Math.toDegrees(cartographic1.longitude);
            let lng2 = this._Cesium.Math.toDegrees(cartographic2.longitude);
            let lat1 = this._Cesium.Math.toDegrees(cartographic1.latitude);
            let lat2 = this._Cesium.Math.toDegrees(cartographic2.latitude);
            let distance = Number((turf.distance(
                turf.point([lng1, lat1]),
                turf.point([lng2, lat2]),
                { units: "kilometers" }
            ) * 1000).toFixed(0));
            let textDistance = '';
            this._cacheHash[uuid].result += distance;
            if(this._cacheHash[uuid].result <= 1000) 
                textDistance = this._cacheHash[uuid].result.toFixed(2) + '米';
            else
                textDistance = (this._cacheHash[uuid].result / 1000).toFixed(2) + '公里';
            let pointEntity = this.createPointEntity(this._cacheHash[uuid].positions[this._cacheHash[uuid].positions.length - 1], textDistance);
            this._cacheHash[uuid].entities.push(pointEntity);
            return false;
        }
        // this.getTerrainDistance(cartographic1, cartographic2, uuid);
    }
    // 计算面积
    getAreaMeasure(uuid, pointsCollection) {
        let center_points_collection = []; // 存储用来计算中心点位的数据
        let area_points_collection = []; // 存储用来计算面积的点位数据
        for (let i = 0; i < pointsCollection.length; i++) {
            let transformPosition = this.transform(pointsCollection[i]);
            if((i + 1) !== pointsCollection.length) {
                center_points_collection.push(turf.point([transformPosition.lng, transformPosition.lat]));
            }
            area_points_collection.push([transformPosition.lng, transformPosition.lat]);
        }
        let features = turf.featureCollection(center_points_collection);
        let centerLng = turf.center(features).geometry.coordinates[0];
        let centerLat = turf.center(features).geometry.coordinates[1];
        let centerHeight = this.transform(pointsCollection[0]).alt;
        let areaValue = (turf.area(turf.polygon([area_points_collection])) / 1000000).toFixed(2);
        this._cacheHash[uuid].result = turf.area(turf.polygon([area_points_collection]));
        return {"centerLng": centerLng, "centerLat": centerLat, "centerHeight": centerHeight, "areaValue": areaValue}
    }
    // 计算贴地距离
    getTerrainDistance(cartographic1, cartographic2, uuid) {
        let geodesic = new this._Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(cartographic1, cartographic2);
        let surfaceDistance = geodesic.surfaceDistance;
        let cartoPts = new Array(cartographic1);
        let that = this;
        // 差值取点
        for(let i = 1; i < surfaceDistance; i += 1) {
            // 提供沿测地线的指定距离处的点的位置
            let cartoPt = geodesic.interpolateUsingSurfaceDistance(i);
            cartoPts.push(cartoPt);
        }
        cartoPts.push(cartographic2);
        let promise = this._Cesium.sampleTerrainMostDetailed(this._viewer.terrainProvider, cartoPts);
        this._Cesium.when(promise, function(updatedPositions) {
            for(let i = 0; i < updatedPositions.length - 1; i++) {
                let geoD = new this._Cesium.EllipsoidGeodesic();
                geoD.setEndPoints(updatedPositions[i], updatedPositions[i + 1]);
                let sd = geoD.surfaceDistance;
                let fd = Math.sqrt(Math.pow(sd, 2) + Math.pow(updatedPositions[i + 1].height - updatedPositions[i].height, 2));
                that._cacheHash[uuid].result += Number(fd);
            }
            let textDistance = '';
            if(that._cacheHash[uuid].result <= 1000)
                textDistance = that._cacheHash[uuid].result.toFixed(2) + '米';
            else
                textDistance = (that._cacheHash[uuid].result / 1000).toFixed(2) + '公里';
            let pointEntity = that.createPointEntity(that._cacheHash[uuid].positions[that._cacheHash[uuid].positions.length - 1], textDistance);
            that._cacheHash[uuid].entities.push(pointEntity);
        });
    }
    uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        return uuid;
    }
    // 投影坐标转经纬度
    transform(cartesian) {
        let ellipsoid = this._viewer.scene.globe.ellipsoid;
        let cartesian3 = new this._Cesium.Cartesian3(cartesian.x, cartesian.y, cartesian.z);
        let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
        let lng = Number(this._Cesium.Math.toDegrees(cartographic.longitude));
        let lat = Number(this._Cesium.Math.toDegrees(cartographic.latitude));
        let alt = Number(cartographic.height);
        return {lng: lng, lat: lat, alt: alt}
    }
}