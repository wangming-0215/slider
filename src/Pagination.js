import { classes } from "./constants.js";

export default class Pagination {
  constructor(slider) {
    this.slider = slider;
    const { el } = this.slider.options.pagination;
    this.pagination = document.querySelector(el);
    if (!this.pagination) return;
    this.init();
  }

  init() {
    this.paginationCreate();
    this.attachEvent();
  }

  hasClass(el, className) {
    return el.classList.contains(className);
  }

  attachEvent() {
    const onPaginationClick = e => {
      // TODO: loop: true 时的行为
      const target = e.target;
      const nodeName = target.nodeName;
      const paginationItemClass = classes.paginationItemClass;
      if (nodeName === "SPAN" && this.hasClass(target, paginationItemClass)) {
        const paginationIndex = e.target.dataset.sliderPaginationIndex;
        const newIndex = parseInt(paginationIndex, 10);
        if (newIndex === this.slider.activeIndex) return;
        this.slider.slideTo(newIndex, this.slider.options.speed);
      }
    };

    this.pagination.addEventListener("click", onPaginationClick, true);
  }

  paginationCreate() {
    const slides = this.slider.wrapper.children;
    const { itemClassName } = this.slider.options.pagination;
    for (let i = 0; i < slides.length; i += 1) {
      const span = document.createElement("span");
      span.classList.add(itemClassName);
      span.setAttribute("data-slider-pagination-index", i);
      this.pagination.appendChild(span);
    }
  }

  updatePagination() {
    let { activeIndex } = this.slider;
    const { options } = this.slider;
    const { itemActiveClassName } = this.slider.options.pagination;
    const paginationItems = this.pagination.children;
    const slides = this.slider.slides;
    if (options.loop) {
      const slideIndex = parseInt(
        slides[activeIndex].dataset.sliderSlideIndex,
        10
      );
      activeIndex = slideIndex;
    }
    Array.from(paginationItems).forEach((item, index) => {
      if (item.classList.contains(itemActiveClassName)) {
        item.classList.toggle(itemActiveClassName);
      } else if (index === activeIndex) {
        item.classList.toggle(itemActiveClassName);
      }
    });
  }
}
