// Some Common use functions.
function copyText() {
    console.log("Copied Text");
    // // Get the text field
    // var copyText = document.getElementById("myInput");

    // // Select the text field
    // copyText.select();
    // copyText.setSelectionRange(0, 99999); // For mobile devices

    // // Copy the text inside the text field
    // navigator.clipboard.writeText(copyText.value);

    // // Alert the copied text
    // alert("Copied the text: " + copyText.value);
}


//Creating a Profile Component.
var Profile = function () {
    this.profile = null;

    this.getActiveTheme = function () {
        // here fetching information about active theme.
        var root = document.querySelector(':root');
        var active_theme = root.style.getPropertyValue("--active-theme");
        return active_theme;
    }

    this.reload = () => {
        // here reloading the author image based on theme actived.
        author_image = document.querySelector("#author-image");
        active_theme = this.getActiveTheme();
        author_image.setAttribute("src", this.profile.profile_images[active_theme]);
    }

    this.load = function (profile) {
        // here fetching the active theme.
        active_theme = this.getActiveTheme();

        // here profile jason data will get stored for further uses.
        this.profile = profile;

        // fetching component from webpage.
        author_name = document.querySelector(".author-name");
        designation = document.querySelector(".designation");
        description = document.querySelector("#about-author");
        author_image = document.querySelector("#author-image");
        social_links = document.querySelector("#social");

        // Here setting up inner text of above component.
        authorName = ""
        for (index in profile.name) {
            if (profile.name[index] === " ") {
                authorName += " "
            }
            else {
                authorName += `<span>${profile.name[index]}</span>`;
            }
        }
        author_name.innerHTML = authorName;


        designation.innerText = profile.designation;
        description.innerText = profile.description;
        author_image.setAttribute("src", profile.profile_images[active_theme]);

        social_media = profile.social_media;
        social_media.forEach(element => {
            var herf = document.createElement("a");
            herf.setAttribute("href", element.link);
            herf.setAttribute("target", element.target);
            herf.innerHTML = `<i class="${element.icon}">`
            social_links.append(herf);
        });
    }

}

// Creating an percentage based carousel semulator.
var PercentageCarosuleSimulator = function (container, containerHeight) {
    this.container = container;
    this.containerHeight = containerHeight;
    // this.previousButton = previousButton;
    // this.nextButton = nextButton;

    // slide position.
    this.sliderPosition = 0;

    this.removePerFromNumbers = function (str) {
        return str.slice(0, str.length - 1);
    }

    this.onNextPressed = () => {
        let firstSlidePosition = parseInt(this.removePerFromNumbers(this.container.children[0].style.transform.split(",")[0].slice(10, 15)));

        if (firstSlidePosition > -(100 * (this.container.children.length - 1))) {

            this.sliderPosition -= 1;
            tempIndex = this.sliderPosition;

            for (var index of Array(this.container.children.length).keys()) {

                var element = this.container.children[index];

                element.style.position = "absolute";
                element.style.top = "50%";

                element.style.transform = `translate(${tempIndex * 100}%, -50%)`;

                tempIndex += 1;

            }

        }
        console.log("Next Press Working");
    }

    this.onPreviousPressed = () => {
        let firstSlidePosition = parseInt(this.removePerFromNumbers(this.container.children[0].style.transform.split(",")[0].slice(10, 15)));

        if (firstSlidePosition < 0) {

            this.sliderPosition += 1;
            tempIndex = this.sliderPosition;

            for (var index of Array(this.container.children.length).keys()) {

                var element = this.container.children[index];

                element.style.position = "absolute";
                element.style.top = "50%";

                element.style.transform = `translate(${tempIndex * 100}%, -50%)`;

                tempIndex += 1;

            }

        }
        console.log("Previous Press Working");
    }

    this.__init__ = function () {
        // here adding elevent listner on buttons.
        // if (this.nextButton !== null) {
        //     this.nextButton.addEventListener("click", this.onNextPressed);
        // }

        // if (this.previousButton !== null) {
        //     this.previousButton.addEventListener("click", this.onPreviousPressed);
        // }

        // here setting up relative postion on container.
        this.container.style.position = "relative";

        // here setting up absolute position on all children so that i can move.
        this.sliderPosition = 0;
        tempIndex = this.sliderPosition;

        for (var index of Array(this.container.children.length).keys()) {

            var element = this.container.children[index];

            element.style.position = "absolute";
            element.style.top = "50%";

            element.style.transform = `translate(${tempIndex * 100}%, -50%)`;

            tempIndex += 1;

        }
    }

    this.__init__();
}

