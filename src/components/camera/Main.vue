<template>
  <div style="height: 200px;">
    <div class="camera-icon" @click.stop="addImg">
      <span class="cc-icon">&#xe727;</span>
      <input ref="f" type="file" accept="image/*" style="display: none;" @change="onFileChange" multiple>
      <span>点击此处拍照</span>
    </div>
    <ul  class="grid">
      <!-- 这种布局显示小图片和文字 -->
      <li v-for="a in imgArray" :key="a.id">
        <a><img :src="a.base64Str" /></a>
        <span class="list-img-close" @click='delImage(a.id)'></span>
      </li>
    </ul>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Grid,GridItem } from 'vux'
  import {mapState} from 'vuex'
  import kit from '../../kit'

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
      onFileChange: function () {

        if(imgNumber==imgMaxUploadCount){
          kit.showMsg("每次最多能上传"+imgMaxUploadCount+"张图片")
          return ;
        }

        // 获取当前选中的文件
        const files = event.target.files;
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



          this.fileToDataURL(file,(DataUrl,vm)=>{
              this.compressDataURL(DataUrl,{width:2.8,height:2.8},vm)
          });




        }

        console.info("通过检查，继续执行")



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
           callback(e.target.result,vm);

        };
        reader.readAsDataURL(file);
      },


      /**
       * 使用 canvas 压缩 dataURL
       * @param dataURL
       * @param ratio
       * @param callback
       */
      compressDataURL: function (dataURL, ratio,vm) {
        let orgSize=dataURL.length;
        console.info("压缩前图片的size:"+orgSize);
        if(orgSize<=compressSize) {
          if(!vm.imgChecked(dataURL)) {
            vm.$data.imgArray.push({id: getUuid(), base64Str: dataURL})
            return;
          }

        }
        const img = new window.Image();
        img.src = dataURL;
        // onload
        img.onload = function () {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 100 * ratio.width;
          canvas.height = 100 * ratio.height;
          const RATIO = canvas.width / canvas.height;
          let cutx = 0;
          let cuty = 0;
          let cutw = img.width;
          let cuth = img.height;
          if (cutw / cuth > RATIO) {
            // 宽超过比例了]]
            let realw = cuth * RATIO;
            cutx = (cutw - realw) / 2;
            cutw = realw;
          } else if (cutw / cuth < RATIO) {
            // 长超过比例了]]
            let realh = cutw / RATIO;
            cuty = (cuth - realh) / 2;
            cuth = realh;
          }
          ctx.drawImage(img, cutx, cuty, cutw, cuth, 0, 0, canvas.width, canvas.height);
          const ndata = canvas.toDataURL('image/jpeg', 1);
          //callback(ndata);
          console.info("执行了压缩处理，压缩后图片size："+ndata.length+"压缩率为:"+(((orgSize-ndata.length)/orgSize).toFixed(2))*100+"%")
          console.info(vm.$data)
          vm.$data.imgArray.push({id:getUuid(),base64Str:ndata})
        };
      },

      //检查图片是否已经选择
      imgChecked:function (dataURL) {
        for (var img of this.imgArray){
          if(img.dataURL==dataURL) {
            kit.showMsg("该图片已经被选择");
            return true;
          }
          else
            return false;
        }
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



      delImage:function (id) {

      }
    },
    directives: {},
    components: {Grid,GridItem, },
    data() {
      return {
        imgArray:[],
        layout:'grid'
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
    margin: 0 auto;
    text-align: left;
  }

  ul.grid li{
    padding: 1px;
    float:left;
    cursor: pointer;
    border:  1px solid #e8e8e8;
    box-sizing: border-box;
  }

  ul.grid li img{
    width:49%;
    height:280px;
    object-fit: cover;
    display:block;
    border:none;
    padding: 10px;
    box-sizing: border-box;
  }
</style>
