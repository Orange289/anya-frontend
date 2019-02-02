'use strict';

let hello = document.querySelector('.js-hello'),
		title = document.querySelector('.js-title');

let setOpacity = function (el) {
	el.setAttribute('style', 'opacity: 1');
};

// setTimeout(function () {
// 	hello.setAttribute('style', 'transform: translateX(0)');
// }, 200
// );

setTimeout(function () {
	title.setAttribute('style', 'transform: translateX(0)');
	}, 100
);

// Scroll reveal

ScrollReveal().reveal('.projects__item, .contact .title, .contact__desc, .contact__link', { duration: 400, delay: 250, distance: '25px', interval: 60});
ScrollReveal().reveal('.about__links', {duration: 600, delay: 1000});

// Scroll to the blocks

let anchorlinks = document.querySelectorAll('a[href^="#"]')

for (let item of anchorlinks) {
	item.addEventListener('click', (e) => {
		let hashval = item.getAttribute('href');
		let target = document.querySelector(hashval);
		target.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
		history.pushState(null, null, hashval);
		e.preventDefault();
	})
}

// Typed.js

var typed = new Typed('.js-hello', {
	strings: ['', 'Hello World!'],
	typeSpeed: 30,
	backSpeed: 0,
	loop: false,
	showCursor: false
});
