<script setup lang="ts">
import { ref } from 'vue'
/**
静态资源的动态导入
 */
// 展示emoji 文件夹下的图片

const images = import.meta.glob('../assets/images/*.png', { eager: true });
const fileNames = []

const imageMap: Record<string, string> = {};
for (const path in images) {
    const fileName = path.split('/').pop()?.replace('.png', '')
    fileNames.push(fileName);
    console.log('fileName', fileNames);
    if (fileName) {
        imageMap[fileName] = (images[path] as { default: string }).default;
    }
}
// @ts-ignore
function getImageUrl(name: string) {
    return imageMap[name]; // 例如 getImageUrl('a') 返回 /assets/images/a-xxxx.png
}

const imageRef = ref<string>('');
//['baibai', 'bixin', 'biye', 'chonga', 'dacall', 'daku', 'daxiao', 'dianzan', 'emojiDefault', 'fanu', 'hai', 'haobang', 'jiayou', 'kouer', 'kouyi', 'liuhan', 'liuliuliu', 'manfen', 'meidong', 'niuniu', 'ok', 'qiuzhu', 'wulianku', 'yihuo']
const imageList = ref([
   { name: 'baibai' },
   { name: 'bixin' },
   { name: 'biye' },
   { name: 'chonga' },
   { name: 'dacall' },
   { name: 'daku' },
   { name: 'daxiao' },
   { name: 'dianzan' },
   { name: 'emojiDefault' },
   { name: 'fanu' },
   { name: 'hai' },
   { name: 'haobang' },
   { name: 'jiayou' },
   { name: 'kouer' },
   { name: 'kouyi' },
   { name: 'liuhan' },
   { name: 'liuliuliu' },
   { name: 'manfen' },
   { name: 'meidong' },
   { name: 'niuniu' },
   { name: 'ok' },
   { name: 'qiuzhu' },
   { name: 'wulianku' },
   { name: 'yihuo' },
]);
const handleClick = (item: { name: string }) => {
    console.log('imageRef', imageRef.value);
    import(`../assets/images/${item.name}.png`).then((res) => {
        console.log('res', res);
        imageRef.value = res.default;
    }).catch((err) => {
        console.log('err', err);
    });
};
// const handleClick = (item: { name: string }) => {
//     imageRef.value = getImageUrl(item.name);

//     console.log('imageRef', item.name,getImageUrl(item.name));
//     // const url = new URL(`../assets/images/${item.name}.png`, import.meta.url).href;
//     // console.log('res', url);
//     // imageRef.value = url

// };
// const handleClick = (item: { name: string }) => {
//     imageRef.value = getImageUrl(item.name);
// };
</script>

<template>
    <div>
        <h1>静态资源的动态导入</h1>
        <el-button v-for="item in imageList" :key="item.name" @click="() => handleClick(item)" >切换{{ item.name }}</el-button>
       <div class="img"> <img :src="imageRef" /></div>
    </div>
</template>

<style lang="scss" scoped>
.img {
    width: 100px;
    height: 100px;
    img {
        width: 100%;
        height: 100%;
    }
}

</style>