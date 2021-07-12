<template>
    <span v-if="content === splitStr" :style="colorStyle">{{ content }}</span>
    <span v-for="(str, index) in strArr" v-else :key="index + str">
        <span>{{ str }}</span>
        <span v-if="index !== strArr.length - 1" :style="colorStyle">{{ splitStr }}</span>
    </span>
</template>

<script lang="tsx">
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'TextSpliter',
    props: {
        content: {
            type: String,
            default: '',
        },
        splitStr: {
            type: String,
            default: '',
        },
        splitColor: {
            type: String,
            default: '#f2a531',
        },
    },
    setup(props) {
        const strArr = computed(() =>
            props.splitStr ? props.content.split(props.splitStr) : [props.content],
        );

        const colorStyle = computed(() => ({ color: props.splitColor }));

        return {
            strArr,
            colorStyle,
        };
    },
});
</script>

<style scoped></style>