// Creating an carousel semulator.
var CarosuleSimulator = function (container, gap, vertically_center = true, top_bottom_gap = 0, previousButton = null, nextButton = null, front_space = 0, back_space = 0) {
    this.top_bottom_gap = top_bottom_gap;
    this.slides = [];
    this.translateY = 0;
    this.container = container;
    this.vertically_center = vertically_center;
    this.gap = gap;

    this.sliders_width = 0;

    this.nextButton = nextButton;
    this.previousButton = previousButton;
    this.front_space = front_space;
    this.back_space = back_space;

    this.isSliding = false;
    this.screenX = null;
    this.screenY = null;

    this.onMouseMove = (event) => {
        try {
            if (event.sourceCapabilities.firesTouchEvents) {
                this.screenX = event.touches[0].screenX;
                this.screenY = event.touches[0].screenY;
            }
            else {
                this.screenX = event.screenX;
                this.screenY = event.screenY;
            }
        } catch (e) {
            this.onSlideScrollDeactive();
        }
    }

    this.removePxFromNumbers = function (str) {
        return str.slice(0, str.length - 2);
    }

    this.onSlideScrollActive = (event) => {
        this.isSliding = true;
        this.onSlide(event);

    }

    this.onSlideScrollDeactive = () => {
        this.isSliding = false;
        this.screenX = null;
        this.screenY = null;
    }

    this.onSlide = (event) => {
        var coordinates = [];

        try {

            if (event.sourceCapabilities.firesTouchEvents)
                var active_position_x = event.touches[0].screenX;
            else
                var active_position_x = event.screenX;

        } catch (e) {
            return;
        }

        // here adding a overlay layer to stop hover effact.
        var overlay = document.createElement("div");
        overlay.setAttribute("style", "width: 100%; height: 100%; background-color: ##ffffff00; position: absolute;");
        this.container.append(overlay);


        for (index in this.slides) {
            coordinates.push(this.slides[index].translateX);
            this.slides[index].element.style.transition = "none";
        }

        var previous_slide_value = 0;
        var slidingDirection = null;

        // Here getting container width to stop over slide element.
        var container_width = this.getContainerWidth();

        const slide_interval = setInterval(() => {

            if (this.screenX != null && this.screenY != null) {

                var slide_value = active_position_x - this.screenX;

                if (slide_value !== previous_slide_value) {

                    if (slide_value > 0) {

                        // Sliding Left Side.
                        if (!((coordinates[coordinates.length - 1] + this.slides[this.slides.length - 1].width + this.back_space) - slide_value < container_width)) {
                            for (index in this.slides) {
                                this.slides[index].translateX = coordinates[index] - slide_value;
                                this.slides[index].element.style.transform = `translate(${this.slides[index].translateX}px, ${this.translateY}%)`;
                            }

                            slidingDirection = "left";
                        }
                    }
                    else if (slide_value < 0) {

                        // Sliding right side.
                        slide_value = slide_value * -1;

                        if (!(coordinates[0] + slide_value > 0 + this.front_space)) {
                            for (index in this.slides) {
                                this.slides[index].translateX = coordinates[index] + slide_value;
                                this.slides[index].element.style.transform = `translate(${this.slides[index].translateX}px, ${this.translateY}%)`;
                            }

                            slidingDirection = "right";
                        }

                    }
                }


            }

            if (!this.isSliding) {

                for (index in this.slides) {
                    this.slides[index].element.style.transition = null;
                }

                this.container.removeChild(overlay);
                clearInterval(slide_interval);

                if (slidingDirection !== null) {
                    if (slidingDirection === "left") {
                        this.onPreviousPressed();
                    }
                    else {
                        this.onNextPressed();
                    }
                }
            }

        }, 1);
    }

    this.onNextPressed = () => {
        var first_slide = null;
        var container_width = this.getContainerWidth();

        for (var index of Array(this.slides.length).keys()) {
            element = this.slides[this.slides.length - index - 1];
            if (element.translateX < 0) {
                first_slide = element;
                break;
            }
        }

        if (first_slide !== null) {

            if (parseInt(first_slide.width + (first_slide.width / 2)) > container_width) {
                var gap = (0 + parseInt((container_width - first_slide.width) / 2)) - element.translateX;
            }
            else {
                var gap = (0 + this.front_space) - first_slide.translateX;
            }

            for (var index of Array(this.slides.length).keys()) {
                element = this.slides[index];
                element.translateX += gap;
                element.element.style.transform = `translate(${element.translateX}px, ${this.translateY}%)`;
            }

        }

        this.onContainerResize();
    }

    this.onPreviousPressed = () => {
        var last_slide = null;
        var container_width = this.getContainerWidth();

        for (var index of Array(this.slides.length).keys()) {
            element = this.slides[index];
            if (element.translateX + element.width + this.back_space > container_width) {
                last_slide = element;
                break;
            }
        }

        if (last_slide !== null) {

            if (parseInt(last_slide.width + (last_slide.width / 2)) > container_width) {
                var gap = element.translateX - parseInt((container_width - last_slide.width) / 2);
            }
            else {
                var gap = (last_slide.translateX + last_slide.width + this.back_space) - container_width;
            }

            for (var index of Array(this.slides.length).keys()) {
                element = this.slides[index];
                element.translateX -= gap;
                element.element.style.transform = `translate(${element.translateX}px, ${this.translateY}%)`;
            }
        }
    }

    this.getContainerWidth = () => {
        var container_width = window.getComputedStyle(this.container).width;
        container_width = parseInt(this.removePxFromNumbers(container_width));
        return container_width;
    }

    this.getContainerHeight = () => {
        var container_height = window.getComputedStyle(this.container).height;
        container_height = parseInt(this.removePxFromNumbers(container_height));
        return container_height;
    }

    this.onContainerResize = () => {
        if (this.slides.length > 0) {

            var container_width = this.getContainerWidth();
            var starting_slide = this.slides[0];
            var last_slide = this.slides[this.slides.length - 1];

            if (this.nextButton !== null && this.previousButton !== null) {

                if (last_slide.translateX + last_slide.width <= container_width && starting_slide.translateX >= 0) {
                    this.nextButton.style.display = "none";
                    this.previousButton.style.display = "none";
                }
                else {
                    this.nextButton.style.display = "flex";
                    this.previousButton.style.display = "flex";
                }
            }
        }
    }

    this.__init__ = function () {
        // here adding elevent listner on buttons.
        if (this.nextButton !== null) {
            this.nextButton.addEventListener("click", this.onNextPressed);
        }

        if (this.previousButton !== null) {
            this.previousButton.addEventListener("click", this.onPreviousPressed);
        }

        window.addEventListener("resize", this.onContainerResize);
        this.container.addEventListener("mousedown", this.onSlideScrollActive);
        this.container.addEventListener("mouseup", this.onSlideScrollDeactive);

        this.container.addEventListener("touchstart", this.onSlideScrollActive);
        this.container.addEventListener("touchend", this.onSlideScrollDeactive);

        this.container.addEventListener("mouseleave", this.onSlideScrollDeactive);

        window.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("touchmove", this.onMouseMove);

        // here setting up relative postion on container.
        this.container.style.position = "relative";

        // here setting up the translate Y property, if vertically_center is true then it move toword center.
        if (this.vertically_center) {
            this.translateY = -50;
        }

        // here setting up absolute position on all children so that i can move.
        this.slide_max_height = 0;

        for (var index of Array(this.container.children.length).keys()) {

            var element = this.container.children[index];

            element.style.position = "absolute";
            if (this.vertically_center) {
                element.style.top = "50%";
            }

            var height = parseInt(this.removePxFromNumbers(window.getComputedStyle(element).height));
            if (height > this.slide_max_height) {
                this.slide_max_height = height
            }


            if (this.slides.length === 0) {

                var width = parseInt(this.removePxFromNumbers(window.getComputedStyle(element).width));
                var element_obj = { element: element, width: width, translateX: this.front_space };

                element.style.transform = `translate(${element_obj.translateX}px, ${this.translateY}%)`;
                this.slides.push(element_obj);

                this.sliders_width += width;

            }
            else {

                var width = parseInt(this.removePxFromNumbers(window.getComputedStyle(element).width));
                var element_obj = {
                    element: element, width: width,
                    translateX: this.slides[this.slides.length - 1].translateX + this.slides[this.slides.length - 1].width + this.gap
                };

                element.style.transform = `translate(${element_obj.translateX}px, ${this.translateY}%)`;
                this.slides.push(element_obj);

                this.sliders_width += width + this.gap;

            }

        }

        this.container.style.minHeight = `${this.slide_max_height + this.top_bottom_gap}px`;

        var container_width = window.getComputedStyle(this.container).width;
        container_width = parseInt(this.removePxFromNumbers(container_width));

        if (container_width > this.sliders_width) {
            if (this.nextButton !== null && this.previousButton !== null) {

                this.nextButton.style.display = "none";
                this.previousButton.style.display = "none";
            }
        }
    }
}

