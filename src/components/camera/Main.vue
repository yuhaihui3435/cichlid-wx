<template>
  <div style="height: 200px;">
    <div class="camera-icon" @click.stop="addImg">
      <span class="cc-icon">&#xe727;</span>
      <input ref="f" type="file" accept="image/*" style="display: none;" @change="onFileChange" multiple>
      <span>点击此处拍照</span>
    </div>
    <ul  class="grid">
      <!-- 这种布局显示小图片和文字 -->
      <li v-for="ia in imgArray" :key="ia.id" :id="ia.id">
        <a @click='previewImage(ia.base64Str)'><img :src="ia.base64Str" v-preview="ia.base64Str" /></a>
        <span class="list-img-close"  @click='delImage(ia.id)' v-show="ia.state==0">&#xe620;</span>
        <x-progress :percent="ia.percent" :show-cancel="false" v-show="ia.state==0" :ref="ia.id+'Xp'" ></x-progress>
      </li>
    </ul>
    <div class="preview"  v-show="isPreview" @click="closePreview">
      <img :src="previewImg">
    </div>

  </div>
</template>

<script>
  import Vue from 'vue'
  import {XProgress } from 'vux'
  import {mapState} from 'vuex'
  import kit from '../../kit'
  import EXIF from 'exif-js'

  const imgMaxUploadCount = 5;
  const imgMasSize = 1024 * 1024 * 5; // 10MB
  const compressSize=100*1024;//超过100K，执行压缩处理

  // 统计img总数 防止重复
  let imgNumber = 0;

  let imgCount=0;

  // 生成唯一的id
  const getUuid = () => {
    return "img-" + new Date().getTime() + "-" + imgNumber++;
  };
  var needsFormDataShim = (function () {
    var bCheck = ~navigator.userAgent.indexOf('Android') &&
      ~navigator.vendor.indexOf('Google') &&
      !~navigator.userAgent.indexOf('Chrome');
    return bCheck && navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534 || /MQQBrowser/g.test(navigator.userAgent);
  })();
  // 重写 Blob 构造函数，在 XMLHttpRequest.prototype.send 中会使用到
  var BlobConstructor = ((function () {
    try {
      new Blob();
      return true;
    } catch (e) {
      return false;
    }
  })()) ? window.Blob : function (parts, opts) {
    let bb = new (
      window.BlobBuilder ||
      window.WebKitBlobBuilder ||
      window.MSBlobBuilder ||
      window.MozBlobBuilder
    );
    parts.forEach(function (p) {
      bb.append(p);
    });
    return bb.getBlob(opts ? opts.type : undefined);
  };

  // 手动包装 FormData 同时重写 XMLHttpRequest.prototype.send
  var FormDataShim = (function () {
    var formDataShimNums = 0;
    return function FormDataShim () {
      var o = this;
      // Data to be sent
      let parts = [];
      // Boundary parameter for separating the multipart values
      let boundary = Array(21).join('-') + (+new Date() * (1e16 * Math.random())).toString(36);
      // Store the current XHR send method so we can safely override it
      let oldSend = XMLHttpRequest.prototype.send;
      this.getParts = function () {
        return parts.toString();
      };
      this.append = function (name, value, filename) {
        parts.push('--' + boundary + '\r\nContent-Disposition: form-data; name="' + name + '"');
        if (value instanceof Blob) {
          parts.push('; filename="' + (filename || 'blob') + '"\r\nContent-Type: ' + value.type + '\r\n\r\n');
          parts.push(value);
        } else {
          parts.push('\r\n\r\n' + value);
        }
        parts.push('\r\n');
      };
      formDataShimNums++;
      XMLHttpRequest.prototype.send = function (val) {
        let fr;
        let data;
        let oXHR = this;
        if (val === o) {
          // Append the final boundary string
          parts.push('--' + boundary + '--\r\n');
          // Create the blob
          data = new BlobConstructor(parts);
          // Set up and read the blob into an array to be sent
          fr = new FileReader();
          fr.onload  = function () {
            oldSend.call(oXHR, fr.result);
          };
          fr.onerror = function (err) {
            throw err;
          };
          fr.readAsArrayBuffer(data);
          // Set the multipart content type and boudary
          this.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
          formDataShimNums--;
          if (formDataShimNums === 0) {
            XMLHttpRequest.prototype.send = oldSend;
          }
        } else {
          oldSend.call(this, val);
        }
      };
    };
  })();



  export default {
    name: 'camera',
    computed: {},
    props:{
      module:'',
      moduleId:''
    },
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
        const vm=this;

        // 获取当前选中的文件
        const files = event.target.files;

        if (this.imgArray.length >= imgMaxUploadCount || files.length > 5) {
          kit.showMsg("每次最多能上传" + imgMaxUploadCount + "张图片")
          return;
        }

        for(let file of files){
          let imgName=file.name;
          if (vm.imgChecked(imgName) > -1) {
            kit.showMsg("该图片已经选择。")
            return;
          }
          vm.checkArray.push(imgName);
        }

        imgCount=(imgCount==0)?files.length:imgCount+files.length;

        // 检查文件类型
        for (let file of files) {
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

          this.fileToDataURL(file, (DataUrl, vm, file) => {
            this.compressDataURL(DataUrl, vm, file)
          });

          if (files.length == 1)
            event.target.value = null;

        }



      },
      /**
       * file 转成 dataURL
       * @param file 文件
       * @param callback 回调函数
       */
      fileToDataURL: function (file, callback) {
        let vm = this
        const reader = new window.FileReader();
        reader.onload = function (e) {
          //console.info(e.target.result);
          callback(e.target.result, vm, file);

        };
        reader.readAsDataURL(file);
      },


      /**
       * 使用 canvas 压缩 dataURL
       * @param dataURL
       * @param ratio
       * @param callback
       */
      compressDataURL: function (dataURL, vm, file) {
        const img = new window.Image();
        img.src = dataURL;
        let orgSize = dataURL.length;
        let uuid = getUuid();
        let imgName = file.name;


        // 图片压缩处理
        img.onload = function () {
          let Orientation = '';
          EXIF.getData(file, function () {
            Orientation = EXIF.getTag(file, 'Orientation');
          });
          console.info('图片方向:' + Orientation);
          //压缩的大小
          var max_width = 1920;
          var max_height = 1080;
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          let cutx = 0;
          let cuty = 0;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > max_width) {
              height = Math.round(height *= max_width / width);
              width = max_width;
            }
          } else {
            if (height > max_height) {
              width = Math.round(width *= max_height / height);
              height = max_height;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, cutx, cuty, width, height,);

          //修复ios上传图片的时候 被旋转的问题
          if (Orientation != "" && Orientation != 1) {
            switch (Orientation) {
              case 6://需要顺时针（向左）90度旋转
                vm.rotateImg(img, 'left', canvas);
                break;
              case 8://需要逆时针（向右）90度旋转
                vm.rotateImg(img, 'right', canvas);
                break;
              case 3://需要180度旋转
                vm.rotateImg(img, 'right', canvas);//转两次
                vm.rotateImg(img, 'right', canvas);
                break;
            }
          }
          let ndata = '';
          if (orgSize <= compressSize) {
            ndata = canvas.toDataURL('image/jpeg', 0.95);
          } else {
            ndata = canvas.toDataURL('image/jpeg', 0.2);
          }

          //console.info("执行了压缩处理，压缩后图片size："+ndata.length+"压缩率为:"+(((orgSize-ndata.length)/orgSize).toFixed(2))*100+"%")
          vm.$data.imgArray.push({id: getUuid(), name: imgName, base64Str: ndata,percent:0,state:0})

        };
      },
      /**
       *
       * 图片旋转，某些系统中可能会出现旋转情况
       *
       * */
      rotateImg: function (img, direction, canvas) {//图片旋转
        var min_step = 0;
        var max_step = 3;
        if (img == null) return;
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
      imgChecked: function (imgName) {
        let vm = this;
        return vm.checkArray.indexOf(imgName);
      },


      /**
       *
       *重置组件数据
       *
       * */
      resetData: function () {

        this.imgArray = [];
        this.checkArray = [];
        imgNumber = 0;
        imgCount=0;
      },


      /**
       * dataURL 转成 blob
       * @param dataURL
       * @return blob
       */
      dataURLtoBlob: function (fd) {

        let dataURL=fd.base64Str;
        console.info(dataURL)
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

        // blob 转file
        //const fileOfBlob = new File([result], fd.name);

        return result
      },
      /**
       *
       * blob 封装成formData
       * 未使用，直接上传的base64 格式数据
       *
       * */
      blobToFormData: function (blob) {
        // 判断是否需要我们之前的重写
        let NFormData = needsFormDataShim ? FormDataShim : window.FormData;
        const oData = new NFormData();
        oData.append('file', blob);
        oData.append('module',this.module);
        oData.append('moduleId',this.moduleId);
        return oData;
      },


      processData:function (fd) {
        //let formData= this.blobToFormData(this.dataURLtoBlob(fd));
        let NFormData = needsFormDataShim ? FormDataShim : window.FormData;
        const oData = new NFormData();
        oData.append('module',this.module);
        oData.append('moduleId',this.moduleId);
        oData.append('base64Str',fd.base64Str);
        if(fd.state==0)
          this.uploadImg(oData,fd);
        else
          return ;
      },

      /**
       * 删除选择的图片
       * @param id  图片id
       */
      delImage: function (id) {
        console.info(id)
        const vm = this;
        this.$vux.confirm.show({
          content: '确定要删除吗?',
          // 组件除show外的属性
          onCancel() {

          },
          onConfirm() {
            let index = 0;
            console.info(vm.imgArray)
            for (let img of vm.imgArray) {
              if (img.id == id) {
                vm.imgArray.splice(index, 1);
                let j = vm.checkArray.indexOf(img['name'])
                vm.checkArray.splice(j, 1)
                break;
              }
              index++;
            }
            imgCount--;
          }
        })
      },
      /**
       *
       * 关闭浏览
       *
       */
      closePreview: function () {
        let vm = this;
        this.isPreview = false;
        this.previewImg = '';
      },
      /**
       * 预览图片
       *
       * @param url 图片base64 url
       */
      previewImage: function (url) {
        let vm = this;
        vm.isPreview = true;
        vm.previewImg = url;
      },

      uploadImg: function (formData,fd) {
        console.info(formData)
        let vm=this;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              // 上传成功，获取到结果 results
              let results = JSON.parse(xhr.responseText);
              fd.state=1;
            }else {
              kit.showMsg("图片上传失败，请重试");
            }
          } else {
            // 上传失败
          }
        }
        xhr.upload.onprogress = function (evt) {

          if (evt.lengthComputable) {
            let percent = Math.round(evt.loaded / evt.total * 100) ;
            fd.percent=percent;

          }
        }

        xhr.open('POST', '/api/wc/uploadPic', true);
        xhr.send(formData);
      },
      submitALL:function () {
        let vm=this;
        if(vm.imgArray.length==0){
          kit.showMsg("请选择图片")
          return ;
        }else if(vm.imgArray.length!=imgCount){
          kit.showMsg("图片转换中，请稍后")
          return
        }else{
          console.info('循环处理结束')
          vm.gen=vm.uploadGenerator(vm.imgArray);
          const firstUpload=vm.gen.next();

          firstUpload.value.map((item)=>{
            vm.processData(item);
          });


        }
      },
      *uploadGenerator (uploadQueue) {
        /**
         * 多张图片并发上传控制规则
         * 上传1-max数量的图片
         * 设置一个最大上传数量
         * 保证最大只有这个数量的上传请求
         *
         */
          // 最多只有三个请求在上传
        const maxUploadSize = this.maxUploadSize;

        if(uploadQueue.length > maxUploadSize){

          const result = [];

          for(let i = 0; i < uploadQueue.length; i++){
            // 第一次return maxUploadSize数量的图片
            if(i < maxUploadSize){
              result.push(uploadQueue[i]);

              if(i === maxUploadSize - 1){
                yield result;
              }
            } else {
              yield [uploadQueue[i]];
            }
          }

        } else {
          yield uploadQueue.map((item)=>(item));
        }
      }
    },
    directives: {},
    components: {XProgress, },
    data() {
      return {
        imgArray:[],//图片信息
        checkArray:[],//图片是否选择检查临时变量
        layout:'grid',
        isPreview:false,
        previewImg:'',
        maxUploadSize:3,
        gen:'',
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
