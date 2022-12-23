<template>
    <div>
        <h1>富文本编辑器</h1>
        <div id="wangeditor"></div>
    </div>
</template>

<script>
import wangEditor from 'wangeditor'
export default {
    data() {
        return {
            editor: null,
            editorData: ''
        }
    },
    beforeDestroy() {
        // 调用销毁 API 对当前编辑器实例进行销毁
        this.editor.destroy()
        this.editor = null
    },
    mounted() {
        const editor = new wangEditor(`#wangeditor`)
        // https://www.wangeditor.com/doc/pages/07-%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87/01-%E9%85%8D%E7%BD%AE%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%8E%A5%E5%8F%A3.html
        // 配置 onchange 回调函数，将数据同步到 vue 中
        editor.config.onchange = (newHtml) => {
            this.editorData = newHtml
        }
        editor.config.customUploadImg = function (resultFiles, insertImgFn) {
            // resultFiles 是 input 中选中的文件列表
            // insertImgFn 是获取图片 url 后，插入到编辑器的方法
            editor.ediotrFile(resultFiles).then(res=> {

            });
            // 上传图片，返回结果，将图片插入到编辑器中
            insertImgFn(imgUrl)
        }
        // 创建编辑器
        editor.create()

        this.editor = editor
    },
    methods: {
        getEditorData() {
            // 通过代码获取编辑器内容
            let data = this.editor.txt.html()
            alert(data)
        }
    }
}
</script>