//Creting a Component for Services.
var Services = function () {
    this.services_jason = null;
    this.services_container = document.querySelector(".services-carousel");

    this.carosuleSimulator = new CarosuleSimulator(this.services_container, 50, true, 80,
        document.querySelector("#services-button-left"), document.querySelector("#services-button-right"),
        35, 35);

    this.load = function (services_jason) {
        this.services_jason = services_jason;

        this.services_jason.forEach((element) => {
            var inner_html = `
            <div class="card-icon">
                <i class="${element.icon}"></i>
            </div>
            <h3 class="card-heading">${element.name}</h3>
            <p class="card-description">${element.description}</p>`

            var element = document.createElement("div");
            element.setAttribute("class", "card button");
            element.innerHTML = inner_html;

            this.services_container.append(element);

        })

        this.carosuleSimulator.__init__();

    }
}

// Here creating aboutMe section component.
let AboutMe = function () {
    this.jasonData = null;

    this.load = function (jasonData) {
        this.jasonData = jasonData;

        // here setting up description.
        this.description.innerText = jasonData.description;

        // here adding all the tags.
        for (var jasonTag of jasonData.tags) {
            var tag = document.createElement("p");
            tag.classList.add("button");
            tag.innerHTML = jasonTag;
            this.tags.append(tag);
        }

        // here adding all the cards.
        for (var jasonCard of jasonData.cards) {
            var card = document.createElement("div");
            card.classList.add("card");
            card.classList.add("button");

            card.innerHTML = `
            <div class="card-icon">
                <i class="${jasonCard.icon}"></i>
            </div>
            <h3 class="card-heading">${jasonCard.name}</h3>
            <p class="card-description">${jasonCard.description}</p>
            `;

            this.cards.append(card);
        }
    }

    this.getElement = function (query) {
        return document.querySelector(query);
    }

    this.__init__ = function () {
        this.description = this.getElement(".about-me-description");
        this.tags = this.getElement(".about-me-tags");
        this.cards = this.getElement(".about-me-cards");
    }

    this.__init__();
}


