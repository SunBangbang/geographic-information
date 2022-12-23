export function Inspection(Cesium, viewer) {
    var _patrolEntity = null;
    var Cesium = Cesium;
    var viewer = viewer;
    var camera = viewer.camera;
    this._defaultOptions = {
        'modelUrl': '../../static/model/car/TM.gltf',
        'speed': 10,
        'points': []
    }
    this.interval = null;
    // 初始化
    this.init = function (options) {
        this.end();
        var _options = Object.assign(this._defaultOptions, options);
        var len = _options.points.length;
        var time = 1000;
        var tempTime = time - time % len;
        var increment = tempTime / len;
        var start = Cesium.JulianDate.fromDate(new Date());
        var stop = Cesium.JulianDate.addSeconds(start, tempTime, new Cesium.JulianDate());
        viewer.clock.startTime = start.clone();
        viewer.clock.stopTime = stop.clone();
        viewer.clock.currentTime = start.clone();
        viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
        // 时间变化来控制速度
        // viewer.clock.multiplier = 10;
        viewer.clock.multiplier = options.speed ? options.speed : 10;
        viewer.clock.shouldAnimate = false;
        _patrolEntity = viewer.entities.add({
            id: 'patrol',
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                start: start,
                stop: stop
            })]),
            /**
             * orientation 姿态：
             * 若以正北为参照
             * Heading: 初始方向为正北，正角度为向东旋转，即水平旋转，也叫偏航角
             * Pitch: 正角度为平面之上，负角度为平面之下，即前后旋转，也叫俯仰角
             * Roll: 左右旋转，也叫翻滚角
             *
             * position 位置
             * */
            position: this.computeCirclularFlight(_options.points, increment, start),
            orientation: new Cesium.VelocityOrientationProperty(this.computeCirclularFlight(_options.points, increment, start)), // 姿态调整
            model: {
                uri: _options.modelUrl
            },
            path: {
                resolution: 1,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.1,
                    // color: Cesium.Color.fromCssColorString('#ffffff')
                }),
                width: 20
            }
        });
        // 相机位置
        camera.position = new Cesium.Cartesian3(-30, 0.0, 10.0);
        // 相机方向
        camera.direction = new Cesium.Cartesian3(1.0, 0.0, -0.30);
        camera.up = new Cesium.Cartesian3(0.0, 0.0, 1.0);
        /**
         * 监听场景渲染刷新
         * scene：场景
         * time：当前时间轴时间
         * */
        viewer.scene.postUpdate.removeEventListener(this.cameraLookAt);
        viewer.scene.postUpdate.addEventListener(this.cameraLookAt);
        // this.interval = setInterval(function() {
        //     // 相机位置
        //     camera.position = new Cesium.Cartesian3(-30, 0.0, 10.0);
        //     // 相机方向
        //     camera.direction = new Cesium.Cartesian3(1.0, 0.0, -0.30);
        //     camera.up = new Cesium.Cartesian3(0.0, 0.0, 1.0);
        // }, 5000);
        return this;
    }
    // 开始
    this.start = function () {
        viewer.clock.shouldAnimate = true;
    }
    // 暂停
    this.stop = function () {
        viewer.clock.shouldAnimate = false;
    }
    // 速度设置
    this.speed = function (speed) {
        viewer.clock.multiplier = speed;
    }
    // 结束巡视
    this.end = function () {
        viewer.clock.shouldAnimate = false;
        viewer.clock.multiplier = 1;
        viewer.scene.postUpdate.removeEventListener(this.cameraLookAt);
        if (viewer.entities.getById('patrol')) {
            viewer.entities.remove(viewer.entities.getById('patrol'));
        }
        if(this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    }
    this.computeCirclularFlight = function (marks, increment, start) {
        /**
         * 关于position有多种类型，如SampledPositionProperty类型，是一个含有多个样本点位置的对象，
         * 主要用于动态轨迹生成，通过插值算法对轨迹进行插值，其中setInterpolationOptions方法用来设
         * 置插值方法与程度,它的某一时间的位置可以用position.getValue()方法获得，参数是朱利安时间
         * */
        var property = new Cesium.SampledPositionProperty();
        // 差值算法调整，可使线路以及视角圆滑，但会造成线路偏差
        // property.setInterpolationOptions({
        //     interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
        //     interpolationDegree: 5
        // });
        // var timeIncerment;
        marks.forEach(function (item, index) {
            // timeIncerment = index * totalTime_Span / (totalPt_Count - 1);
            var time = Cesium.JulianDate.addSeconds(start, index * increment, new Cesium.JulianDate());
            // let position = Cesium.Cartesian3.fromDegrees(item.xaxis, item.yaxis, item.zaxis + 10);
            var position = Cesium.Cartesian3.fromDegrees(item.lon, item.lat, item.height);
            property.addSample(time, position);
        });
        return property;
    }
    this.cameraLookAt = function (scene, time) {
        if (_patrolEntity) {
            var position = _patrolEntity.position.getValue(time);
            // console.log(curPatrolPoint);
            // changemark([point[0], point[1]]);
            // 判断是否定义了对象
            // return;
            if (!Cesium.defined(position)) {
                return;
            }
            var transform;
            // 判断entity是否存在姿态
            if (!Cesium.defined(_patrolEntity.orientation)) {
                // console.log(position);
                transform = Cesium.Transforms.eastNorthUpToFixedFrame(position);
            } else {
                var orientation = _patrolEntity.orientation.getValue(time);
                if (!Cesium.defined(orientation)) {
                    return;
                }
                transform = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation), position);
            }
            // Save camera state
            var offset = Cesium.Cartesian3.clone(camera.position);
            // console.log(camera.position);
            // console.log('offset:' + offset);
            var direction = Cesium.Cartesian3.clone(camera.direction);
            var up = Cesium.Cartesian3.clone(camera.up);
            // Set camera to be in model's reference frame.
            camera.lookAtTransform(transform);
            // Reset the camera state to the saved state so it appears fixed in the model's frame.
            Cesium.Cartesian3.clone(offset, camera.position);
            Cesium.Cartesian3.clone(direction, camera.direction);
            Cesium.Cartesian3.clone(up, camera.up);
            Cesium.Cartesian3.cross(direction, up, camera.right);
        }
    }
}