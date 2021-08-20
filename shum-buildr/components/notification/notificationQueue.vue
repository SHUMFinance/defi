<template>
    <div class="nitificationQueue" ref="nitificationQueue" v-if="!isMobile">
        <div class="notificationBox">
            <transition-group name="list" tag="div">
                <template v-for="(item, index) in queue">
                    <notification
                        :key="item.key"
                        :hash="item.hash"
                        :type="item.type"
                        :networkId="item.networkId"
                        :value="item.value"
                        :unit="item.unit"
                        @closeNotification="removeNotification(index)"
                    >
                    </notification>
                </template>
            </transition-group>
        </div>
    </div>
</template>

<script>
import notification from "@/components/notification/notification.vue";
import _ from "lodash";
export default {
    name: "nitificationQueue",
    data() {
        return {
            queue: [],
            subscribeEvent: ""
        };
    },
    components: {
        notification
    },
    created() {
        this.subscribeEvent = this.$pub.subscribe(
            "notificationQueue",
            async (msg, data) => {
                let newQueue = _.clone(this.queue);
                if (newQueue.length > 2) {
                    newQueue.shift();
                }
                data.key = new Date().valueOf(); //用时间戳当做key,防止dom不更新
                newQueue.push(data);
                this.queue = _.clone(newQueue);
            }
        );
    },
    destroyed() {
        this.$pub.unsubscribe(this.subscribeEvent);
    },
    watch: {
        isMobile() {}
    },
    computed: {
        isMobile() {
            return this.$store.state?.isMobile;
        }
    },
    methods: {
        removeNotification(index) {
            this.queue.splice(index, 1);
        }
    }
};
</script>

<style lang="scss">
.nitificationQueue {
    position: fixed;
    width: 374px;
    right: 20px;
    bottom: 20px;
    z-index: 1000;

    &::-webkit-scrollbar-track-piece {
        background: #fff;
    }
    .notificationBox {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
}

//列表动画
.list-enter-active,
.list-leave-active {
    transition: all $animete-time;
}
.list-enter,
.list-leave-to {
    opacity: 0;
    transform: translateX(120%);
}
</style>
