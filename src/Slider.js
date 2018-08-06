import { defaultOptions, classes } from "./constants.js";
import Pagination from "./Pagination.js";
import Navigation from "./Navigation.js";

export default class Slider {
  constructor(selector, options = {}) {
    const sliderWrapperClass = classes.sliderWrapperClass;
    this.constainer = document.querySelector(selector);
    this.wrapper = this.constainer.querySelector(`.${sliderWrapperClass}`);
    this.options = { ...defaultOptions, ...options };
    this.slides = [];
    this.snapSlides = [];
    this.previousIndex = 0;
    this.activeIndex = 0;
    this.progress = 1;
    this.isBegining = false;
    this.isEnd = false;
    this.pagination = new Pagination(this);
    this.navigation = new Navigation(this);
    this.init();
  }

  init() {
    if (this.options.loop) {
      this.loopCreate();
    }

    this.updateSlides();

    if (this.options.loop) {
      this.slideTo(1, 0);
    }
  }

  loopCreate() {
    const slides = Array.from(this.wrapper.children);
    slides.forEach((slide, index) => {
      slide.setAttribute("data-slider-slide-index", index);
    });
    const first = slides[0];
    const last = slides[slides.length - 1];
    this.wrapper.append(first.cloneNode(true));
    this.wrapper.prepend(last.cloneNode(true));
  }

  loopFix() {
    if (this.activeIndex >= this.snapSlides.length - 1) {
      const newIndex = 1;
      this.slideTo(newIndex, 0);
    } else if (this.activeIndex === 0) {
      const newIndex = this.snapSlides.length - 2;
      this.slideTo(newIndex, 0);
    }
  }

  /**
   * `this._clientWidth = this.wrapper.clientWidth` 作用：
   * 很多浏览器都会优化这些操作，浏览器会维护1个队列，
   * 把所有会引起回流、重绘的操作放入这个队列，
   * 等队列中的操作到了一定的数量或者到了一定的时间间隔，
   * 浏览器就会flush队列，进行一个批处理。
   * 这样就会让多次的回流、重绘变成一次回流重绘。
   * 虽然有了浏览器的优化，但有时候我们写的一些代码可能会强制浏览器提前flush队列，
   * 这样浏览器的优化可能就起不到作用了。
   * 当你请求向浏览器请求一些 style信息的时候，就会让浏览器flush队列，比如：
   * 1. offsetTop, offsetLeft, offsetWidth, offsetHeight
   * 2. scrollTop/Left/Width/Height
   * 3. clientTop/Left/Width/Height
   * 4. width,height
   * 5. 请求了getComputedStyle(), 或者 IE的 currentStyle
   */
  slideNext() {
    if (this.options.loop) {
      this.loopFix();
      this._clientWidth = this.wrapper.clientWidth; // 无缝过渡关键
      return this.slideTo(this.activeIndex + 1, this.options.speed);
    }
    return this.slideTo(this.activeIndex + 1, this.options.speed);
  }

  slidePrev() {
    if (this.options.loop) {
      this.loopFix();
      this._clientWidth = this.wrapper.clientWidth;
      return this.slideTo(this.activeIndex - 1, this.options.speed);
    }
    return this.slideTo(this.activeIndex - 1, this.options.speed);
  }

  slideTo(index, speed) {
    this.previousIndex = this.activeIndex;
    const slideIndex = index;
    const translate = -this.snapSlides[slideIndex];
    this.updateProgress(translate);
    if (speed === 0) {
      this.setTransition(0);
      this.setTranslate(translate);
      this.updateActiveIndex(index);
    } else {
      this.setTransition(speed);
      this.setTranslate(translate);
      this.updateActiveIndex(index);
      let onTransitionEnd = () => {
        this.wrapper.removeEventListener("transitionend", onTransitionEnd);
        onTransitionEnd = null;
        this.setTransition(0);
      };
      this.wrapper.addEventListener("transitionend", onTransitionEnd);
    }
  }

  updateSlides() {
    const slides = Array.from(this.wrapper.children);
    const offset = this.wrapper.clientWidth;
    for (let i = 0; i < slides.length; i += 1) {
      const slide = slides[i];
      slide.style.width = `${offset}px`;
      this.snapSlides.push(i * offset);
      this.slides.push(slide);
    }
  }

  updateProgress(translate) {
    const translateDiff = this.getMaxTranslate() - this.getMinTranslate();
    this.progress = (translate - this.getMinTranslate()) / translateDiff;
    this.isBegining = this.progress <= 0;
    this.isEnd = this.progress >= 1;
  }

  getMaxTranslate() {
    return -this.snapSlides[this.snapSlides.length - 1];
  }

  getMinTranslate() {
    return -this.snapSlides[0];
  }

  updateActiveIndex(newActiveIndex) {
    this.activeIndex = newActiveIndex;
  }

  setTransition(duration) {
    this.wrapper.style.transitionDuration = `${duration}ms`;
  }

  setTranslate(translate) {
    const x = translate;
    const y = 0;
    const z = 0;
    this.wrapper.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
  }
}
