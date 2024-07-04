<template>
    
    <div>
        <h1>登录成功！</h1>
        <!-- <uploader
            ref="uploader"
            :options="options"
            :autoStart=false
            :file-status-text="fileStatusText"
            :lang="lang"
            :auto-upload="false"
            @file-added="onFileAdded"
            @file-success="onFileSuccess"
            @file-progress="onFileProgress"
            @file-error="onFileError"
            class="uploader-ui"
        > -->
        <uploader
            ref="uploader"
            :options="options"
            :autoStart=false
            :file-status-text="fileStatusText"
            @file-added="onFileAdded"
            @file-success="onFileSuccess"
            @file-error="onFileError"
            class="uploader-ui"
        >
            <uploader-unsupport></uploader-unsupport>
            <uploader-drop>
                <div>
                    <uploader-btn text="选择文件"> 选择文件<i class="el-icon-upload el-icon--right"></i></uploader-btn>
                </div>
            </uploader-drop>
            <uploader-list></uploader-list>
        </uploader>
        
        <el-table
            :data="tableData"
            stripe
            border
            class="table"
            ref="multipleTable"
            header-cell-class-name="table-header"
            style="margin-top:40px"
        >
            <el-table-column prop="id" lable='id' align="center" v-if="false"></el-table-column>
            <el-table-column prop="filename" width="570" label="文件名" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="totalSizeName" width="150" label="文件大小" align="center"></el-table-column>
            <el-table-column prop="location" label="location" v-if="false"></el-table-column>
            <el-table-column prop="identifier" label="identifier" align="center" v-if="false"></el-table-column>
            <el-table-column prop="uploadTimeString" width="250" label="上传时间"></el-table-column>
            <el-table-column label="操作"  align="center">
                <template slot-scope="scope">
                    <el-button @click="handleDownload(scope.$index,scope.row)" icon="el-icon-download" type="text" size="small">下载</el-button>
                    &nbsp;
                    <el-button @click="handleDelete(scope.$index,scope.row)" icon="el-icon-delete" style = "color:red" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column label="下载方式"  align="center">
                <template slot-scope="scope">
                    <el-button @click="downloadOne(scope.row)" icon="el-icon-download" type="text" size="small">方式一</el-button>
                    &nbsp;
                    <!-- <a href="/api/static/《用Python学数学》中文PDF+英文PDF+代码.rar" download="D:/temp/uploadFiles/6c4a87f51d57f1b31cd922981e56ea7b/《用Python学数学》中文PDF+英文PDF+代码.rar">下载</a> -->
                    <el-button @click="downloadTwo(scope.row)" icon="el-icon-download" type="text" size="small">方式二</el-button>
                    &nbsp;
                    <el-button @click="downloadThree(scope.row)" icon="el-icon-download" type="text" size="small">方式三</el-button>
                </template>
            </el-table-column>
        </el-table>
        
    </div>
    
