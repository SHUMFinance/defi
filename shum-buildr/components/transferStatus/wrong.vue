<template>
    <div id="transferWrong">
        <div class="close" @click="$emit('close')">
            <closeSvg></closeSvg>
        </div>

        <div class="icon">
            <img src="@/static/roadblock.svg" />
        </div>

        <div class="title">Oops! Something is wrong</div>

        <div class="descript">Your transaction can not be processed.</div>

        <div class="btns">
            <div class="try" @click="$emit('again')">Try again</div>
            <div class="gap">&nbsp;</div>

            <div class="homepage" @click="$emit('homepage')">
                Go to Homepage
            </div>
        </div>
    </div>
</template>

<script>
import closeSvg from "@/components/svg/close";
export default {
    name: "transferWrong",
    components: {
        closeSvg
    },
    data() {
        return {};
    }
};
</script>

<style lang="scss">
#transferWrong {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;

    .close {
        width: 40px;
        height: 40px;
        position: absolute;
        top: 24px;
        right: 24px;
    }
    .icon {
        width: 160px;
        height: 160px;
        margin: 250px auto 0 auto;
    }

    .title {
        width: 410px;
        height: 40px;
        color: #5a575c;
        font-family: "Gilroy";
        font-size: 24px;
        font-weight: 400;
        line-height: 40px;
        text-align: center;
        margin: 40px auto 0 auto;
    }

    .descript {
        width: 315px;
        height: 24px;
        color: #5a575c;
        font-family: "Gilroy-Regular";
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        text-align: center;
        margin: 8px auto 0 auto;
    }
    .btns {
        width: 310px;
        height: 24px;
        display: flex;
        margin: 32px auto 0 auto;
    }
    .try {
        width: 122px;
        height: 40px;
        border-radius: 20px;
        border: solid 1px #1a38f8;
        color: #1a38f8;
        font-family: "Gilroy";
        font-size: 12px;
        font-weight: 400;
        line-height: 40px;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        cursor: pointer;
    }
    .gap {
        width: 16px;
    }
    .homepage {
        flex: 1;
        width: 193px;
        height: 40px;
        border-radius: 20px;
        background: #1a38f8;
        color: #ffffff;
        font-family: "Gilroy";
        font-size: 12px;
        font-weight: 400;
        line-height: 40px;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        cursor: pointer;
        transition: $animete-time linear;

        &:hover {
            background-color: #1a38f8;
        }
    }
}

@media only screen and (max-width: $max-phone-width) {
    #transferWrong {
        width: 74.6vw;
        margin: 0 auto;

        .close {
            width: 26px;
            height: 26px;
            position: absolute;
            top: 10px;
            right: 0;

            #closeSvg {
                width: 26px;
                height: 26px;
            }
        }

        .icon {
            width: unset;
            height: unset;
            margin: 80px 0 0;
            display: flex;
            justify-content: center;
        }

        .title {
            width: unset;
            height: unset;
            color: #5a575c;
            font-family: "Gilroy";
            font-size: 16px;
            font-weight: 400;
            line-height: 16px;
            text-align: center;
            margin: 40px auto 0 auto;
        }

        .descript {
            width: unset;
            height: unset;
            color: #5a575c;
            font-family: "Gilroy-Regular";
            font-size: 12px;
            font-weight: 400;
            line-height: 12px;
            text-align: center;
            margin: 8px auto 0 auto;
        }
        .btns {
            width: unset;
            height: unset;
            display: flex;
            flex-direction: column-reverse;
            margin: 32px auto 0 auto;
        }
        .try {
            width: 100%;
            height: 40px;
            border-radius: 20px;
            border: solid 1px #1a38f8;
            color: #1a38f8;
            font-family: "Gilroy-Bold";
            font-size: 12px;
            font-weight: 400;
            line-height: 40px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            cursor: pointer;
        }
        .gap {
            width: 16px;
        }
        .homepage {
            width: 100%;
            height: 40px;
            border-radius: 20px;
            background: #1a38f8;
            color: #ffffff;
            font-family: "Gilroy-Bold";
            font-size: 12px;
            font-weight: 400;
            line-height: 40px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            cursor: pointer;
            transition: $animete-time linear;

            &:hover {
                background-color: #1a38f8;
            }
        }
    }
}
</style>
