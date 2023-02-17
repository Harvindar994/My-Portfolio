//Creating a Profile Component.
var Profile = function () {
    this.profile = null;

    this.load = function (profile, active_theme) {
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
    this.screenX = 0;
    this.screenY = 0;

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
            this.screenX = event.screenX;
            this.screenY = event.screenY;
            console.log(e.message)
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

        // Here getting container width to stop over slide element.
        var container_width = this.getContainerWidth();

        const slide_interval = setInterval(() => {

            var slide_value = active_position_x - this.screenX;

            if (slide_value !== previous_slide_value) {

                if (slide_value > 0) {

                    // Sliding Left Side.
                    if (!((coordinates[coordinates.length - 1] + this.slides[this.slides.length - 1].width + this.back_space) - slide_value < container_width)) {
                        for (index in this.slides) {
                            this.slides[index].translateX = coordinates[index] - slide_value;
                            this.slides[index].element.style.transform = `translate(${this.slides[index].translateX}px, ${this.translateY}%)`;
                        }
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
                    }

                }
            }

            if (!this.isSliding) {

                for (index in this.slides) {
                    this.slides[index].element.style.transition = null;
                }

                this.container.removeChild(overlay);
                clearInterval(slide_interval);
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

            var gap = (0 + this.front_space) - first_slide.translateX;

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
            if (element.translateX + element.width >= container_width) {
                last_slide = element;
                break;
            }
        }

        if (last_slide !== null) {

            var gap = (last_slide.translateX + last_slide.width + this.back_space) - container_width;
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
            this.nextButton.style.display = "none";
            this.previousButton.style.display = "none";
        }

    }
}

//Creting a Component for Services.
var Services = function () {
    this.services_jason = null;
    this.services_container = document.querySelector(".services-carousel");

    this.carosuleSimulator = new CarosuleSimulator(this.services_container, 50, true, 80,
        document.querySelector("#services-button-left"), document.querySelector("#services-button-right"),
        36, 36);

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
var ProjectCard = function (jasonData, readMoreCallBack = null, options = null) {
    this.jasonData = jasonData;
    this.options = options;
    this.readMoreCallBack = readMoreCallBack;
    this.callBackFunctionData = null;

    this.readMore = () => {
        if (this.readMoreCallBack !== null) {
            this.readMoreCallBack(this.jasonData.readMore);
        }
        console.log("Read More Working");
    }

    this.viewImages = () => {
        console.log("View Image Function is Working");
    }

    this.playVideo = () => {
        console.log("Video Play Working");
    }

    // this function will help initlize the object.
    this.__init__ = function () {

        // this.card = document.createElement("div");
        // this.card.setAttribute("class", "project-card button");

        // this.card.innerHTML = `
        // <img src="${this.jasonData.image}" alt="">

        // <p class="technology">${this.jasonData.technology}</p>

        // <div class="info">

        //     <div class="project-card-icon">
        //         <i class="${this.jasonData.icon}"></i>
        //     </div>
        //     <h3 class="project-card-heading">${this.jasonData.name}</h3>
        //     <p class="project-card-description">${this.jasonData.description}</p>

        //     <a id="read-more-link"><div class="view-button button">Read More</div></a>

        // </div>`;

        // this.readMoreButton = this.card.querySelector("#read-more-link");

        // if (this.jasonData.isReadMoreLink) {
        //     this.readMoreButton.setAttribute("href", `${this.jasonData.readMore}`);
        //     this.readMoreButton.setAttribute("target", "_blank");
        // }
        // else {
        //     this.readMoreButton.addEventListener("click", this.readMore);
        // }

        // For Version 2.
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

        if (this.jasonData.showUpType === "image" || this.jasonData.showUpType === "images") {
            projectThumbnailType.innerHTML = `<div class="image"><i class="fa-regular fa-image"></i></div>`;
            this.videoPlayButton.style.display = "none";

            var projectThumbnailContainer = this.card.querySelector(".projectThumbnail");
            projectThumbnailContainer.addEventListener("click", this.viewImages);
            projectThumbnailContainer.style.cursor = "zoom-in";
        }
        else if (this.jasonData.showUpType === "video") {
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


// Here creating A Component for Portfolio that will help to show all the projects.
var Protfolio = function () {
    this.jasonData = null;
    this.projectPageButtons = [];
    this.activePageButton = null;
    this.projectCards = [];
    this.readMoreViewer = new ReadMoreViewer();

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
                var projectCard = new ProjectCard(projectJason, this.readMoreViewer.show, this.jasonData.options);
                stack_widget_page.addElement(projectCard.card);
                this.projectCards.push(projectCard);
            });

            this.stackWidget.addPage(stack_widget_page, button);

        });

    }

    this.__init__();
}

// Here's a Data Parser is being created that will help to parse all the data from jason file.

var DataLoader = function (file) {
    this.data_file = file
    this.profile = new Profile();
    this.services = new Services();
    this.protfolio = new Protfolio();

    this.loadData = function () {
        fetch(this.data_file)
            .then(response => response.json())
            .then(data => {

                // here fetching information about active theme.
                var root = document.querySelector(':root');
                var active_theme = root.style.getPropertyValue("--active-theme");

                // Here setting up profile data.
                this.profile.load(data["author-info"], active_theme);

                // Here Setting up the services section.
                this.services.load(data["services"]);

                // Here loading the portfolio.
                this.protfolio.load(data["protfolio"]);

            });

    }

}


// Here created theme manager that will help to setup theme.

var ThemeManager = function (file) {
    this.data_file = file

    this.loadTheme = function (name) {

        fetch(this.data_file)
            .then(response => response.json())
            .then(data => {
                theme = data.themes[name]

                var root = document.querySelector(':root');

                for (key in theme) {
                    root.style.setProperty("--" + key, theme[key]);
                }

                root.style.setProperty("--active-theme", name);
            });
    }

    this.loadDeafultTheme = function () {
        fetch(this.data_file)
            .then(response => response.json())
            .then(data => {
                active_theme = data["website-info"]["active-theme"]
                theme = data.themes[active_theme]

                var root = document.querySelector(':root');

                for (key in theme) {
                    root.style.setProperty("--" + key, theme[key]);
                }

                root.style.setProperty("--active-theme", active_theme);
            });
    }

    this.setTheme = function (name) {
        this.loadTheme(name)
    }

}

// setting up theme.
const theme_manager = new ThemeManager("./data/data.json");
theme_manager.loadDeafultTheme()

// Here Loading data.
const data_loader = new DataLoader("./data/data.json");
data_loader.loadData();

