<template>
    <div id="closeSvg" @mouseenter="hover = 1" @mouseleave="hover = 0">
        <transition-group name="img-fade">
            <img key="1" v-show="!hover" src="@/static/close.svg" />
            <img key="2" v-show="hover" src="@/static/close_hover.svg" />
        </transition-group>
    </div>
</template>

<script>
export default {
    name: "closeSvg",
    data() {
        return { hover: 0 };
    }
};
</script>

<style lang="scss" scoped>
.img-fade-enter-active,
.img-fade-leave-active {
    transition: opacity $animete-time;
}

.img-fade-enter,
.img-fade-leave-to {
    opacity: 0;
}
#closeSvg {
    width: 40px;
    height: 40px;
    position: relative;
    cursor: pointer;
    img {
        left: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        transform: translateZ(0);
    }
}
</style>
