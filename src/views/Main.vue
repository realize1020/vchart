<template>
    <div>
        <el-container>
            <el-aside width="auto">
                <common-aside/>
            </el-aside>
            <el-container>
                <el-header>
                    Header
                </el-header>
                <el-main>
                    <h1>登录成功！</h1>
                </el-main>
            </el-container>
        
        </el-container>
        
    </div>
    
</template>

<script>
import CommonAside from '../components/CommonAside.vue'
export default {
    data(){
        return {}
    },
    components:{CommonAside}
}
</script>