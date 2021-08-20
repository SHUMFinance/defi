<template>
    <div id="thumbnail">
        <transition-group name="img-fade">
            <img
                key="1"
                v-if="!loaded && thumb"
                :src="require(`@/static/${thumb}`)"
            />
            <img
                key="2"
                v-show="loaded"
                @load="onLoad"
                :src="require(`@/static/${src}`)"
            />

            <img
                key="3"
                v-if="!loaded"
                class="loading"
                src="@/static/transferProgress/loading.svg"
            />
        </transition-group>
    </div>
</template>

<script>
export default {
    name: "thumbnail",
    props: {
        thumb: {
            type: String,
            default: ""
        },

        src: {
            type: String,
            default: "",
            required: true
        }
    },
    data() {
        return {
            loaded: false
        };
    },

    methods: {
        onLoad() {
            this.loaded = true;
        }
    }
};
</script>

<style lang="scss">
.img-fade-enter-active,
.img-fade-leave-active {
    transition: opacity $animete-time;
}

.img-fade-enter,
.img-fade-leave-to {
    opacity: 0;
}
#thumbnail {
    width: 100%;
    height: 100%;
    position: relative;

    > span {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fafafa;

        img {
            left: 0;
            position: absolute;
            width: 100%;
            height: 100%;
            transform: translateZ(0);

            &.loading {
                position: unset;
                width: 20px;
                height: 20px;
                animation: rotate 3s linear infinite;
            }
        }
    }
}
</style>
