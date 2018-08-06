export default class Navigation {
	constructor(slider) {
		this.slider = slider;
		this.init();
	}

	init() {
		const { prevEl, nextEl } = this.slider.options.navigation;
		if (!(prevEl || nextEl)) return;

		const prevElDom = document.querySelector(prevEl);
		const nextElDom = document.querySelector(nextEl);

		prevElDom.addEventListener('click', e => {
			e.preventDefault();
			if (this.slider.isBegining && !this.slider.options.loop) return;
			this.slider.slidePrev();
		});

		nextElDom.addEventListener('click', e => {
			e.preventDefault();
			if (this.slider.isEnd && !this.slider.options.loop) return;
			this.slider.slideNext();
		});
	}
}
