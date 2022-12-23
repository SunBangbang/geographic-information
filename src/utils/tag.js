export class Tag {  
    constructor(Cesium, viewer, dom) {
      this._Cesium = Cesium;
      this._viewer = viewer;
      this._dom = dom;
      this._tagHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      this._tagPickHandler = new Cesium.ScreenSpaceEventHandler(
        viewer.scene.canvas
      );
      this._pickedFeature = null;
      this._tagFlag = false;
      this._fn = null;
      this._anonymous = null;
      this._popupPosition = null;
      this._popupDom = null;
      this._codeArr = []; // 存放已保存的标记点
      this.tagPickClick();
    }
    // 设置操作的回调函数
    callBackFn(fn) {
      this._fn = fn;
    }
    // 添加已保存的标记点code
    insertCode(code) {
      if(this._codeArr.indexOf(code) > -1)
      return false;
      else this._codeArr.push(code);
      return true;
    }
    // 删除已保存的标记点code
    removeCode(code) {
      this._codeArr.forEach((item, index) => {
        if (item === code) {
          this._codeArr.splice(index, 1);
        }
      });
    }
    // 创建已有标记点
    createEntities(point) {
      if(this.insertCode(point.code)) {
        this._viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(point.lng, point.lat, point.height),
          name: "tag_entity",
          code: point.code,
          properties: {
            save: false,
            name: point.name,
            content: point.content,
            lng: point.lng,
            lat: point.lat,
            height: point.height
          },
          billboard: {
            width: 20, // default: undefined
            height: 20, // default: undefined
            pixelOffset: new Cesium.Cartesian2(0, -7),
            image: this.imgBase64(2),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          label: {
            text: point.name,
            font: "14px 黑体",
            fillColor: Cesium.Color.WHITE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM, //垂直位置
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT, //水平位置
            pixelOffset: new Cesium.Cartesian2(10, 0), //偏移
            showBackground: true,
            backgroundColor: Cesium.Color.BLACK.withAlpha(0.45),
            // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
        });
      }
    }
  
    tagging() {
      let that = this;
      let Cesium = this._Cesium;
      let viewer = this._viewer;
      document.getElementById(this._dom).style.cursor = 'url(../../img/ico/mark.ico),auto';
      // this._fn = fn;
      this._tagFlag = true;
      this._tagHandler.setInputAction((evt) => {
        let point = that.transform(evt.position);
        let tagCode = "tag_" + new Date().getTime();
        let tagEntity = viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(point.lng, point.lat, point.height),
          name: "tag_entity",
          code: tagCode,
          properties: {
            save: false,
            name: "",
            content: "",
            lng: point.lng,
            lat: point.lat,
            height: point.height
          },
          billboard: {
            width: 20, // default: undefined
            height: 20, // default: undefined
            pixelOffset: new Cesium.Cartesian2(0, -7),
            image: that.imgBase64(2),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          label: {
            text: "我的标记",
            font: "14px 黑体",
            fillColor: Cesium.Color.WHITE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM, //垂直位置
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT, //水平位置
            pixelOffset: new Cesium.Cartesian2(10, 0), //偏移
            showBackground: true,
            backgroundColor: Cesium.Color.BLACK.withAlpha(0.45),
            // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            //   0,
            //   10000
            // ),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
        });
        that._pickedFeature = tagEntity;
        document.getElementById(this._dom).style.cursor = 'default';
        this._fn({
          status: 201,
          msg: "绘制成功",
          data: { code: that._pickedFeature._code },
        });
        that._tagHandler.removeInputAction(
          Cesium.ScreenSpaceEventType.LEFT_CLICK
        );
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    stopTagging() {
      this._tagFlag = false;
      document.getElementById(this._dom).style.cursor = 'default';
      this._tagHandler.removeInputAction(
        this._Cesium.ScreenSpaceEventType.LEFT_CLICK
      );
    }
  
    tagPickClick() {
      let that = this;
      let Cesium = this._Cesium;
      let viewer = this._viewer;
      this._tagPickHandler.setInputAction((evt) => {
        that.removePopup();
        if (that._tagFlag) {
          that._tagFlag = false;
          if(!Cesium.defined(that._pickedFeature)) return false;
          that._popupPosition = that._pickedFeature.position._value;
          that.createPopup(
            that._pickedFeature.properties.name,
            that._pickedFeature.properties.content,
            that._fn
          );
          this.updatePosition();
        } else if (
          Cesium.defined(viewer.scene.pick(evt.position)) &&
          viewer.scene.pick(evt.position).id &&
          viewer.scene.pick(evt.position).id._name &&
          viewer.scene.pick(evt.position).id._name === "tag_entity"
        ) {
          that._pickedFeature = viewer.scene.pick(evt.position).id;
          that._popupPosition = that._pickedFeature.position._value;
          that.createPopup(
            that._pickedFeature.properties.name,
            that._pickedFeature.properties.content,
            that._fn
          );
          this.updatePosition();
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
  
    popupControl(fn) {
      let that = this;
      let viewer = this._viewer;
      let saveBtn = document.getElementById("tag-popup-save");
      let deleteBtn = document.getElementById("tag-popup-delete");
      // let cancelBtn = document.getElementById('tag-popup-cancel');
      let closeSvg = document.getElementById("tag-popup-close");
      let nameInput = document.getElementById("tag-popup-name");
      let contentInput = document.getElementById("tag-popup-content");
      // cancelBtn.onclick = () => {
      //     that._pickedFeature.properties.name = nameInput.value;
      //     that._pickedFeature.properties.content = contentInput.value;
      //     that.removePopup();
      //     that._pickedFeature = null;
      // }
      closeSvg.onclick = () => {
        let reg = new RegExp(/^$/);
        if (!reg.test(nameInput.value)) {
          that._pickedFeature.label.text = nameInput.value;
        } else {
          that._pickedFeature.label.text = "我的标记";
        }
        that._pickedFeature.properties.name = nameInput.value;
        that._pickedFeature.properties.content = contentInput.value;
        that.removePopup();
        that._pickedFeature = null;
      };
      deleteBtn.onclick = () => {
        that.removePopup();
        if (this._codeArr.indexOf(that._pickedFeature._code) > -1) {
          fn({
            status: 100,
            msg: "删除成功",
            data: { code: that._pickedFeature._code },
          });
        }
        viewer.entities.remove(that._pickedFeature);
        that._pickedFeature = null;
      };
      saveBtn.onclick = () => {
        if (nameInput.value.replace(/\s+/g, "") != "") {
          that._pickedFeature.label.text = nameInput.value;
          that._pickedFeature.properties.name = nameInput.value;
          that._pickedFeature.properties.content = contentInput.value;
          let cartographic = this.cartesianToCartographic(
            that._pickedFeature.position._value
          );
          if (this._codeArr.indexOf(that._pickedFeature._code) > -1)
            fn({
              status: 205,
              msg: "编辑成功",
              data: {
                code: that._pickedFeature._code,
                name: nameInput.value,
                content: contentInput.value,
                lng: cartographic.lng,
                lat: cartographic.lat,
                height: cartographic.height,
              },
            });
          else
            fn({
              status: 200,
              msg: "保存成功",
              data: {
                code: that._pickedFeature._code,
                name: nameInput.value,
                content: contentInput.value,
                lng: cartographic.lng,
                lat: cartographic.lat,
                height: cartographic.height,
              },
            });
          that.removePopup();
          that._pickedFeature = null;
        }
      };
    }
  
    createPopup(name, content, fn) {
      let popupDom = document.createElement("div");
      popupDom.setAttribute("id", "tag-popup");
      popupDom.style.position = "absolute";
      popupDom.style.zIndex = "900";
      popupDom.style.width = "300px";
      popupDom.style.border = "1px solid rgb(153, 153, 153)";
      popupDom.style.backgroundColor = "rgb(255, 255, 255)";
      // popupDom.style.height = '80px';
      let popupTitle = document.createElement("div");
      popupTitle.setAttribute("id", "tag-popup-title");
      popupTitle.innerText = "添加标记";
      popupTitle.style.height = "30px";
      popupTitle.style.lineHeight = "30px";
      popupTitle.style.paddingLeft = "10px";
      popupTitle.style.fontSize = "14PX";
      popupTitle.style.fontWeight = "bold";
      popupTitle.style.color = "#4d4d4d";
      popupTitle.style.backgroundColor = "rgb(249, 249, 249)";
      let closeSvg = this.makeSVG("svg");
      closeSvg.setAttribute("id", "tag-popup-close");
      closeSvg.style.width = "10px";
      closeSvg.style.height = "10px";
      closeSvg.style.position = "absolute";
      closeSvg.style.top = "10px";
      closeSvg.style.right = "10px";
      let polygon = this.makeSVG("polygon", {
        points: "10,0 0,10",
        fill: "lime",
        stroke: "#ccc",
        "stroke-width": "2",
        "fill-rule": "nonzero",
      });
      let polygon1 = this.makeSVG("polygon", {
        points: "0,0 10,10",
        fill: "lime",
        stroke: "#ccc",
        "stroke-width": "2",
        "fill-rule": "nonzero",
      });
      let popupContent = document.createElement("div");
      popupContent.setAttribute("id", "tag-popup-content-box");
      popupContent.style.padding = "7px 10px 0 10px";
      let imgBase64 = document.createElement("img");
      imgBase64.setAttribute("src", this.imgBase64(1));
      imgBase64.style.position = "absolute";
      imgBase64.style.bottom = "-31px";
      imgBase64.style.left = "120px";
      let nameBox = document.createElement("div");
      nameBox.style.display = "flex";
      nameBox.style.alignItems = "center";
      nameBox.style.marginBottom = "10px";
      let nameLabel = document.createElement("span");
      nameLabel.style.flex = "none";
      nameLabel.style.width = "30px";
      nameLabel.style.fontSize = "12px";
      nameLabel.innerText = "名称";
      let nameInput = document.createElement("input");
      nameInput.value = name;
      nameInput.style.flex = "1";
      nameInput.style.height = "25px";
      nameInput.style.border = "1px solid rgb(181, 181, 181)";
      nameInput.setAttribute("id", "tag-popup-name");
      let contentBox = document.createElement("div");
      contentBox.style.display = "flex";
      contentBox.style.alignItems = "flex-start";
      let contentLabel = document.createElement("span");
      contentLabel.style.flex = "none";
      contentLabel.style.width = "30px";
      contentLabel.style.fontSize = "12px";
      contentLabel.innerText = "备注";
      let contentInput = document.createElement("textarea");
      contentInput.value = content;
      contentInput.style.flex = "1";
      contentInput.style.height = "72px";
      contentInput.style.padding = "2px";
      contentInput.style.border = "1px solid rgb(181, 181, 181)";
      contentInput.setAttribute("id", "tag-popup-content");
      let btnDom = document.createElement("div");
      btnDom.style.height = "40px";
      btnDom.style.padding = "5px 10px";
      btnDom.style.textAlign = "right";
      let saveBtn = document.createElement("button");
      saveBtn.innerText = "保存";
      saveBtn.style.marginRight = "5px";
      saveBtn.setAttribute("id", "tag-popup-save");
      let deleteBtn = document.createElement("button");
      deleteBtn.innerText = "删除";
      deleteBtn.setAttribute("id", "tag-popup-delete");
      // let cancelBtn = document.createElement('button');
      // cancelBtn.innerText = '取消';
      // cancelBtn.setAttribute('id', 'tag-popup-cancel');
      nameBox.appendChild(nameLabel);
      nameBox.appendChild(nameInput);
      popupContent.appendChild(nameBox);
      contentBox.appendChild(contentLabel);
      contentBox.appendChild(contentInput);
      popupContent.appendChild(contentBox);
      btnDom.appendChild(saveBtn);
      btnDom.appendChild(deleteBtn);
      // btnDom.appendChild(cancelBtn);
      closeSvg.appendChild(polygon);
      closeSvg.appendChild(polygon1);
      popupTitle.appendChild(closeSvg);
      popupDom.appendChild(popupTitle);
      popupDom.appendChild(popupContent);
      popupDom.appendChild(btnDom);
      popupDom.appendChild(imgBase64);
      document.getElementById(this._dom).appendChild(popupDom);
      this._popupDom = popupDom;
      this.popupControl(fn);
    }
  
    removePopup() {
      if (!this._popupDom) return;
      document.getElementById(this._dom).removeChild(this._popupDom);
      this._popupDom = null;
      this.stopUpdatePosition();
    }
  
    updatePosition() {
      this._anonymous = () => {
        if (!this._popupDom || !this._popupPosition) return;
        let Cesium = this._Cesium;
        let viewer = this._viewer;
        let popupPosition = this._popupPosition;
        let cameraPosition = viewer.camera.position;
        let height = viewer.scene.globe.ellipsoid.cartesianToCartographic(
          cameraPosition
        ).height;
        let mp_position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          viewer.scene,
          popupPosition
        );
        let flag = false;
        if (
          !((height += 1 * viewer.scene.globe.ellipsoid.maximumRadius),
          Cesium.Cartesian3.distance(cameraPosition, popupPosition) > height)
        ) {
          flag = true;
        }
        if (flag) {
          this._popupDom.style.left = mp_position.x - 120 + "px";
          this._popupDom.style.top = mp_position.y - 230 + "px";
        } else {
          // Tag._popupDom.remove()
        }
      };
      this._viewer.scene.postRender.addEventListener(this._anonymous);
    }
  
    stopUpdatePosition() {
      this._viewer.scene.postRender.removeEventListener(this._anonymous);
      this._anonymous = null;
    }
  
    transform(position) {
      //得到当前三维场景
      let Cesium = this._Cesium;
      let viewer = this._viewer;
      let scene = viewer.scene;
       //得到当前三维场景的椭球体
       let ellipsoid = scene.globe.ellipsoid;
      let pickedFeature = viewer.scene.pick(position);
      let cartesian = null;
      // 判断点击位置是否存在倾斜、模型
      if(pickedFeature && pickedFeature.primitive && (pickedFeature.primitive instanceof Cesium.Cesium3DTileset || pickedFeature.primitive instanceof Cesium.Model)) {
        cartesian = viewer.scene.pickPosition(position);
      } else {
        let ray = viewer.camera.getPickRay(position);
        cartesian = viewer.scene.globe.pick(ray, scene);
      }
     
      // let cartesian = viewer.scene.pickPosition(point);
      // let cartesian = viewer.camera.pickEllipsoid(position);
      if (cartesian != undefined) {
        let cartographic = ellipsoid.cartesianToCartographic(cartesian);
        let lng = Number(Cesium.Math.toDegrees(cartographic.longitude).toFixed(7));
        let lat = Number(Cesium.Math.toDegrees(cartographic.latitude).toFixed(7));
        //地理高度
        let height = Number(cartographic.height.toFixed(2));
        return { lng: lng, lat: lat, height: height };
      }
    }
  
    cartesianToCartographic(cartesian3) {
      let Cesium = this._Cesium;
      let viewer = this._viewer;
      let ellipsoid = viewer.scene.globe.ellipsoid;
      // let cartesian3 = Cesium.cartesian3(cartesian.x,cartesian.y,cartesian.z);
      let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
      let lat = Cesium.Math.toDegrees(cartographic.latitude);
      let lng = Cesium.Math.toDegrees(cartographic.longitude);
      let height = cartographic.height;
      return { lng: lng, lat: lat, height: height };
    }
  
    makeSVG(tag, attrs) {
      const ns = "http://www.w3.org/2000/svg";
      const xlinkns = "http://www.w3.org/1999/xlink";
  
      let el = document.createElementNS(ns, tag);
      if (tag === "svg") {
        el.setAttribute("xmlns:xlink", xlinkns);
      }
      for (let k in attrs) {
        if (k === "xlink:href") {
          el.setAttributeNS(xlinkns, k, attrs[k]);
        } else {
          el.setAttribute(k, attrs[k]);
        }
      }
      return el;
    }
  
    imgBase64(type) {
      let img = null;
      if (type === 1) {
        // 弹框角
        img = `
                      data:image/png;base64,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
                  `;
      } else {
        // 标记图片
        img = `
                      data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAgCAYAAAB3j6rJAAACF0lEQVRYR+2WP2gUQRTGv7e6k4CVpFCEGw71sqvBShCxSsBKsBAUYucfYimktkgCWthpK5HYKULEQrCwsYughWhOb1NIbgxoYxpJ4Obu5oWVCyxRd2Zumituq4V5832/+d7wdgkD8tCAcKAvkEyKOQZqRDjOjBqYuwDqRNEas3mXfm8v+R7QG6Qh44cA3S4zIsKzpKmv+sB4gWQy/smgQ44Gm6nSY4617q3JpFhlYALAetfw9AiiX52I3wCo/s+MgCeJ0tddYJwSaVRGFkF8syf4PlX6TP6eSbHEwLXyNvFM0mwv2mCsIPXqgcP7TPtHQWgLwEsCbTH4ls0AwGqq9ClbnRXkSzU+GxlasQmVrY/S/iPV5nbxMH+VW0GyiphmwtMQkAh0cVy1XpW20GbQmxnztjqLyXyi9EIQSEOKKwCeB4EQXUiarddBIF9lfJpAH0JAukaPTWxgMwjkk8RBAVEqYoFcSZU+ZzuI9bLmAo2KuAPCXZvYv9bZmKkTG523tr1OIH+GV0W8YMIlm2Bx3YBmT6rWA5c9ziC9ZB6DcMNFGMByqvRlx1r3b82uYCbjGQY9KjH4DeBeqvR9V4i8ziuRXeE1OXrecLdGwDGAjjKhQ0Ad4G8U4fP4evujD0TfIAWTOQD5sMsv45SvebG+r0SGICWRD1uzN5xhIgObyGSBzPphC/oNCBlSPntDB5qPV2ntEGRvPDvvC54hXrqGvgAAAABJRU5ErkJggg==
                  `;
      }
      return img;
    }
  }
  