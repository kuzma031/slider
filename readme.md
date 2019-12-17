### JavaScript Slider 
- Vanilla JavaScript ( ES6 ) slider
- Support lot of features: Slide speed, autoplay, autoplay speed, pause on hover, arrows, adaptive height...
- Responsive

In future versions, plan is to polyfill code for older browsers, add minify version, add new functionalities, fix bugs and to publish package on npm.

Please send me message if you find any bugs, 

Happy hacking!


####Add to your code:

    <script src="slider.js"></script>
	const slider = new Slider({
		container: document.querySelector('.slider-container')
	});
	slider.initSlider();
    


####Available options　

```javascript
    container: document.querySelector('.slider') //required - container of slider,
    slideSpeed: 600, // not required - default 600ms
    arrows: true, // not required - default true
    autoplay: false, // not required - default true
    autoplaySpeed : 4000, // not required - default 1200ms
    pauseOnHover: true, // not required - default true
    adaptiveHeight: false // not required - default false


```
