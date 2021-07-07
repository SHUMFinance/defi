<template>
    <span id="closeCopy" @mouseenter="hover = 1" @mouseleave="hover = 0">
        <transition-group name="img-fade">
            <img key="1" v-show="!hover" src="@/static/copy.svg" />
            <img key="2" v-show="hover" src="@/static/copy_hover.svg" />
        </transition-group>
    </span>
</template>

<script>
export default {
    name: "closeCopy",
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
#closeCopy {
    width: 16px;
    height: 16px;
    display: inline-block;
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
