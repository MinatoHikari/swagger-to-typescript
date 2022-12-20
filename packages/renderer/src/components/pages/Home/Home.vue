<template>
    <main style="padding: 24px 0">
        <n-grid x-gap="12">
            <n-gi span="21" offset="1">
                <n-grid x-gap="12" y-gap="12">
                    <n-gi span="24">
                        <n-grid x-gap="12" y-gap="12" cols="1 m:2" responsive="screen">
                            <n-gi v-for="(item, index) in list" :key="item.key">
                                <n-card>
                                    <n-grid x-gap="12" y-gap="12">
                                        <n-gi span="12">
                                            <n-input-group v-if="item.type === 'edit'">
                                                <n-input-group-label>Name</n-input-group-label>
                                                <n-input
                                                    v-model:value.trim="item.name"
                                                    placeholder="custom name"
                                                />
                                            </n-input-group>
                                            <n-input-group v-else>
                                                <n-input-group-label>Name</n-input-group-label>
                                                <n-tooltip>
                                                    <template #trigger>
                                                        <n-input-group-label
                                                            style="
                                                                background-color: white;
                                                                max-width: 100%;
                                                                pointer-events: auto;
                                                                min-width: 100px;
                                                            "
                                                        >
                                                            <n-ellipsis :tooltip="false">
                                                                {{ item.name }}
                                                            </n-ellipsis>
                                                        </n-input-group-label>
                                                    </template>
                                                    {{ item.name }}
                                                </n-tooltip>
                                            </n-input-group>
                                        </n-gi>
                                        <n-gi style="text-align: right" span="12">
                                            <n-button-group>
                                                <n-button
                                                    v-if="item.type === 'edit'"
                                                    type="default"
                                                    ghost
                                                    @click="save(index)"
                                                >
                                                    <n-icon>
                                                        <Save20Regular />
                                                    </n-icon>
                                                </n-button>
                                                <n-button
                                                    v-if="item.type === 'default'"
                                                    type="default"
                                                    ghost
                                                    @click="edit(index)"
                                                >
                                                    <n-icon>
                                                        <Edit />
                                                    </n-icon>
                                                </n-button>
                                                <n-button
                                                    type="default"
                                                    ghost
                                                    @click="enter(index)"
                                                >
                                                    <n-icon>
                                                        <EnterOutline />
                                                    </n-icon>
                                                </n-button>
                                                <n-popconfirm @positive-click="deleteItem(index)">
                                                    <template #trigger>
                                                        <n-button type="default" ghost>
                                                            <n-icon><DeleteOff20Regular /></n-icon>
                                                        </n-button>
                                                    </template>
                                                    Confirm deleting?
                                                </n-popconfirm>
                                            </n-button-group>
                                        </n-gi>
                                        <n-gi span="24">
                                            <n-input-group v-if="item.type !== 'edit'">
                                                <n-input-group-label>Source</n-input-group-label>
                                                <n-input
                                                    v-model:value.trim="item.source"
                                                    style="max-width: 60%"
                                                    placeholder="http://example.com"
                                                />
                                                <n-input-group-label>
                                                    <n-ellipsis>
                                                        <div>{{ item.suffix }}</div>
                                                    </n-ellipsis>
                                                </n-input-group-label>
                                            </n-input-group>
                                            <n-input-group v-else>
                                                <n-input-group-label>Source</n-input-group-label>
                                                <n-tooltip>
                                                    <template #trigger>
                                                        <n-input-group-label
                                                            style="
                                                                background-color: white;
                                                                max-width: 50%;
                                                                pointer-events: auto;
                                                                min-width: 200px;
                                                            "
                                                        >
                                                            <n-ellipsis
                                                                v-if="item.source"
                                                                :tooltip="false"
                                                            >
                                                                {{ item.source }}
                                                            </n-ellipsis>
                                                        </n-input-group-label>
                                                    </template>
                                                    {{ item.source }}
                                                </n-tooltip>
                                                <n-select
                                                    v-model:value="item.suffix"
                                                    :options="[
                                                        {
                                                            value: '/swagger-ui.html',
                                                            label: '/swagger-ui.html',
                                                        },
                                                        {
                                                            value: '/swagger-ui/index.html',
                                                            label: '/swagger-ui/index.html',
                                                        },
                                                    ]"
                                                />
                                            </n-input-group>
                                        </n-gi>
                                    </n-grid>
                                </n-card>
                            </n-gi>
                            <n-gi>
                                <n-card style="cursor: pointer" @click="add">
                                    <n-grid x-gap="12" y-gap="12">
                                        <n-gi span="8">
                                            <n-grid x-gap="12" y-gap="12">
                                                <n-gi span="24">
                                                    <n-skeleton
                                                        :animated="false"
                                                        :width="0"
                                                        :sharp="false"
                                                        size="medium"
                                                    />
                                                </n-gi>
                                                <n-gi span="24">
                                                    <n-skeleton
                                                        :animated="false"
                                                        :width="0"
                                                        :sharp="false"
                                                        size="medium"
                                                    />
                                                </n-gi>
                                            </n-grid>
                                        </n-gi>
                                        <n-gi span="8">
                                            <n-space
                                                style="height: 100%"
                                                justify="center"
                                                align="center"
                                            >
                                                <n-icon style="margin-top: 15px" size="50">
                                                    <Add24Regular />
                                                </n-icon>
                                            </n-space>
                                        </n-gi>
                                        <n-gi span="8">
                                            <n-grid x-gap="12" y-gap="12">
                                                <n-gi span="24">
                                                    <n-skeleton
                                                        :animated="false"
                                                        :width="0"
                                                        :sharp="false"
                                                        size="medium"
                                                    />
                                                </n-gi>
                                                <n-gi span="24">
                                                    <n-skeleton
                                                        :animated="false"
                                                        :width="0"
                                                        :sharp="false"
                                                        size="medium"
                                                    />
                                                </n-gi>
                                            </n-grid>
                                        </n-gi>
                                    </n-grid>
                                </n-card>
                            </n-gi>
                        </n-grid>
                    </n-gi>
                </n-grid>
            </n-gi>
        </n-grid>
    </main>
</template>

<script lang="ts">
import { Add24Regular, DeleteOff20Regular, Save20Regular } from '@vicons/fluent';
import { EnterOutline } from '@vicons/ionicons5';
import { Edit } from '@vicons/tabler';
import { useList } from '/@/components/pages/Home/useList';

export default defineComponent({
    name: 'HomePage',
    components: {
        Add24Regular,
        DeleteOff20Regular,
        EnterOutline,
        Edit,
        Save20Regular,
    },
    setup() {
        const { list, getSourceList, save, edit, add, enter, deleteItem } = useList();

        if (list.value.length === 0) {
            nextTick(() => {
                getSourceList();
            });
        }

        return {
            list,
            getSourceList,
            save,
            edit,
            add,
            enter,
            deleteItem,
        };
    },
});
</script>

<style scoped>
.card-text {
    font-size: 15px;
}
</style>
