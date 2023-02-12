//Creating a Profile Component.
var Profile = function(){
    this.profile = null;

    this.load = function(profile){
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
        for (index in profile.name){
            if(profile.name[index] === " "){
                authorName += " "
            }
            else{
                authorName += `<span>${profile.name[index]}</span>`;
            }
        }
        author_name.innerHTML = authorName;


        designation.innerText = profile.designation;
        description.innerText = profile.description;
        author_image.setAttribute("src", profile.profile_image);
        
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
var CarosuleSimulator = function(container, gap, vertically_center=true, top_bottom_gap=0, previousButton=null, nextButton=null, front_space=0, back_space=0){
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

    this.onMouseMove = (event)=>{
        this.screenX = event.screenX;
        this.screenY = event.screenY;
    }

    this.removePxFromNumbers = function(str){
        return str.slice(0, str.length-2);
    }

    this.onSlideScrollActive = (event)=>{
        this.isSliding = true;
        this.onSlide(event);

    }

    this.onSlideScrollDeactive = ()=>{
        this.isSliding = false;
    }

    this.onSlide = (event)=>{
        var coordinates = [];
        var active_position_x = event.screenX;

        // here adding a overlay layer to stop hover effact.
        var overlay = document.createElement("div");
        overlay.setAttribute("style", "width: 100%; height: 100%; background-color: ##ffffff00; position: absolute;");
        this.container.append(overlay);


        for (index in this.slides){
            coordinates.push(this.slides[index].translateX);
            this.slides[index].element.style.transition = "none";
        }

        var previous_slide_value = 0;

        // Here getting container width to stop over slide element.
        var container_width = this.getContainerWidth();
        
        const slide_interval = setInterval(()=>{

            var slide_value = active_position_x - this.screenX;
            
            if (slide_value !== previous_slide_value){
                
                if (slide_value > 0){

                    // Sliding Left Side.
                    if (!((coordinates[coordinates.length-1] + this.slides[this.slides.length-1].width + this.back_space) - slide_value < container_width)){
                        for (index in this.slides){
                            this.slides[index].translateX = coordinates[index] - slide_value;
                            this.slides[index].element.style.transform = `translate(${this.slides[index].translateX}px, ${this.translateY}%)`;
                        }
                    }
                }
                else if (slide_value < 0){
                    
                    // Sliding right side.
                    slide_value = slide_value * -1;
                    
                    if (!(coordinates[0] + slide_value > 0 + this.front_space)){
                        for (index in this.slides){
                            this.slides[index].translateX = coordinates[index] + slide_value;
                            this.slides[index].element.style.transform = `translate(${this.slides[index].translateX}px, ${this.translateY}%)`;
                        }
                    }

                }
            }

            if (!this.isSliding){

                for (index in this.slides){
                    this.slides[index].element.style.transition = null;
                }

                this.container.removeChild(overlay);
                clearInterval(slide_interval);
            }

        }, 1);
    }

    this.onNextPressed = ()=>{
        var first_slide = null;
        var container_width = this.getContainerWidth();

        for (var index of Array(this.slides.length).keys()){
            element = this.slides[this.slides.length-index-1];
            if (element.translateX < 0){
                first_slide = element;
                break;
            }
        }

        if (first_slide !== null){
            
            var gap = (0 + this.front_space) - first_slide.translateX;
            
            for (var index of Array(this.slides.length).keys()){
                element = this.slides[index];
                element.translateX += gap;
                element.element.style.transform = `translate(${element.translateX}px, ${this.translateY}%)`;
            }
            
        }

        this.onContainerResize();
    }

    this.onPreviousPressed = ()=>{
        var last_slide = null;
        var container_width = this.getContainerWidth();

        for (var index of Array(this.slides.length).keys()){
            element = this.slides[index];
            if (element.translateX + element.width >= container_width){
                last_slide = element;
                break;
            }
        }

        if (last_slide !== null){
            
            var gap = (last_slide.translateX + last_slide.width + this.back_space) - container_width;
            for (var index of Array(this.slides.length).keys()){
                element = this.slides[index];
                element.translateX -= gap;
                element.element.style.transform = `translate(${element.translateX}px, ${this.translateY}%)`;
            }
        }
    }

    this.getContainerWidth = ()=>{
        var container_width = window.getComputedStyle(this.container).width;
        container_width = parseInt(this.removePxFromNumbers(container_width));
        return container_width;
    }

    this.getContainerHeight = ()=>{
        var container_height = window.getComputedStyle(this.container).height;
        container_height = parseInt(this.removePxFromNumbers(container_height));
        return container_height;
    }

    this.onContainerResize = ()=>{
        if (this.slides.length > 0){

            var container_width = this.getContainerWidth();
            var starting_slide = this.slides[0];
            var last_slide = this.slides[this.slides.length-1];

            if (last_slide.translateX + last_slide.width <= container_width && starting_slide.translateX >= 0){
                this.nextButton.style.display = "none";
                this.previousButton.style.display = "none";
            }
            else{
                this.nextButton.style.display = "flex";
                this.previousButton.style.display = "flex";
            }
        }
    }

    this.__init__ = function(){
        // here adding elevent listner on buttons.
        if (this.nextButton !== null){
            this.nextButton.addEventListener("click", this.onNextPressed);
        }

        if (this.previousButton !== null){
            this.previousButton.addEventListener("click", this.onPreviousPressed);
        }

        window.addEventListener("resize", this.onContainerResize);
        this.container.addEventListener("mousedown", this.onSlideScrollActive);
        this.container.addEventListener("mouseup", this.onSlideScrollDeactive);
        this.container.addEventListener("mouseleave", this.onSlideScrollDeactive);
        window.addEventListener("mousemove", this.onMouseMove);

        // here setting up relative postion on container.
        this.container.style.position = "relative";

        // here setting up the translate Y property, if vertically_center is true then it move toword center.
        if (this.vertically_center){
            this.translateY = -50;
        }

        // here setting up absolute position on all children so that i can move.
        this.slide_max_height = 0;
        
        for (var index of Array(this.container.children.length).keys()){

            var element = this.container.children[index];

            element.style.position = "absolute";
            if (this.vertically_center){
                element.style.top = "50%";
            }

            var height = parseInt(this.removePxFromNumbers(window.getComputedStyle(element).height));
            if (height > this.slide_max_height){
                this.slide_max_height = height
            }
            

            if (this.slides.length === 0){

                var width = parseInt(this.removePxFromNumbers(window.getComputedStyle(element).width));
                var element_obj  = {element: element, width: width, translateX: this.front_space};

                element.style.transform = `translate(${element_obj.translateX}px, ${this.translateY}%)`;
                this.slides.push(element_obj);

                this.sliders_width += width;

            }
            else{

                var width = parseInt(this.removePxFromNumbers(window.getComputedStyle(element).width));
                var element_obj  = {element: element, width: width,
                                    translateX: this.slides[this.slides.length-1].translateX+this.slides[this.slides.length-1].width+this.gap};

                element.style.transform = `translate(${element_obj.translateX}px, ${this.translateY}%)`;
                this.slides.push(element_obj);

                this.sliders_width += width + this.gap;

            }

        }

        this.container.style.minHeight = `${this.slide_max_height+this.top_bottom_gap}px`;

        var container_width = window.getComputedStyle(this.container).width;
        container_width = parseInt(this.removePxFromNumbers(container_width));

        if (container_width > this.sliders_width){
            this.nextButton.style.display = "none";
            this.previousButton.style.display = "none";
        }

    }
}

//Creting a Component for Services.
var Services = function(){
    this.services_jason = null;
    this.services_container = document.querySelector(".services-carousel");
    
    this.carosuleSimulator = new CarosuleSimulator(this.services_container, 50, true, 80,
                                                    document.querySelector("#services-button-left"), document.querySelector("#services-button-right"),
                                                    36, 36);

    this.load = function(services_jason){
        this.services_jason = services_jason;

        this.services_jason.forEach((element)=>{
            var inner_html = `
            <div class="card-icon">
                <i class="${element.icon}"></i>
            </div>
            <h3 class="card-heading">${element.name}</h3>
            <p class="card-description">${element.description}</p>`

            var element = document.createElement("div");
            element.setAttribute("class", "card");
            element.innerHTML = inner_html;

            this.services_container.append(element);
            
        })

        this.carosuleSimulator.__init__();

    }
}

// Here's a Data Parser is being created that will help to parse all the data from jason file.

var DataLoader = function(file){
    this.data_file = file
    this.profile = new Profile();
    this.services = new Services();

    this.loadData = function(){
        fetch(this.data_file)
        .then(response => response.json())
        .then(data => {

            // Here setting up profile data.
            this.profile.load(data["author-info"]);

            // Here Setting up the services section.
            this.services.load(data["services"]);

        });

    }

}


// Here created theme manager that will help to setup theme.

var ThemeManager = function(file){
    this.data_file = file

    this.loadTheme = function(name){

        fetch(this.data_file)
        .then(response => response.json())
        .then(data => {
            theme = data.themes[name]

            var root = document.querySelector(':root');

            for (key in theme){
                root.style.setProperty("--"+key, theme[key]);
            }
        });
    }

    this.loadDeafultTheme = function(){
        fetch(this.data_file)
        .then(response => response.json())
        .then(data => {
            active_theme = data["website-info"]["active-theme"]
            theme = data.themes[active_theme]

            var root = document.querySelector(':root');

            for (key in theme){
                root.style.setProperty("--"+key, theme[key]);
            }
        });
    }

    this.setTheme = function(name){
        this.loadTheme(name)
    }

}

// setting up theme.
const theme_manager = new ThemeManager("./data/data.json");
theme_manager.loadDeafultTheme()

// Here Loading data.
const data_loader = new DataLoader("./data/data.json");
data_loader.loadData();

