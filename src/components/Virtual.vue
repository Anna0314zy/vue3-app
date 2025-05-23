

<template>
  <div class="viewport" ref="viewport" @scroll="handleScroll">
      <!-- 可滚动容器 -->
    <div class="scrollBar" ref="scrollBar"></div>
      <!-- 占位高度，使容器出现滚动条 -->
    <div class="scroll-list" :style="{transform:`translate3d(0,${offset}px,0)`}">
      <!-- 真正渲染的可视元素，向下平移 offset 位置 -->
      <div v-for="(item,index) in visibleData" :key="item.id" :vid="item.index" ref="items">
        <slot :item="item"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
  items: Array,     // 原始数据列表
  size: Number,     // 每个 item 的默认高度（仅用于初始化）
  remain: Number,   // 可视区域渲染的 item 数量
  variable: Boolean // 是否支持高度不固定
},
  
  data() {
    return {
      start: 0,     // 可视区域开始的 index
    end: null,    // 可视区域结束的 index
    offset: 0     // 可视区域渲染的起始偏移量，用于 transform
    };
  },
  computed: {
    //为每个 item 添加一个 index 属性，方便后续处理。
    formatData(){
      return this.items.map((item,index)=>({...item,index}))
    },  
    // start 和 end 再加减预加载的 item 数量，提升滚动体验。 只渲染这部分元素。
    visibleData() {
      let start = this.start - this.prevCount;
      let end = this.end + this.nextCount;
      return this.formatData.slice(start, end);
    },
    //决定前后多渲染几个元素作为缓存，避免滚动闪烁。
    prevCount() {
      return Math.min(this.start, this.remain);
    },
    nextCount() {
      return Math.min(this.items.length - this.end, this.remain);
    }
  },
  mounted() {
    // 1.设置viewPrort的高度 控制视口展示 remain 个 item
    this.$refs.viewport.style.height = this.remain * this.size + "px";
   // 设置 scrollBar 的高度：制造一个总高度，让页面出现滚动条
    this.$refs.scrollBar.style.height = this.items.length * this.size + "px";
   // 初始化渲染范围
    this.end = this.start + this.remain;
    // 如果是不定高，初始化所有 item 的位置记录
    if (this.variable) {
      this.initPosition();
    }
  },
  /**
   * 更新所有渲染中的 DOM 元素的实际高度

和之前记录的高度比较，如果有变化则更新 positions

重新计算所有后续 item 的 top/bottom 值（累加式）

更新滚动条总高度

更新偏移 offset
   */
  updated(){
      // 获取真实元素的位置 更新top和bottom;
     this.$nextTick(()=>{
        let nodes = this.$refs.items;
        if(!(nodes && nodes.length >0)){
            return 
        }
        nodes.forEach(node=>{ 
            let rect = node.getBoundingClientRect();
            let height = rect.height;
            let index = +node.getAttribute('vid');
            let oldHeight = this.positions[index].height;
            let val = oldHeight - height;
            console.log(val);
            if(val){ 
                // 先更新自己
                this.positions[index].bottom = this.positions[index].bottom - val;
                this.positions[index].height = height;
                for(let i = index+1;i<this.positions.length;i++){
                    this.positions[i].top = this.positions[i-1].bottom;
                    this.positions[i].bottom = this.positions[i].bottom - val;
                }
            }
        })
        this.$refs.scrollBar.style.height = this.positions[this.positions.length-1].bottom +'px';
        // this.offset = this.positions[this.start - this.prevCount]? this.positions[this.start - this.prevCount].top : 0;
     });
  },
  methods: {
    // 初始化每个 item 的 top 和 bottom 位置
    initPosition() {
      // 初始化位置
      this.positions = this.items.map((item, index) => ({
        index,
        height: this.size,
        top: index * this.size, //当前元素距离整个列表顶部的像素值（偏移）  第0项是 0×30=0，第3项是 3×30=90
        bottom: (index + 1) * this.size // 当前元素底部距离列表顶部的像素值（= top + height） 第0项是 (0+1)×30=30，第3项是 (3+1)×30=120
      }));
    },
    //二分查找：根据滚动高度快速找出“第一个可视元素的 index”
    // 通过二分查找 scrollTop 所对应的元素（即判断 scrollTop 落在哪个 top ~ bottom 区间内），避免全量遍历，提高性能。
    getStartIndex(value) {
      //在当前位置中间找一个 middleIndex，获取其 bottom 值（即该 item 底部的像素位置）。
      let positions = this.positions;
      let start = 0;
      let end = this.positions.length;
      let temp = null;
      while (start < end) {
        let middleIndex = parseInt((start + end) / 2); // 向下取整
        let middleValue = this.positions[middleIndex].bottom;
        if (value == middleValue) {
        //如果滚动位置刚好等于某个 item 的 bottom，就返回下一个 item 的索引（因为下一个才是要开始渲染的）。
          return middleIndex + 1;
        } else if (middleValue < value) {
          // 如果当前 middle 的 bottom 小于滚动位置，说明当前项在滚动区域的上方，应该往右边查找。
           start = middleIndex + 1;
        } else if (middleValue > value) {
          // 如果 middle 的 bottom 大于滚动位置，说明当前 item 还在屏幕内，要往左继续找更前的一个满足条件的项。

         // 记录最小的满足条件的索引
          temp = Math.min(temp ?? Infinity, middleIndex);
          end = middleIndex - 1;
        }
      }
      return temp;
    },
    /**
     * 两种情况：
固定高度：用 scrollTop / size 快速算出起始 index

不定高度：用 getStartIndex() 结合 positions 映射找出起始 index

然后根据起始项，设置 offset，也就是渲染内容区域应向下平移的距离。
     */
    handleScroll() {
      let scrollTop = this.$refs.viewport.scrollTop;
      if (this.variable) {
        // 算出开始的位置
        this.start = this.getStartIndex(scrollTop);
        this.end = this.start + this.remain;
        this.offset = this.positions[this.start - this.prevCount]? this.positions[this.start - this.prevCount].top : 0;
        // 算出结尾位置
        // 设置偏移量
      } else {
        // 计算开始
        this.start = Math.floor(scrollTop / this.size);
        // 计算结束
        this.end = this.start + this.remain;
        // 计算偏移量
        this.offset =
          scrollTop - (scrollTop % this.size) - this.prevCount * this.size;
      }
    }
  }
};
</script>
<style lang="stylus">
.viewport {
  overflow-y: scroll;
  position: relative;
}

.scroll-list {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
</style>