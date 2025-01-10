<template>
    <div class="header-container">
        <div class="l-content">
            <el-button  style="margin-right:20px" @click='handleMenu' icon="el-icon-menu" size="mini"></el-button>
            <!-- 面包屑 -->
            <el-breadcrumb separator="/">
                <el-breadcrumb-item  v-for="item in tags" :key="item.path" :to="{ path: item.path }">{{ item.label }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="r-content">
            <el-dropdown @command="logout">
                <span class="el-dropdown-link">
                    <img class="user" src="../assets/logo.png"/>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>个人中心</el-dropdown-item>
                    <el-dropdown-item command="cancel">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'Header'
    }
</script>
<style lang="less" scoped>
    .header-container {
        padding: 0 20px;
        background-color: #333;
        height: 60px;
        display: flex;//???????????????????????????????????
        justify-content: space-between;
        align-items: center;
        .text {
            color: #fff;
            font-size: 14px;
            margin-left: 10px;
        }
        .r-content{
            .user{
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: #fff;
            }
        }

        .l-content{
            display: flex;
            align-items: center;
            /deep/.el-breadcrumb__item {//deep样式穿刺
                .el-breadcrumb__inner{
                    &.is-link {
                        font-weight: normal;
                        color: #666;
                    }
                }
                &:last-child{
                    .el-breadcrumb__inner{
                        color:#fff
                    }
                    }
            }
        }
        
    }
</style>