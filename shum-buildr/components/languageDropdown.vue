<template>
    <Dropdown
        trigger="click"
        class="languageDropdown"
        :class="innerTheme"
        placement="bottom-start"
    >
        <a href="javascript:void(0)">
            选择语言
            <Icon type="ios-arrow-down"></Icon>
        </a>
        <DropdownMenu slot="list">
            <DropdownItem
                v-for="(value, key) in i18nList"
                :key="key"
                @click.native="changeLanguage(key)"
            >
                <img :src="value.flag" />{{ value.name }}
            </DropdownItem>
        </DropdownMenu>
    </Dropdown>
</template>

<script>
/**
 * 多语言切换下拉列表
 * html内使用 $t('a.b')
 * js内使用 this.$t('a.b')
 * 参数为json属性名,多级属性用.连接
 */
import themeList from "@/assets/theme/themeList";
import i18nList from "@/assets/i18n/i18nList";
export default {
    name: "languageDropdown",
    props: {
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
    },
    data() {
        return {
            i18nList
        };
    },
    methods: {
        //改变语言
        changeLanguage(language) {
            if (language != this.$i18n.locale) {
                this.$i18n.locale = language;
                this.$store.commit("setLocale", language);
            }
        }
    }
};
</script>

<style lang="scss">
.languageDropdown {
    .ivu-dropdown-rel {
        cursor: pointer;
        border: 1px solid;
    }

    .ivu-select-dropdown {
        padding: 16px;
        border: 1px solid;
        box-shadow: none;
        border-radius: 5px;

        .ivu-dropdown-menu {
            .ivu-dropdown-item {
                display: flex;
                align-items: center;
                padding: 5px 10px;

                img {
                    height: 18px;
                    margin-right: 16px;
                    
                }
            }
        }
    }

    &.light {
        .ivu-dropdown-rel {
            background-color: $lightButtonColor;
            color: $lightFontColor;
            border-color: $lightBorderColor;
        }

        .ivu-select-dropdown {
            border-color: $lightBorderColor;
            background-color: $lightBackgroundColor;

            .ivu-dropdown-item {
                color: $lightFontColor;

                &:hover {
                    background-color: $lightButtonColor;
                }
            }
        }
    }

    &.dark {
        .ivu-dropdown-rel {
            background-color: $darkButtonColor;
            color: $darkFontColor;
            border-color: $darkBorderColor;
        }

        .ivu-select-dropdown {
            border-color: $darkBorderColor;
            background-color: $darkBackgroundColor;

            .ivu-dropdown-item {
                color: $darkFontColor;

                &:hover {
                    background-color: $darkButtonColor;
                }
            }
        }
    }
}
</style>