// Here creating Page element it will be a Stack Widget Page that will represent each page of StackWidget.
var StackWidgetPage = function (visible_element_count = 9) {

    // this variable will represnt that how many elements will be visible on the page. and for the remaining element next button will be prepared for navigate on.
    this.visible_element_count = visible_element_count;
    this.elements = [];
    this.navigatorButtons = [];
    this.nextButton = null;
    this.isNavigatorButtonVisible = false;
    this.currentPage = 0;

    this.__init__ = function () {

        this.page = document.createElement("div");
        this.page.setAttribute("class", "stack-widget-page");
        this.page.innerHTML = `
        <div id="contentHolder" class="stack-widget-content-page">
            
        </div>

        <div id="contentNavigators" class="stack-widget-content-navigators">

        </div>`;

        this.contentHolder = this.page.querySelector("#contentHolder");
        this.contentNavigators = this.page.querySelector("#contentNavigators");

        // here setting up content Navigator hidden initialy.
        this.contentNavigators.style.visibility = "hidden";

        // Here adding next button in navigators.
        this.nextButton = document.createElement("div");
        this.nextButton.innerText = "Next";
        this.nextButton.setAttribute("class", "button stack-widget-content-navigator");
        this.nextButton.setAttribute("index", "next");

        this.nextButton.addEventListener("click", this.navigateContent);
        this.contentNavigators.append(this.nextButton);

    }

    this.addNavigatorButton = function (buttonText, index) {
        //<div class="button stack-widget-content-navigator">1</div>

        var button = document.createElement("div");
        button.innerText = buttonText;
        button.setAttribute("class", "button stack-widget-content-navigator");
        button.setAttribute("index", `${index}`);

        button.addEventListener("click", this.navigateContent);

        this.contentNavigators.insertBefore(button, this.nextButton);
        this.navigatorButtons.push(button);
        return button;
    }

    this.getRangeOfCurrentPage = (customCurrentPage = null) => {
        if (customCurrentPage !== null) {
            return {
                start: this.visible_element_count * customCurrentPage,
                end: (this.visible_element_count * customCurrentPage) + this.visible_element_count - 1
            };
        }
        else {
            return {
                start: this.visible_element_count * this.currentPage,
                end: (this.visible_element_count * this.currentPage) + this.visible_element_count - 1
            };
        }
    }

    this.reManageNavigatorButton = () => {

    }

    this.addElement = function (element) {
        this.elements.push(element);
        var index = this.elements.indexOf(element);
        var currentRage = this.getRangeOfCurrentPage();
        if (index >= currentRage.start && index <= currentRage.end) {
            this.contentHolder.append(element);
        }

        // here adding buttons.
        var lastButton = 0;
        if (this.elements.length % this.visible_element_count > 0)
            lastButton += 1;
        lastButton += parseInt(this.elements.length / this.visible_element_count);

        if (lastButton > this.navigatorButtons.length) {
            this.addNavigatorButton(`${lastButton}`, `${lastButton - 1}`);

            if (this.navigatorButtons.length >= 2 && (!this.isNavigatorButtonVisible)) {
                this.contentNavigators.style.visibility = "visible";
                this.isNavigatorButtonVisible = true;
                this.navigatorButtons[this.currentPage].classList.add("stack-widget-navigator-active");
            }
        }

    }

    this.navigateContent = (event) => {
        newPageIndex = event.currentTarget.getAttribute("index");
        if (newPageIndex === "next") {
            newPageIndex = this.currentPage + 1;
        }
        else {
            newPageIndex = parseInt(newPageIndex);
        }
        newRange = this.getRangeOfCurrentPage(newPageIndex);

        if (newRange.start >= 0 && newRange.start < this.elements.length) {

            this.contentHolder.innerHTML = "";
            this.navigatorButtons[this.currentPage].classList.remove("stack-widget-navigator-active");
            this.currentPage = newPageIndex;
            this.navigatorButtons[this.currentPage].classList.add("stack-widget-navigator-active");

            index = newRange.start;
            while (index <= newRange.end && index < this.elements.length) {
                this.contentHolder.append(this.elements[index]);
                index += 1;
            }
        }
    }

    this.__init__();

}


// Here Creating a Stack Widget that will help to switch between diffrent pages.
var StackWidget = function (container) {
    this.container = container;

    // exactly not a constructor function but it will act like a constructor function.
    this.__init__ = function () {

        // this list will store all the pages.
        this.pages = [];

        // this variable will the current active page.
        this.currentPage = null;

    }

    this.getPage = (index) => {
        if (index >= 0 && index < this.pages.length) {
            return this.page[index];
        }
    }

    this.switchToPage = (event) => {
        // here hiding the current active page.
        this.currentPage.page.style.display = "none";

        // here make the new active page visiable.
        var newActivePageIndex = parseInt(event.currentTarget.getAttribute("index"));
        this.currentPage = this.pages[newActivePageIndex];
        this.currentPage.page.style.display = "initial";
    }

    this.addPage = (page, buttonToSwitch) => {
        this.pages.push(page);
        this.container.append(page.page);
        buttonToSwitch.setAttribute("index", `${this.pages.indexOf(page)}`);
        buttonToSwitch.addEventListener("click", this.switchToPage);

        if (this.currentPage === null) {
            this.currentPage = page;
        }
        else {
            page.page.style.display = "none";
        }

    }

    this.__init__();
}