</template>
<script>
import SparkMD5 from 'spark-md5';
import {mergeFile,selectFileList,deleteFile,downloadByBlob} from '@/api/upload.js';
export default {
    name:'Main',
    data(){
       
        return{
            options:{
                //目标上传 URL，默认POST target: "/uploader/chunk",
                // 
                //target: "http://localhost:9091/api/uploader/chunk",
                //target: "http://localhost:8080/uploader/chunk",
                //target: process.env.VUE_APP_BASE_API+"/uploader/chunk",
                target: "/api/uploader/chunk",
                //分块大小(单位：字节)
                chunkSize: '2048000',
                //上传文件时文件内容的参数名，对应chunk里的Multipart对象名，默认对象名为file
                fileParameterName: 'upfile',
                //失败后最多自动重试上传次数
                maxChunkRetries: 3,
                //是否开启服务器分片校验，对应GET类型同名的target URL
                testChunks: true,   
                /* 
                服务器分片校验函数，判断秒传及断点续传,传入的参数是Uploader.Chunk实例以及请求响应信息
                reponse码是successStatuses码时，才会进入该方法
                reponse码如果返回的是permanentErrors 中的状态码，不会进入该方法，直接进入onFileError函数 ，并显示上传失败
                reponse码是其他状态码，不会进入该方法，正常走标准上传
                checkChunkUploadedByResponse函数直接return true的话，不再调用上传接口
                */
                checkChunkUploadedByResponse: function (chunk, response_msg) {
                    let objMessage = JSON.parse(response_msg);
                    if (objMessage.skipUpload) {
                        return true;
                    }
                    console.log("checkChunkUploadedByResponse函数中chunk:"+chunk)
                    return (objMessage.uploadedChunks || []).indexOf(chunk.offset + 1) >= 0;
                }      
            },
            fileStatusText:{
                success: '上传成功',
                error: '上传失败',
                uploading: '上传中',
                paused: '暂停',
                waiting: '等待上传'
            },
            fileMaxSize: 10*1024*1024*1024,
            spark : new SparkMD5.ArrayBuffer(),
            silce : File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
            chunkSize : 10 * 1024 * 1000,
            chunks: 0,
            currentChunk : 0,

            //文件列表数据
            tableData: [],
            query:{
                nameSearch: '',
                pageIndex: 1,
                //默认每页显示5条记录
                pageSize: 5
            }            
        }
    },
    created(){
        this.getData();
    },
    methods:{
        onFileAdded(file){
            console.log("onFileAdded..................");
            //文件大小判断
            if(file.size > this.fileMaxSize){
                this.$message({
                    message: '文件超出大小！',
                    center: true,
                    type: 'fail'
                });
                file.cancel()
            }
            //计算md5
            this.computeMD5(file)
        },
        /*
            第一个参数 rootFile 就是成功上传的文件所属的根 Uploader.File 对象，它应该包含或者等于成功上传文件；
            第二个参数 file 就是当前成功的 Uploader.File 对象本身；
            第三个参数就是 message 就是服务端响应内容，永远都是字符串；
            第四个参数 chunk 就是 Uploader.Chunk 实例，它就是该文件的最后一个块实例，如果你想得到请求响应码的话，chunk.xhr.status就是
        */
        onFileSuccess(rootFile, file, response, chunk) {
            //refProjectId为预留字段，可关联附件所属目标，例如所属档案，所属工程等
            file.refProjectId = "123456789";
            mergeFile(file).then( responseData=> {
                if(responseData.data.code === 415){
                    console.log("合并操作未成功，结果码："+responseData.data.code);
                }
                if(file.isComplete()){
                    this.getData()
                }
            }).catch(function (error){
                console.log("合并后捕获的未知异常："+error);
            });
        },
        onFileError(rootFile, file, response, chunk) {
            console.log('上传完成后异常信息：'+response);
        },
        computeMD5(file){
            console.log("computeMD5..................");
            file.pause();
            let fileReader = new FileReader();
            // let time = new Date().getTime();
            // let spark = new SparkMD5.ArrayBuffer();
            // let silce = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
            // let currentChunk = 0;
            // const chunkSize = 10 * 1024 * 1000;
            // let chunks = Math.ceil(file.size/chunkSize);
            let time = new Date().getTime();
            this.chunks = Math.ceil(file.size/this.chunkSize);
            this.calculate(file,this.currentChunk,fileReader)
            fileReader.onload = (e) => {
                this.spark.append(e.target.result);
                console.log(e.target.result);
                if(this.currentChunk<this.chunks){
                    this.currentChunk++;
                    this.calculate(file,this.currentChunk,fileReader);
                }else{
                    //this.uploadFile(file,this.spark.digestSync('MD5'));
                    let md5 =this.spark.end();
                    file.uniqueIdentifier = md5;
                    file.resume();
                    console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${this.chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`);
                }
            }
            fileReader.onerror = function () {
                    this.error(`文件${file.name}读取出错，请检查该文件`)
                    file.cancel();
                };

        },
        calculate(file,currentChunk,fileReader){
            let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
            
            let start = this.currentChunk * this.chunkSize;
            let end=0
            if(start+this.chunkSize>file.size){
                end = file.size;
            }else{
                end = start+this.chunkSize;
            }
            fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
            //currentChunk++;
            console.log("计算第"+this.currentChunk+"块");
        },
        close() {
                this.uploader.cancel();
            },
        error(msg) {
            this.$notify({
                title: '错误',
                message: msg,
                type: 'error',
                duration: 2000
            })
        },
        //获取上传文件列表数据
        async getData(){
             selectFileList(this.query).then(res => {
                this.tableData = res.data.data.list;
            })
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(async() => {
                    let result = await deleteFile(row);
                    console.log(result);
                    if(result.data.data.result > 0){
                        this.$message.success('删除成功');
                        this.tableData.splice(index, 1);
                    }else{
                        this.$message.error('删除失败');
                    }
                }
            );
        },
        //下载
        async handleDownload(index, row) {
            this.loadingOverLay = this.$loading({
                lock: true,
                text: '文件生成中',
                spinner: 'el-icon-loading',
                background: 'rgba(0,0,0,0.7)'
                });
            var elemIF = document.createElement('iframe');
            elemIF.src = process.env.VUE_APP_BASE_API+'/uploader/download?id='+row.id+'&filename='+encodeURIComponent(row.filename)+'&location='+encodeURIComponent(row.location);
            elemIF.style.display ='none';
            document.body.appendChild(elemIF);	  
            this.loadingOverLay.close(); 
        },
        //1、第一种方式通过使用a标签的方式下载，需要文件放到后端服务器的resource资源目录下，也就是说我们在上传的时候就需要传到资源目录。放到磁盘路径上是不行，会访问拒绝。但是利用后端接口去get请求是可以的
        downloadOne(row){ 
            //第一种写法
            // let a = document.createElement('a');
            // a.href ="/api/static/"+encodeURIComponent(row.filename);
            // a.click();

            //第二种写法
            window.location.href = "/api/static/"+encodeURIComponent(row.filename);
            //window.location.href = process.env.VUE_APP_BASE_API+'/uploader/download?id='+row.id+'&filename='+encodeURIComponent(row.filename)+'&location='+encodeURIComponent(row.location);
        },
        //2、第二种方式通过创建iframe的方式：
        downloadTwo(row){
            var elemIF = document.createElement('iframe')
            elemIF.src = elemIF.src = process.env.VUE_APP_BASE_API+'/uploader/download?id='+row.id+'&filename='+encodeURIComponent(row.filename)+'&location='+encodeURIComponent(row.location);
            elemIF.style.display = 'none'
            document.body.appendChild(elemIF)
        },
        //3、第三种方式发起一个post请求，使用blob格式
        downloadThree(row){
            downloadByBlob(row).then(res => {
                console.log("res.data :"+res.data)
                let contentType = res.headers['content-type'] || 'application/octet-stream';

                let blob =new Blob([res.data],{
                    type: contentType
                })
                console.log("blog"+blob)
                //let fileName = row.fileName || 'downloaded_file' + (new Date()).getTime() + this.getFileExtensionFromContentType(contentType);
                let fileName = row.filename || 'downloaded_file' + (new Date()).getTime() + this.getFileExtensionFromContentType(contentType);
                if (window.navigator.msSaveOrOpenBlob) {
                    // console.log(2)
                    navigator.msSaveBlob(blob, fileName)
                } else {
                    // console.log(3)
                    var link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = fileName
                    link.click()
                    //释放内存
                    window.URL.revokeObjectURL(link.href)
                }
            })
        },
        getFileExtensionFromContentType(contentType) {
            const extensions = {
                'image/jpeg': '.jpg',
                'image/png': '.png',
                'application/pdf': '.pdf',
                'application/zip': '.zip',
                'application/rar': '.rar',
                // 添加更多类型...
                'application/octet-stream': '', // 默认或未知类型
            };
            return extensions[contentType] || '';
        }
    }

}
</script>
