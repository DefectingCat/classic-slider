class Slider {
  constructor(id) {
    // 外层div
    this.wrapper = document.querySelector(id);
    this.pics = this.wrapper.querySelector('ul');
    // 小圆点外层
    this.index = this.wrapper.querySelector('.index-box');
    // 小圆点索引
    this.indexPoint = 1;
    // 单个图片宽度
    this.picWidth = this.wrapper.clientWidth;
    // 总共图片个数
    this.sliders = this.pics.children.length;
    // 按钮点击间隔
    this.startMs = Date.now();
    // 点击小圆点的间隔
    this.movePoint = 0;
    // 初始化程序
    this.init();
  }
  // 初始化程序
  init() {
    console.log('init!');
    this.initPoint();
    this.clonePic();
    this.lR();
  }
  // 初始化圆点
  initPoint() {
    // 获取图片的总个数
    let num = this.pics.children.length;
    // 使用 fragment 片段来只操作一次 DOM 插入所有圆点
    let frg = document.createDocumentFragment();
    // 循环生成
    for (let i = 0; i < num; i++) {
      let li = document.createElement('li');
      // 设置自定义 Attribute，用来标识和应用样式；
      li.setAttribute('data-index', i + 1);
      // 默认激活状态
      if (i == 0) {
        li.className = 'active';
      }
      // 插入到 fragment
      frg.append(li);
    }
    // 动态生成 ol 宽度
    this.index.children[0].style.width = num * 10 * 2 + 'px';
    this.index.children[0].append(frg);
    // 添加点击事件，获取index
    this.index.children[0].addEventListener('click', (e) => {
      // 利用事件冒泡做事件代理，只点击到 li 元素生效
      if (e.target.nodeName.toString().toLowerCase() == 'li') {
        let ip = e.target.getAttribute('data-index');
        // 判断点击的圆点间隔，从而决定移动多少图片
        if (this.indexPoint < ip) {
          this.movePoint = ip - this.indexPoint;
          this.indexPoint = Number(ip);
          // 调用 move() 方法来移动图片，移动的距离为圆点的间隔 * 单张图片的宽度
          this.move(-this.picWidth * this.movePoint);
        } else {
          this.movePoint = this.indexPoint - ip;
          this.indexPoint = Number(ip);
          this.move(this.picWidth * this.movePoint);
        }
      }
    });
  }
  // 克隆节点
  clonePic() {
    // 克隆第一个元素
    let first = this.pics.firstElementChild.cloneNode(true);
    // 克隆最后一个元素
    let last = this.pics.lastElementChild.cloneNode(true);
    this.pics.append(first);
    this.pics.insertBefore(last, this.pics.firstElementChild);
    // 动态设定宽度
    this.pics.style.width = this.pics.children.length * 100 + '%';
    // 动态设定漂移
    this.pics.style.left = -1 * this.picWidth + 'px';
  }
  // 移动方法
  move(width) {
    // 获取当前的 left 值
    let left = parseFloat(this.pics.style.left);
    // 添加 300ms 的动画
    this.pics.style.transition = `all 300ms`;
    // 通过移动正负值来确定左右
    this.pics.style.left = left + width + 'px';
    // 狸猫换太子
    if (left == -this.picWidth && width > 0) {
      // 动画为300ms，当为最后一张图的时候，295ms后替换整个ul
      setTimeout(() => {
        this.pics.style.transition = `none`;
        this.pics.style.left = -this.sliders * this.picWidth + 'px';
      }, 295);
    } else if (left == -this.sliders * this.picWidth && width < 0) {
      setTimeout(() => {
        this.pics.style.transition = `none`;
        this.pics.style.left = -this.picWidth + 'px';
      }, 290);
    }
    // 应用圆点样式
    this.modIndexPoint();
  }
  // 为圆点添加样式
  modIndexPoint() {
    let points = Array.from(this.index.children[0].children);
    for (let i of points) {
      i.className = '';
    }
    points[this.indexPoint - 1].className = 'active';
  }
  lR() {
    // 选中左右按钮，并添加监听器
    this.wrapper.querySelector('.btn-left').addEventListener('click', () => {
      // 记录上一次点击的时间戳，310ms 内的连续点击将不生效
      if (Date.now() - this.startMs > 310) {
        // 圆点越界时重置其 index
        if (this.indexPoint - 1 < 1) {
          this.indexPoint = this.sliders;
        } else {
          this.indexPoint--;
        }
        this.move(this.picWidth);
        this.startMs = Date.now();
      }
    });
    this.wrapper.querySelector('.btn-right').addEventListener('click', () => {
      // 记录上一次点击的时间戳，310ms 内的连续点击将不生效
      if (Date.now() - this.startMs > 310) {
        // 圆点越界时重置其 index
        if (this.indexPoint + 1 > this.sliders) {
          this.indexPoint = 1;
        } else {
          this.indexPoint++;
        }
        this.move(-this.picWidth);
        this.startMs = Date.now();
      }
    });
  }
}
let slider1 = new Slider('#slider');
