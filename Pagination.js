import { classes } from './constants.js';

export default class Pagination {
	constructor(slider, selector) {
		this.slider = slider;
		this.pagination = document.querySelector(`.${selector}`);
		this.init();
	}

	init() {
		this.paginationCreate();
		this.attachEvent();
		if (!this.slider.options.loop) {
			this.updatePagination();
		}
	}

	hasClass(el, className) {
		return el.classList.contains(className);
	}

	attachEvent() {
		const onPaginationClick = e => {
			const target = e.target;
			const nodeName = target.nodeName;
			const paginationItemClass = classes.paginationItemClass;
			if (nodeName === 'SPAN' && this.hasClass(target, paginationItemClass)) {
				const paginationIndex = e.target.dataset.sliderPaginationIndex;
				const newIndex = parseInt(paginationIndex, 10);
				if (newIndex === this.slider.activeIndex) return;
				this.slider.slideTo(newIndex, this.slider.options.speed);
			}
		};

		this.pagination.addEventListener('click', onPaginationClick, true);
	}

	paginationCreate() {
		this.pagination.classList.add(classes.paginationDotClass);
		const slides = this.slider.wrapper.children;
		for (let i = 0; i < slides.length; i += 1) {
			const span = document.createElement('span');
			span.classList.add(classes.paginationItemClass);
			span.setAttribute('data-slider-pagination-index', i);
			this.pagination.appendChild(span);
		}
	}

	updatePagination() {
		let { activeIndex } = this.slider;
		const { options } = this.slider;
		const activeClass = classes.paginationItemActiveClass;
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
			if (item.classList.contains(activeClass)) {
				item.classList.toggle(activeClass);
			} else if (index === activeIndex) {
				item.classList.toggle(activeClass);
			}
		});
	}
}
