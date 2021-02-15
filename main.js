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
    this.startMs = Date.now();
    this.movePoint = 0;
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
    let num = this.pics.children.length;
    let frg = document.createDocumentFragment();
    for (let i = 0; i < num; i++) {
      let li = document.createElement('li');
      li.setAttribute('data-index', i + 1);
      // 默认激活状态
      if (i == 0) {
        li.className = 'active';
      }
      frg.append(li);
    }
    // ul宽度
    this.index.children[0].style.width = num * 10 * 2 + 'px';
    this.index.children[0].append(frg);
    // 添加点击事件，获取index
    this.index.children[0].addEventListener('click', (e) => {
      if (e.target.nodeName.toString().toLowerCase() == 'li') {
        let ip = e.target.getAttribute('data-index');
        if (this.indexPoint < ip) {
          this.movePoint = ip - this.indexPoint;
          this.indexPoint = Number(ip);
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
    let first = this.pics.firstElementChild.cloneNode(true);
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
    this.animated = false;
    let left = parseFloat(this.pics.style.left);
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
      if (Date.now() - this.startMs > 310) {
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
      // 记录上一次点击的时间戳
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
