<template>
    <div id="dropdownArrowSvg" @mouseenter="hover = 1" @mouseleave="hover = 0">
        <transition-group name="img-fade">
            <img
                key="1"
                v-if="!hover && !selected"
                src="@/static/arrow_gray.svg"
            />
            <img
                key="2"
                :class="{ selected }"
                v-if="hover || selected"
                src="@/static/arrow.svg"
            />
        </transition-group>
    </div>
</template>

<script>
export default {
    name: "dropdownArrowSvg",
    props: {
        selected: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return { hover: 0 };
    }
};
</script>

<style lang="scss" scoped>
.img-fade-enter-active,
.img-fade-leave-active {
    transition: $animete-time linear;
}

.img-fade-enter,
.img-fade-leave-to {
    opacity: 0;
}
#dropdownArrowSvg {
    width: 20px;
    height: 20px;
    position: relative;
    cursor: pointer;

    img {
        left: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        transform: translateZ(0);
        transition: transform $animete-time linear;

        &.selected {
            transform: rotate(-180deg);
        }
    }
}
</style>
