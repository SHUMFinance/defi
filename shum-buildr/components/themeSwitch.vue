<template>
    <i-switch
        class="themeSwitch"
        v-model="theme"
        :class="theme"
        true-value="dark"
        false-value="light"
        @on-change="theme => $store.commit('setTheme', theme)"
    >
    </i-switch>
</template>

<script>
/**
 * 切换全局主题,其他组件可通过监视数据来动态设置对应主题
 * 
 * 使用方法:
 * 
 * 
    <template>
        <div :class="innerTheme">
            ...
        </div>
    </template>
 *
    <script>
        import themeList from "@/assets/theme/themeList";
        export default {
            props:{
                theme: {
                    //主题(有则使用固定,无则使用全局)
                    type: String,
                    default: null,
                    validator: value => themeList.indexOf(value) !== -1 // 验证主题名
                }
            },
            watch: { innerTheme() {} },
            computed: {
                innerTheme() {
                    //监视变动,返回主题名
                    let _theme = this.theme ? this.theme : this.$store.state.theme;
                    return _theme;
                }
            }
        }
    <script>
 *  
    <style lang="scss">
        .light{
            ...
        }

        .dark{
            ...
        }
    </style>

 *  如果需要html或js中使用主题变量

    <template>
        <div >
            {{style.lightBackgroundColor}}
        </div>
    </template>

    <script>
        import style from "@/assets/css/global.scss";
        export default {
            data() {
                return {
                    style
                };
            },
            created(){
                console.log(this.style);
            }
        }
    <script>

 */
export default {
    name: "themeSwitch",
    data() {
        return {
            theme: this.$store.state.theme
        };
    }
};
</script>

<style lang="scss">
.themeSwitch {
    &.light {
        border-color: $lightBorderColor;
        background-color: $lightButtonColor;
    }

    &.dark {
        border-color: $darkBorderColor;
        background-color: $darkButtonColor;
    }
}
</style>
