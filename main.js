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

//Creting a Component for Services.
var Services = function(){
    this.services_jason = null;

    this.load = function(services_jason){
        this.services_jason = services_jason;

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