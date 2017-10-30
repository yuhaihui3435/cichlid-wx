<template>
  <div style="height: 200px;">
    <div class="camera-icon" @click.stop="addImg">
      <span class="cc-icon">&#xe727;</span>
      <input ref="f" type="file" accept="image/*" style="display: none;" @change="onFileChange" multiple>
      <span>点击此处拍照</span>
    </div>
    <ul  class="grid">
      <!-- 这种布局显示小图片和文字 -->
      <li v-for="ia in imgArray" :key="ia.id">
        <a @click='previewImage(ia.base64Str)'><img :src="ia.base64Str" v-preview="ia.base64Str" /></a>
        <span class="list-img-close"  @click='delImage(ia.id)'>&#xe620;</span>
      </li>
    </ul>
    <div class="preview"  v-show="isPreview" @click="closePreview">
      <img :src="previewImg">
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Grid,GridItem } from 'vux'
  import {mapState} from 'vuex'
  import kit from '../../kit'
  import EXIF from 'exif-js'

  const imgMaxUploadCount = 5;
  const imgMasSize = 1024 * 1024 * 5; // 10MB
  const compressSize=100*1024;//超过100K，执行压缩处理

  // 统计img总数 防止重复
  let imgNumber = 0;

  // 生成唯一的id
  const getUuid = () => {
    return "img-" + new Date().getTime() + "-" + imgNumber++;
  };
  export default {
    name: 'camera',
    computed: {},
    mounted: function () {

    },
    methods: {

      addImg: function (e) {
        this.$refs.f.click();//打开照相机
        return false;
      },
      /**
       *
       * 响应图片选择事件
       * */
      onFileChange: function (event) {

        // 获取当前选中的文件
        const files = event.target.files;

        if(this.imgArray.length>=imgMaxUploadCount||files.length>5){
          kit.showMsg("每次最多能上传"+imgMaxUploadCount+"张图片")
          return ;
        }

        // 检查文件类型
        for (var file of files) {
          if (['jpeg', 'png', 'gif', 'jpg'].indexOf(file.type.split("/")[1]) < 0) {
            // 自定义报错方式
            kit.showMsg('请不要上传非图片文件');
            return;
          }
          if (file.size > imgMasSize) {
            // 文件大小自定义限制

            kit.showMsg('单个文件大小不能大于' + ((parseInt(imgMasSize) / (1024 * 1024)).toFixed(2)) * 1000 + "KB");
            return;
          }

          this.fileToDataURL(file,(DataUrl,vm,file)=>{
              this.compressDataURL(DataUrl,vm,file)
          });

          if(files.length==1)
          event.target.value=null;

        }
        //console.info("通过检查，继续执行")
      },

      /**
       * file 转成 dataURL
       * @param file 文件
       * @param callback 回调函数
       */
      fileToDataURL: function (file, callback) {
        let vm=this
        const reader = new window.FileReader();
        reader.onload = function (e) {
          //console.info(e.target.result);
           callback(e.target.result,vm,file);

        };
        reader.readAsDataURL(file);
      },


      /**
       * 使用 canvas 压缩 dataURL
       * @param dataURL
       * @param ratio
       * @param callback
       */
      compressDataURL: function (dataURL,vm,file) {
        const img = new window.Image();
        img.src = dataURL;
        let orgSize=dataURL.length;
        let uuid=getUuid();
        let imgName=file.name;
        //console.info(imgName);
        //console.info("压缩前图片的size:"+orgSize);
        if(vm.imgChecked(imgName)>-1) {
          kit.showMsg("该图片已经选择。")
          return ;
        }
        vm.checkArray.push(imgName);

        // 图片压缩处理
        img.onload = function () {
          let Orientation='';
          EXIF.getData(file, function(){
            Orientation = EXIF.getTag(file, 'Orientation');
          });
          console.info('图片方向:'+Orientation);
          //压缩的大小
          var max_width = 1920;
          var max_height = 1080;
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          let cutx = 0;
          let cuty = 0;
          let width = img.width;
          let height = img.height;
          if(width > height) {
            if(width > max_width) {
              height = Math.round(height *= max_width / width);
              width = max_width;
            }
          }else{
            if(height > max_height) {
              width = Math.round(width *= max_height / height);
              height = max_height;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, cutx, cuty, width, height,);

          //修复ios上传图片的时候 被旋转的问题
          if(Orientation != "" && Orientation != 1){
            switch(Orientation){
              case 6://需要顺时针（向左）90度旋转
                vm.rotateImg(img,'left',canvas);
                break;
              case 8://需要逆时针（向右）90度旋转
                vm.rotateImg(img,'right',canvas);
                break;
              case 3://需要180度旋转
                vm.rotateImg(img,'right',canvas);//转两次
                vm.rotateImg(img,'right',canvas);
                break;
            }
          }
          let ndata='';
          if(orgSize<=compressSize) {
            ndata = canvas.toDataURL('image/jpeg', 0.95);
          }else{
            ndata = canvas.toDataURL('image/jpeg', 0.2);
          }

          //console.info("执行了压缩处理，压缩后图片size："+ndata.length+"压缩率为:"+(((orgSize-ndata.length)/orgSize).toFixed(2))*100+"%")
          vm.$data.imgArray.push({id:getUuid(),name:imgName,base64Str:ndata})
        };
      },
      /**
       *
       * 图片旋转，某些系统中可能会出现旋转情况
       *
       * */
      rotateImg:function (img, direction,canvas) {//图片旋转
        var min_step = 0;
        var max_step = 3;
        if (img == null)return;
        var height = img.height;
        var width = img.width;
        var step = 2;
        if (step == null) {
          step = min_step;
        }
        if (direction == 'right') {
          step++;
          step > max_step && (step = min_step);
        } else {
          step--;
          step < min_step && (step = max_step);
        }
        var degree = step * 90 * Math.PI / 180;
        var ctx = canvas.getContext('2d');
        switch (step) {
          case 0:
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            break;
          case 1:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, 0, -height);
            break;
          case 2:
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, -height);
            break;
          case 3:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, 0);
            break;
        }
      },

      /**
       *
       * 图片重复选择检查
       *
       * */
      imgChecked:function (imgName) {
        let vm=this;
        return vm.checkArray.indexOf(imgName);
      },


      /**
       *
       *重置组件数据
       *
       * */
      resetData:function () {

        this.imgArray=[];
        this.checkArray=[];
        imgNumber=0;
      },


      /**
       * dataURL 转成 blob
       * @param dataURL
       * @return blob
       */
      dataURLtoBlob: function (dataURL) {
        let binaryString = atob(dataURL.split(',')[1]);
        let arrayBuffer = new ArrayBuffer(binaryString.length);
        let intArray = new Uint8Array(arrayBuffer);
        let mime = dataURL.split(',')[0].match(/:(.*?);/)[1]
        for (let i = 0, j = binaryString.length; i < j; i++) {
          intArray[i] = binaryString.charCodeAt(i);
        }
        let data = [intArray];
        let result;
        try {
          result = new Blob(data, {type: mime});
        } catch (error) {
          window.BlobBuilder = window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder;
          if (error.name === 'TypeError' && window.BlobBuilder) {
            var builder = new BlobBuilder();
            builder.append(arrayBuffer);
            result = builder.getBlob(type);
          } else {
            kit.showMsg("您的手机版本过低，无法完成此操作")
            throw new Error('没救了');
          }
        }
        return result;
      },


      /**
       * 删除选择的图片
       * @param id  图片id
       */
      delImage:function (id) {
        console.info(id)
        const vm=this;
        this.$vux.confirm.show({
          content:'确定要删除吗?',
          // 组件除show外的属性
          onCancel () {

          },
          onConfirm () {
            let index=0;
            console.info(vm.imgArray)
            for(let img of vm.imgArray){
               if(img.id==id){
                 vm.imgArray.splice(index,1);
                 let j=vm.checkArray.indexOf(img['name'])
                 vm.checkArray.splice(j,1)
                 break;
               }
                index++;
            }
          }
        })
      },
      /**
       *
       * 关闭浏览
       *
       */
      closePreview :function () {
        let vm = this;
        this.isPreview=false;
        this.previewImg='';
      },
      /**
       * 预览图片
       *
       * @param url 图片base64 url
       */
      previewImage: function(url){
        let vm = this;
        vm.isPreview = true;
        vm.previewImg = url;
      },

    },
    directives: {},
    components: {Grid,GridItem, },
    data() {
      return {
        imgArray:[],//图片xinxi
        checkArray:[],//图片是否选择检查临时变量
        layout:'grid',
        isPreview:false,
        previewImg:'',
      }
    }
  }
</script>

<style>
  @import '../style.css';

  .camera-icon {
    width: 100%;
    height: 100px;
    text-align: center;
    display: block;
    background-color: white;
  }


  /*-------------------------
        网格布局
    --------------------------*/

  ul.grid{
    list-style: none;
    width: 100%;
    margin: 20px auto;
    text-align: left;

  }

  ul.grid li{
    padding: 1px;
    float:left;
    /*cursor: pointer;*/
    border:  1px solid #DDE6E8;
    box-sizing: border-box;
    width: 33.3%;
  }

  ul.grid li img{
    width:100%;
    height:120px;
    object-fit: cover;
    display:block;
    border:none;
    padding: 2px;
    box-sizing: border-box;
  }
  .list-img-close {
    font-family: 'iconfont';
    font-size:20px;
    display: block;
    /*top: 10px;*/
    /*right: -10px;*/
    position: relative;
    color: red;
    line-height: 20px;
    text-align: center;
    padding: 1px;
  }
  .preview {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0px;
    bottom: 0px;
    z-index: 0;
    overflow:hidden; word-break:break-all; }
</style>