// Here Creating Card For Projects.
var ProjectCard = function (jasonData, readMoreCallBack = null, options = null, playVideoCallBack = null, imageViewCallBack = null) {
    this.jasonData = jasonData;
    this.options = options;
    this.readMoreCallBack = readMoreCallBack;
    this.playVideoCallBack = playVideoCallBack;
    this.imageViewCallBack = imageViewCallBack;
    this.callBackFunctionData = null;

    this.readMore = () => {
        if (this.readMoreCallBack !== null) {
            this.readMoreCallBack(this.jasonData.readMore);
        }
    }

    this.viewImages = () => {
        if (this.imageViewCallBack === null) {
            console.log("Didn't recived any call function to show image.");
            return;
        }
        this.imageViewCallBack(this.jasonData.showUp);
    }

    this.playVideo = () => {
        if (this.playVideoCallBack === null) {
            console.log("Didn't recived any call function to play video.");
            return;
        }
        this.playVideoCallBack(this.jasonData.showUp);
    }

    this.rebuildYoutubeUrl = (urk) => {

    }

    // this function will help initlize the object.
    this.__init__ = function () {
        this.card = document.createElement("div");

        if (this.options !== null && this.options.activeCardHoverEffect) {
            this.card.setAttribute("class", "projectCard projectCardSlideEffact");
        }
        else {
            this.card.setAttribute("class", "projectCard");
        }

        this.card.innerHTML = `
        <div class="projectCardHead">
                
            <img class="projectCardLogo" src="${this.jasonData.icon}" alt="">
            
            <div class="heading">
                <h3>${this.jasonData.name}</h3>
                <p>${this.jasonData.dateTime}</p>
            </div>

        </div>

        <div class="proejctCardBody">

            <p class="shortDescription">${this.jasonData.description}</p>

            <div class="projectThumbnail">

                <img class="projectThumbnailImage" src="${this.jasonData.thumbnailImage}" alt="">

                <div class="projectThumbnailType">
                    
                
                </div>

                <div class="videoPlayButton button"><i class="fa-sharp fa-solid fa-play"></i></div>

            </div>

        </div>

        <div class="projectCardFooter">
            <a herf="${this.jasonData.github}" class="projectTech"><i class="fa-brands fa-github"></i> GitHub</a>
            <a class="projectCardReadMoreButton">Read More</a>
        </div>`

        // Here Connecting Read More Button.
        this.readMoreButton = this.card.querySelector(".projectCardReadMoreButton");

        if (this.jasonData.isReadMoreLink) {
            this.readMoreButton.setAttribute("href", `${this.jasonData.readMore}`);
            this.readMoreButton.setAttribute("target", "_blank");
        }
        else {
            this.readMoreButton.addEventListener("click", this.readMore);
        }

        // Here fecting the video button from web element.
        this.videoPlayButton = this.card.querySelector(".videoPlayButton");
        this.videoPlayButton.addEventListener("click", this.playVideo)

        // Here changing the the d=media type icon based on source.
        var projectThumbnailType = this.card.querySelector(".projectThumbnailType");

        if (this.jasonData.showUpType === "images" || this.jasonData.showUpType === "image") {
            projectThumbnailType.innerHTML = `<div class="image"><i class="fa-regular fa-image"></i></div>`;
            this.videoPlayButton.style.display = "none";

            var projectThumbnailContainer = this.card.querySelector(".projectThumbnail");
            projectThumbnailContainer.addEventListener("click", this.viewImages);
            projectThumbnailContainer.style.cursor = "zoom-in";
        }
        else if (this.jasonData.showUpType === "video" || this.jasonData.showUpType === "youtube-url") {
            projectThumbnailType.innerHTML = `<div class="video"><i class="fa-solid fa-circle-play"></i></div>`;
        }

    }

    this.__init__();

}


// Here defining the object of ReadMoreViewer window.

var ReadMoreViewer = function () {
    this.jasonData = null;

    this.show = (jasonData = null) => {
        // here making this window visible.
        this.window.style.display = "initial";
        // this.window.style.opacity = "1";

        this.jasonData = jasonData;

    }

    this.hide = () => {
        // here hiding the window.
        // this.window.style.opacity = "0";
        this.window.style.display = "none";
    }

    this.__init__ = function () {
        // fetching all the element of ReadMoreViewer window.
        this.window = document.querySelector(".readMoreViewer");
        this.closeButton = document.querySelector(".readMoreViewerCloseButton");


        // Here attaching event listeners
        this.closeButton.addEventListener("click", this.hide);
    }

    this.__init__();
}

// Here creating an component for playing video that will be overlayed on top of the page.
var OverlayVideoPlayer = function (maxPlayerWidth = 1280, maxPlayerHeight = 720, margin = 10) {
    this.maxPlayerWidth = maxPlayerWidth;
    this.maxPlayerHeight = maxPlayerHeight;
    this.aspectRationHeight = this.maxPlayerHeight / this.maxPlayerWidth;
    this.aspectRationWidth = this.maxPlayerWidth / this.maxPlayerHeight;
    this.margin = margin;

    this.removePxFromNumbers = function (str) {
        return parseInt(str.slice(0, str.length - 2));
    }

    this.onWindowResize = (event) => {
        var windowWidth = event.currentTarget.innerWidth;
        var windowHeight = event.currentTarget.innerHeight;

        var videoConatinerWidth = this.removePxFromNumbers(this.videoPlayerConatiner.style.width);

        if (windowWidth < this.maxPlayerWidth + (this.margin * 2) || windowHeight < this.maxPlayerHeight + (this.margin * 2)) {

            var newPlayerWidth = windowWidth - (this.margin * 4);
            var newPlayerHeight = newPlayerWidth * this.aspectRationHeight;

            if ((newPlayerHeight + (this.margin * 2)) > windowHeight) {
                newPlayerHeight = windowHeight - (this.margin * 2);
                newPlayerWidth = newPlayerHeight * this.aspectRationWidth;
            }

            this.videoPlayerConatiner.style.width = `${newPlayerWidth}px`;
            this.videoPlayerConatiner.style.height = `${newPlayerHeight}px`;

        }
        else if (videoConatinerWidth !== this.maxPlayerWidth) {
            this.videoPlayerConatiner.style.width = `${this.maxPlayerWidth}px`;
            this.videoPlayerConatiner.style.height = `${this.maxPlayerHeight}px`;
        }
    }

    this.playVideo = (url) => {
        this.onWindowResize({ currentTarget: window });
        this.videoPlayer.setAttribute("src", url);
        this.videoViewerOverlay.style.display = "flex";
    }

    this.close = () => {
        this.videoPlayer.setAttribute("src", "");
        this.videoViewerOverlay.style.display = "none";
    }

    this.__init__ = function () {
        this.videoViewerOverlay = document.querySelector(".videoViewer");
        this.closeButton = document.querySelector("#videoViewerCloseButton");
        this.videoPlayerConatiner = document.querySelector("#videoViewerPlayerContainer");
        this.videoPlayer = document.querySelector("#videoViewerPlayer");

        window.addEventListener("resize", this.onWindowResize);
        this.closeButton.addEventListener("click", this.close);
    }

    this.__init__();
}


