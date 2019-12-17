class Slider {
    constructor(slider) {
        this.container = slider.container;
        this.children = this.container.children;
        this.slideSpeed = slider.slideSpeed === undefined ? 600 : slider.slideSpeed;
        this.autoplay = slider.autoplay === undefined ? true : slider.autoplay;
        this.autoplaySpeed = slider.autoplaySpeed === undefined ? 1200 : slider.autoplaySpeed;
        this.autoplayStatus = 0; // interval vairable
        this.pauseOnHover = slider.pauseOnHover === undefined ? true : slider.pauseOnHover;
        this.arrows = slider.arrows === undefined ? true : slider.arrows;
        this.sliderWidth = slider.container.offsetWidth;
        this.adaptiveHeight = slider.adaptiveHeight === undefined ? false : slider.adaptiveHeight;
        this.currentSlide = 0;
        this.status = false; // variable to detect if slide is currently runing
        this.currentPosition = 0; // variable to calculate current position of container
    }

    initSlider() {
        this.sliderCss();
        this.sliderMarkup();
        this.arrows ? this.sliderArrows() : null;
        this.autoplay ? this.sliderAutoplay() : null;
        this.pauseOnHover ? this.pauseMouseIn() : null;
    }

    sliderList;
    sliderItems;

    calcSize(container,height) {
        // Width
        let totalWidth = 0;
        // check if container has border
        // const border = window.getComputedStyle(this.container).borderWidth;
        // let borderWidth = border.match(/\d+/)[0];
        // borderWidth = parseInt(borderWidth);
        // this.currentPosition = borderWidth;
        // first add width to children
        [...container.children].forEach(item => {
            item.style.width = `${this.sliderWidth}px`;
            totalWidth += this.sliderWidth;
        });
        // then add border width to slide width
        // this.sliderList.style.left = `-${borderWidth}px`;
        this.sliderList.style.left = `0px`;

        container.style.width = `${totalWidth}px`;
    }

    responsive() {
        // on start wrong ?

        window.onresize = () => {
            // get container width
            const width = this.container.offsetWidth;
            // add it to children
            this.sliderWidth = width;
            const container = document.querySelector('.slider-list');
            this.calcSize(container);
            
            // const children = [...document.querySelectorAll('.slider-item')];
            // children.forEach(child => {
            //     child.style.width = `${width}px`;
            // });
            // console.log(this.sliderWidth);
            // update current position
        };
    }

    sliderCss() {
        const head = document.getElementsByTagName('HEAD')[0];
        const link = document.createElement('link');
        link.rel = 'stylesheet';  
        link.type = 'text/css'; 
        link.href = 'slider.css';  
        head.appendChild(link);   
    }

    sliderMarkup() {
        this.container.classList.add('slider-container');
        const children = this.container.childNodes;
        let height = new Number();

        // Container setup
        const sliderList = document.createElement('div');
        sliderList.classList.add('slider-list');

        [...this.children].forEach( child => {
            // Get highest child
            child.offsetHeight > height ? height = child.offsetHeight : height = height;
            sliderList.appendChild(child);
        });

        this.container.innerHTML = '';
        this.container.appendChild(sliderList);

        this.sliderList = sliderList;

        sliderList.style.transitionDuration = '.01s'; // for immediately slider rearange
        
        setTimeout(() => { // if this run immediately, children will move based on slider speed
            this.sliderList.style.transitionDuration = `${this.slideSpeed / 1000}s`;
        }, 1);

        this.calcSize(sliderList,height);

        // Children setup
        let c = 0;
        [...sliderList.children].forEach( child => {
            child.classList.add('slider-item');
            child.setAttribute('data-slide', c);
            c++;
        });

        this.sliderItems = [...document.querySelectorAll('.slider-item')]; 

        // height on start if adaptive height then height of first slider if not highest child
        this.adaptiveHeight ? this.container.style.height = `${this.sliderItems[this.currentSlide].offsetHeight}px` : this.container.style.height = `${height}px`;

        this.responsive();
    }

    sliderArrows() {
        const markup = `
        <div class="slider-arrows-container">
            <i class="slider-arrow slider-arrow-right"></i>
            <i class="slider-arrow slider-arrow-left"></i>
        </div>
        `;
        this.container.insertAdjacentHTML('afterbegin', markup);

        const right = document.querySelector('.slider-arrow-right'),
              left  = document.querySelector('.slider-arrow-left');

        [right,left].forEach( arrow => {
            arrow.addEventListener('click', () => {
                arrow.classList.contains('slider-arrow-right') ? this.slide('next') : this.slide('previous');
            });
        });
    }

    slide(to) {
        // detect if sliding is currently runing
        if(this.status) {
            return;
        }
        this.status = true;

        to === undefined ? to = 'next' : to;

        //direction can only be next and previous
        if(to !== 'next') { 
            if(to !== 'previous') {
                this.status = false;
                throw new Error('\n Slider direction invalid. \n Direction can be next or previous');
            }
        };

        if(to === 'next') { 
            if(this.currentSlide < this.sliderItems.length - 1) {
                this.currentPosition += this.sliderWidth;
                this.sliderList.style.left = `-${this.currentPosition}px`;
                this.currentSlide ++;
            } 
        } 
        else if(to === 'previous'){ 
            if(this.currentSlide > 0) {
                this.currentPosition -= this.sliderWidth;
                this.sliderList.style.left = `-${this.currentPosition}px`;
                this.currentSlide --;
            } 
        }

        setTimeout(() => {
            this.status = false;
            // at end of animation change height
            this.adaptiveHeight ? this.container.style.height = `${this.sliderItems[this.currentSlide].offsetHeight}px` : null;
        }, this.slideSpeed);
    }

    sliderAutoplay() {
        // if autoplay status is > 0 its runing
        if(this.autoplayStatus > 0) {
            clearInterval(this.autoplayStatus);
            this.autoplayStatus = 0;
        } else {
            this.autoplayStatus = setInterval(() => {
                // check if last slider -> go back
                this.slide();
                // check if first slider -> go forward
            }, this.autoplaySpeed);
        } 
    }

    pauseMouseIn() {
        if(!this.autoplay) return;

        ['mouseover','mouseout'].forEach( event => {
            this.sliderList.addEventListener(event, () => {
                this.sliderAutoplay();

            });
        });
    }
}