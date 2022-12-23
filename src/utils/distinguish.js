export class Distinguish {
  constructor(Cesium, viewer) {
    this._Cesium = Cesium
    this._viewer = viewer
    // Information about the currently selected feature
    this._selected = {
      feature: undefined,
      originalColor: new Cesium.Color()
    }
    this._stage = null
    this._nameOverlay = null
    this._handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  }
  // 打开识别
  openDistinguish(fn) {
    let viewer = this._viewer
    let selected = this._selected
    this._nameOverlay = this.createNameOverlay()
    // If silhouettes are supported, silhouette features in blue on mouse over and silhouette green on mouse click.
    // If silhouettes are not supported, change the feature color to yellow on mouse over and green on mouse click.
    if (
      this._Cesium.PostProcessStageLibrary.isSilhouetteSupported(viewer.scene)
    ) {
      // 边框高亮
      // Silhouettes are supported

      let silhouetteBlue = this._Cesium.PostProcessStageLibrary.createEdgeDetectionStage()
      silhouetteBlue.uniforms.color = this._Cesium.Color.YELLOW
      silhouetteBlue.uniforms.length = 0.01
      silhouetteBlue.selected = []

      let silhouetteGreen = this._Cesium.PostProcessStageLibrary.createEdgeDetectionStage()
      silhouetteGreen.uniforms.color = this._Cesium.Color.LIME
      silhouetteGreen.uniforms.length = 0.01
      silhouetteGreen.selected = []

      this._stage = this._Cesium.PostProcessStageLibrary.createSilhouetteStage([
        silhouetteBlue,
        silhouetteGreen
      ])
      viewer.scene.postProcessStages.add(this._stage)

      // Silhouette a feature blue on hover.
      this._handler.setInputAction(movement => {
        // If a feature was previously highlighted, undo the highlight
        silhouetteBlue.selected = []
        // Pick a new feature
        let pickedFeature = viewer.scene.pick(movement.endPosition)
        // 识别使用场景多用在gltf、3dtiles三维模型，因此此处判断是否属于其中俩种情况，可自行调整
        if (
          !this._Cesium.defined(pickedFeature) ||
          (!(pickedFeature.primitive instanceof this._Cesium.Cesium3DTileset) &&
            !(pickedFeature.primitive instanceof this._Cesium.Model))
        ) {
          this._nameOverlay.style.display = 'none'
          return
        }
        // A feature was picked, so show it's overlay content
        this.setNameOverlay(
          this._nameOverlay,
          pickedFeature,
          movement.endPosition
        )
        // Highlight the feature if it's not already selected.
        if (pickedFeature !== selected.feature) {
          silhouetteBlue.selected = [pickedFeature]
        }
      }, this._Cesium.ScreenSpaceEventType.MOUSE_MOVE)

      // Silhouette a feature on selection and show metadata in the InfoBox.
      this._handler.setInputAction(movement => {
        // If a feature was previously selected, undo the highlight
        silhouetteGreen.selected = []
        // Pick a new feature
        let pickedFeature = viewer.scene.pick(movement.position)
        if (!this._Cesium.defined(pickedFeature)) {
          this.clickHandler(movement)
          return
        }
        // Select the feature if it's not already selected
        if (silhouetteGreen.selected[0] === pickedFeature) {
          return
        }
        // Save the selected feature's original color
        let highlightedFeature = silhouetteBlue.selected[0]
        if (pickedFeature === highlightedFeature) {
          silhouetteBlue.selected = []
        }
        // Highlight newly selected feature
        silhouetteGreen.selected = [pickedFeature]
        // Set feature infobox description
        let name = pickedFeature.getProperty('name')
        if (!this._Cesium.defined(name)) {
          name = pickedFeature.getProperty('id')
        }
        fn({ feature: pickedFeature, name: name, position: viewer.scene.pickPosition(movement.position) })
      }, this._Cesium.ScreenSpaceEventType.LEFT_CLICK)
    } else {
      // 覆盖高亮（该种高亮形式会存在颜色叠加，导致实际高亮色存在差异）
      // Silhouettes are not supported. Instead, change the feature color.

      // Information about the currently highlighted feature
      let highlighted = {
        feature: undefined,
        originalColor: new this._Cesium.Color()
      }

      // Color a feature yellow on hover.
      this._handler.setInputAction(movement => {
        // If a feature was previously highlighted, undo the highlight
        if (this._Cesium.defined(highlighted.feature)) {
          highlighted.feature.color = highlighted.originalColor
          highlighted.feature = undefined
        }
        // Pick a new feature
        let pickedFeature = viewer.scene.pick(movement.endPosition)
        if (
          !this._Cesium.defined(pickedFeature) ||
          (!(pickedFeature.primitive instanceof this._Cesium.Cesium3DTileset) &&
            !(pickedFeature.primitive instanceof this._Cesium.Model))
        ) {
          this._nameOverlay.style.display = 'none'
          return
        }
        // A feature was picked, so show it's overlay content
        this.setNameOverlay(
          this._nameOverlay,
          pickedFeature,
          movement.endPosition
        )
        // Highlight the feature if it's not already selected.
        if (pickedFeature !== selected.feature) {
          highlighted.feature = pickedFeature
          this._Cesium.Color.clone(
            pickedFeature.color,
            highlighted.originalColor
          )
          pickedFeature.color = this._Cesium.Color.YELLOW
        }
      }, this._Cesium.ScreenSpaceEventType.MOUSE_MOVE)

      // Color a feature on selection and show metadata in the InfoBox.
      this._handler.setInputAction(movement => {
        // If a feature was previously selected, undo the highlight
        if (this._Cesium.defined(selected.feature)) {
          selected.feature.color = selected.originalColor
          selected.feature = undefined
        }
        // Pick a new feature
        let pickedFeature = viewer.scene.pick(movement.position)
        if (!this._Cesium.defined(pickedFeature)) {
          this.clickHandler(movement)
          return
        }
        // Select the feature if it's not already selected
        if (selected.feature === pickedFeature) {
          return
        }
        selected.feature = pickedFeature
        // Save the selected feature's original color
        if (pickedFeature === highlighted.feature) {
          this._Cesium.Color.clone(
            highlighted.originalColor,
            selected.originalColor
          )
          highlighted.feature = undefined
        } else {
          this._Cesium.Color.clone(pickedFeature.color, selected.originalColor)
        }
        // Highlight newly selected feature
        pickedFeature.color = this._Cesium.Color.LIME
        // Set feature infobox description
        let name = pickedFeature.getProperty('name')
        if (!this._Cesium.defined(name)) {
          name = pickedFeature.getProperty('id')
        }
        fn({ feature: pickedFeature, name: name })
      }, this._Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }
  }
  // 关闭识别
  closeDistinguish() {
    this._selected = {
      feature: undefined,
      originalColor: new this._Cesium.Color()
    }
    if (this._stage) {
      this._viewer.scene.postProcessStages.remove(this._stage)
    }
    this._handler.removeInputAction(
      this._Cesium.ScreenSpaceEventType.LEFT_CLICK
    )
    this._handler.removeInputAction(
      this._Cesium.ScreenSpaceEventType.MOUSE_MOVE
    )
    if (this._nameOverlay) {
      this._nameOverlay.remove()
    }
  }
  // Get default left click handler for when a feature is not picked on left click
  clickHandler() {
    this._viewer.screenSpaceEventHandler.getInputAction(
      this._Cesium.ScreenSpaceEventType.LEFT_CLICK
    )
  }
  // 生成悬浮气泡框
  createNameOverlay() {
    let nameOverlay = document.createElement('div')
    this._viewer.container.appendChild(nameOverlay)
    nameOverlay.className = 'backdrop'
    nameOverlay.style.display = 'none'
    nameOverlay.style.position = 'absolute'
    nameOverlay.style.bottom = '0'
    nameOverlay.style.left = '0'
    nameOverlay.style['pointer-events'] = 'none'
    nameOverlay.style.padding = '4px'
    nameOverlay.style.color = 'white'
    nameOverlay.style.backgroundColor = 'black'
    return nameOverlay
  }
  // 设置悬浮气泡框
  setNameOverlay(nameOverlay, pickedFeature, position) {
    let name = pickedFeature.getProperty('name')
    if (!this._Cesium.defined(name)) {
      name = pickedFeature.getProperty('id')
    }
    let regName = this.regTest(name)
    // console.log(pickedFeature.getPropertyNames())
    // console.log(pickedFeature.getProperty("总表面积"))
    // console.log(pickedFeature.getProperty("sid"))
    // console.log(pickedFeature.getProperty("id"))
    // console.log(pickedFeature.getProperty("数据ID"))
    // console.log(pickedFeature.getProperty("name"))
    nameOverlay.style.display = 'block'
    nameOverlay.style.bottom =
      this._viewer.canvas.clientHeight - position.y + 'px'
    nameOverlay.style.left = position.x + 'px'
    nameOverlay.textContent = regName
  }
  // 正则判空
  regTest(value) {
    let reg = new RegExp(/^$/)
    if (!reg.test(value)) {
      return value
    }
    return '未识别到信息'
  }
}