// here Creating and Component of Overlay Image Viewer.
var OverlayImageViewer = function () {
    this.slides = [];
    this.carosuleSimulator = null;

    this.createSlide = (image, text = null) => {

        var slide = document.createElement("div");
        // slide.style.width = `${window.innerWidth}px`;
        // slide.style.height = `${window.innerHeight}px`;

        slide.classList.add("slide");

        if (text !== null) {
            slide.innerHTML = `
            <img src="${image}" alt="">
            <div class="text">${text}</div>
            `;
        }
        else {
            slide.innerHTML = `
            <img src="${image}" alt="">
            `;
        }

        return slide;
    }

    this.onNextPressed = (event) => {
        if (this.carosuleSimulator !== null) {
            this.carosuleSimulator.onNextPressed();
        }
        event.stopPropagation();
    }

    this.onPreviousPressed = (event) => {
        if (this.carosuleSimulator !== null) {
            this.carosuleSimulator.onPreviousPressed();
        }
        event.stopPropagation();
    }

    this.removeAllSlides = () => {
        this.imageViewerConatiner.innerHTML = "";
        this.slides = [];
    }

    this.showNavigationButtons = () => {
        this.navigationButtons.style.display = null;
    }

    this.hideNavigationButtons = () => {
        this.navigationButtons.style.display = "none";
    }

    this.show = () => {
        this.imageViewerOverlay.style.display = "initial";
    }

    this.close = () => {
        this.imageViewerOverlay.style.display = "none";
    }

    this.viewImages = (images) => {
        // Here removing all the content added before.
        this.removeAllSlides();

        if (typeof (images) === 'string') {

            this.hideNavigationButtons();
            this.carosuleSimulator = null;

            var slide = this.createSlide(images);
            this.slides.push(slide);
            this.imageViewerConatiner.append(slide);

        }
        else {

            for (var jasonSlide of images) {
                var slide = this.createSlide(jasonSlide.image, jasonSlide.text);
                this.slides.push(slide);
                this.imageViewerConatiner.append(slide);
            }

            if (images.length === 1) {

                this.hideNavigationButtons();
            }
            else if (images.length > 1) {
                this.carosuleSimulator = new PercentageCarosuleSimulator(this.imageViewerConatiner, 265, this.navigationLeft, this.navigationRight);

                this.carosuleSimulator.__init__();
            }
        }

        this.show();
    }

    this.__init__ = function () {
        this.imageViewerOverlay = document.querySelector(".imageViewer");
        this.closeButton = document.querySelector("#imageViewerCloseButton");
        this.imageViewerConatiner = document.querySelector("#imageViewerSlidesContainer");

        this.navigationButtons = document.querySelector(".imageViewerLeftRightButtons");
        this.navigationLeft = document.querySelector("#imageViewerLeftButton");
        this.navigationRight = document.querySelector("#imageViewerRightButton");
        this.leftButtonContainer = document.querySelector(".leftButtonContainer");
        this.rightButtonConatiner = document.querySelector(".rightButtonConatiner");

        // here connecting buttons.
        this.closeButton.addEventListener("click", this.close);
        this.navigationRight.addEventListener("click", this.onNextPressed);
        this.navigationLeft.addEventListener("click", this.onPreviousPressed);

        this.rightButtonConatiner.addEventListener("click", this.onNextPressed);
        this.leftButtonContainer.addEventListener("click", this.onPreviousPressed);
    }

    this.__init__();
}

// Here creating component for main menu.
var MainMenu = function () {
    this.jasonData = null;

    this.showMobileMenu = () => {
        this.mobileMenuOptions.style.top = "0%";
    }

    this.hideMobileMenu = () => {
        this.mobileMenuOptions.style.top = null;
    }

    this.load = (jasonData) => {
        this.jasonData = jasonData;

    }

    this.__init__ = function () {
        this.mobileMenuShowButton = document.querySelector(".mobile-menu-button");
        this.mobileMenuHideButton = document.querySelector(".mobile-menu-optins-close-btn");
        this.mobileMenuOptions = document.querySelector(".mobile-menu-optins");

        // Here connecting button with function.
        this.mobileMenuShowButton.addEventListener("click", this.showMobileMenu);
        this.mobileMenuHideButton.addEventListener("click", this.hideMobileMenu);

    }

    this.__init__();

}


// Here creating A Component for Portfolio that will help to show all the projects.
var Protfolio = function () {
    this.jasonData = null;
    this.projectPageButtons = [];
    this.activePageButton = null;
    this.projectCards = [];
    this.readMoreViewer = new ReadMoreViewer();
    this.overlayVideoPlayer = new OverlayVideoPlayer();
    this.overlayImageViewer = new OverlayImageViewer();

    // in this __init__ function will initlize the object.
    this.__init__ = function () {
        this.heading = document.querySelector("#portfolioHeading");
        this.description = document.querySelector("#portfolioDescription");

        this.projectPageButtonsContainer = document.querySelector("#project-page-buttons");
        this.stackWigetContainer = document.querySelector("#stackWidgetContainer");

        // here created the object stack widget that will all the pages and will only page at a time.
        this.stackWidget = new StackWidget(this.stackWigetContainer);

    }

    this.onPageChnage = (event) => {
        if (this.activePageButton !== null) {
            this.activePageButton.classList.remove("project-active-btn");
        }

        this.activePageButton = event.currentTarget;
        event.currentTarget.classList.add("project-active-btn");
    }

    this.load = function (jasonData) {
        this.jasonData = jasonData;

        var heading_words = this.jasonData.heading.split(" ");
        var headingText = ""
        for (word of heading_words.slice(0, heading_words.length - 1)) {
            headingText += `${word} `;
        }
        if (heading_words.length > 1) {
            headingText += `<span class="primary">${heading_words[heading_words.length - 1]}</span>`;
        }

        this.heading.innerHTML = headingText;
        this.description.innerText = this.jasonData.description;

        this.jasonData.projects.forEach((page) => {

            // Here creating the page navigator button.
            var button = document.createElement("div");
            if (this.projectPageButtons.length === 0) {
                button.setAttribute("class", "button project-btn project-active-btn");
                this.activePageButton = button;
            }
            else {
                button.setAttribute("class", "button project-btn");
            }

            button.innerText = `${page.name}`;
            button.addEventListener("click", this.onPageChnage);
            this.projectPageButtonsContainer.append(button);
            this.projectPageButtons.push(button);

            // Here Creating Page and this page will be added to stackWidget.
            var stack_widget_page = new StackWidgetPage(6);

            page.projects.forEach((projectJason) => {
                var projectCard = new ProjectCard(projectJason, this.readMoreViewer.show, this.jasonData.options, this.overlayVideoPlayer.playVideo, this.overlayImageViewer.viewImages);
                stack_widget_page.addElement(projectCard.card);
                this.projectCards.push(projectCard);
            });

            this.stackWidget.addPage(stack_widget_page, button);

        });

    }

    this.__init__();
}

// here creating component to manage skills.
var Skills = function () {
    this.jasonData = null;

    this.load = function (jasonData) {
        this.jasonData = jasonData;

        this.description.innerText = this.jasonData.description;

        // Here adding card to decription.
        for (var jasoncard of this.jasonData.cards) {
            card = document.createElement("div");
            card.classList.add("skillCard");

            card.innerHTML = `
            <div class="content">
                <img src="${jasoncard.icon}" alt="">
                <p class="percentage">${jasoncard.percentage}%</p>
                <!-- <i class="fa-brands fa-square-js"></i> -->
                <p>${jasoncard.name}</p>
            </div>
            <div id="water" class="water" style="transform: translate(0, ${100 - jasoncard.percentage}%);">
                <svg viewBox="0 0 560 20" class="water_wave water_wave_back">
                    <use xlink:href="#wave"></use>
                </svg>
                <svg viewBox="0 0 560 20" class="water_wave water_wave_front">
                    <use xlink:href="#wave"></use>
                </svg>
            </div>
            `;

            this.cards.append(card);
        }

        // Here applying carousel Simulation.
        this.carosuleSimulator.__init__();

    }

    this.__init__ = function () {
        this.description = document.querySelector("#skillsDescription");
        this.cards = document.querySelector(".skillCardsContainer");
        this.leftButton = document.querySelector(".skillsLeftButton");
        this.rightButton = document.querySelector(".skillsRightButton");

        this.carosuleSimulator = new CarosuleSimulator(this.cards, 20, true, 100, this.rightButton, this.leftButton);
    }

    this.__init__();
}

// here creating component to manage experiences.
var Experiences = function () {

    this.load = function (jasonData) {
        this.jasonData = jasonData;
        // this.description.innerText = jasonData.description;

        this.carosuleSimulator.__init__();
    }

    this.__init__ = function () {
        this.description = document.querySelector("#experiencesDescription");
        this.cards = document.querySelector(".timelineCards");
        this.leftButton = document.querySelector(".timelineLeftButton");
        this.rightButton = document.querySelector(".timelineRightButton");

        this.carosuleSimulator = new CarosuleSimulator(this.cards, 0, true, 331, this.rightButton, this.leftButton);
    }

    this.__init__();
}

// Here created theme manager that will help to setup theme.

var ThemeManager = function () {
    this.jasonData = null;

    this.load = function (jasonData) {
        this.jasonData = jasonData;

        // Here loading the default theme.
        active_theme = this.jasonData["website-info"]["active-theme"]
        theme = this.jasonData.themes[active_theme]

        var root = document.querySelector(':root');

        for (key in theme) {
            root.style.setProperty("--" + key, theme[key]);
        }

        root.style.setProperty("--active-theme", active_theme);
    }

    this.setTheme = (name) => {
        theme = this.jasonData.themes[name]

        var root = document.querySelector(':root');

        for (key in theme) {
            root.style.setProperty("--" + key, theme[key]);
        }

        root.style.setProperty("--active-theme", name);
    }

    this.getActiveTheme = () => {
        var root = document.querySelector(':root');
        return root.style.getPropertyValue("--active-theme");
    }

}

// Here Creating the element to manage the floating menu that will will to chnage the theme and cisit some link.
var FloatingMenu = function (themeManager) {
    this.jasonData = null;
    this.themeManager = themeManager;
    this.activeThemeButton = null;
    this.reloadComponentOnThemeChnage = [];

    this.onThemeChnage = (event) => {
        let theme = event.currentTarget.getAttribute("index");
        this.themeManager.setTheme(theme);

        // here changing the state of the button.
        this.activeThemeButton.classList.remove("fmb-active");

        this.activeThemeButton = event.currentTarget;
        this.activeThemeButton.classList.add("fmb-active");

        for (var component of this.reloadComponentOnThemeChnage) {
            component.reload();
        }
    }

    this.reloadOnThemeChnage = function (component) {
        this.reloadComponentOnThemeChnage.push(component);
    }

    this.load = function (jasonData) {
        this.jasonData = jasonData;

        let activeTheme = this.themeManager.getActiveTheme();

        // here adding theme buttons.
        for (var jasonButton of this.jasonData.themeButton) {
            let button = document.createElement("div");
            button.setAttribute("index", jasonButton.theme);
            if (jasonButton.theme == activeTheme) {
                button.classList.add("floating-menu-button");
                button.classList.add("fmb-active");
                this.activeThemeButton = button;
            }
            else {
                button.classList.add("floating-menu-button");
            }

            button.innerHTML = `<i class="${jasonButton.icon}"></i>`;

            // Here connecting the button with a function to chnage theme.
            button.addEventListener("click", this.onThemeChnage);

            this.body.append(button);
        }

        // here adding the gap element.
        var gap = document.createElement("div");
        gap.classList.add("gap");
        this.body.append(gap);

        // here adding quick links.
        for (var jasonlink of this.jasonData.quickLinks) {
            let link = document.createElement("a");
            link.setAttribute("target", "_blank");
            link.setAttribute("href", jasonlink.link);

            link.innerHTML = `
            <div class="floating-menu-link">
                <i class="${jasonlink.icon}"></i>
            </div>
            `;

            this.body.append(link);
        }


        // here again adding the gap element in the footer.
        var gap = document.createElement("div");
        gap.classList.add("gap");
        this.footer.append(gap);

        // here adding the author icon.
        let authorIcon = document.createElement("img");
        authorIcon.setAttribute("src", this.jasonData.authorIcon);
        this.footer.append(authorIcon);

    }

    this.openCloseMenu = () => {

        if (this.menu.classList.contains("floating-menu-active")) {
            this.menu.classList.remove("floating-menu-active");
        }
        else {
            this.menu.classList.add("floating-menu-active");
        }
    }

    this.__init__ = function () {
        this.menu = document.querySelector(".floating-menu");
        this.closeButton = document.querySelector(".floating-menu-close-button");
        this.body = document.querySelector(".floating-menu-body");
        this.footer = document.querySelector(".floating-menu-footer");

        // here connecting buttons.
        this.closeButton.addEventListener("click", this.openCloseMenu);
    }

    this.__init__();
}

// Here's a Data Parser is being created that will help to parse all the data from jason file.

var DataLoader = function (file) {
    this.data_file = file
    this.profile = new Profile();
    this.services = new Services();
    this.protfolio = new Protfolio();
    this.mainMenu = new MainMenu();
    this.themeManager = new ThemeManager();
    this.floatingMenu = new FloatingMenu(this.themeManager);
    this.aboutMe = new AboutMe();
    this.skills = new Skills();
    this.experiences = new Experiences();

    this.loadData = function () {
        fetch(this.data_file)
            .then(response => response.json())
            .then(data => {

                // here loading the theme.
                this.themeManager.load(data);

                // here setting up the main menu options.
                this.mainMenu.load(data["mainMenu"]);

                // Here setting up profile data.
                this.profile.load(data["author-info"]);

                // Here loading info of about me.
                this.aboutMe.load(data["aboutMe"]);

                // Here Setting up the services section.
                this.services.load(data["services"]);

                // Here loading the portfolio.
                this.protfolio.load(data["protfolio"]);

                // Here loading the floating menu.
                this.floatingMenu.load(data["themeMenu"]);
                this.floatingMenu.reloadOnThemeChnage(this.profile);

                // Here loading all the skills.
                this.skills.load(data["skills"]);

                //here loading skill slides.
                this.experiences.load(null);

            });

    }

}

// // setting up theme.
// const theme_manager = new ThemeManager("./data/data.json");
// theme_manager.loadDeafultTheme()

// Here Loading data.
const data_loader = new DataLoader("./data/data.json");
data_loader.loadData();

// Here setting up a call back on wbpage loaded.
window.onload = function () {

    // Here fetching all the element using copy-link class in html and setting up call back function to copy the inner text.
    var anchors = document.querySelectorAll('.copy-link');
    for (var i = 0; i < anchors.length; i++) {
        var anchor = anchors[i];
        anchor.addEventListener("click", copyText);
    }
}
