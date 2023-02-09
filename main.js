// Here's a Data Parser is being created that will help to parse all the data from jason file.

var DataLoader = function(file){
    this.data_file = file

    this.loadData = function(){
        fetch(this.data_file)
        .then(response => response.json())
        .then(data => {

            // Here setting up profile data.
            profile = data["author-info"];

            // fetching component from webpage.
            author_name = document.querySelector(".author-name");
            designation = document.querySelector(".designation");
            description = document.querySelector("#about-author");
            author_image = document.querySelector("#author-image");
            social_links = document.querySelector("#social");

            // Here setting up inner text of above component.
            author_name.innerText = profile.name;
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

    this.setTheme = function(name){
        this.loadTheme(name)
    }

}

// setting up theme.
const theme_manager = new ThemeManager("./data/data.json");
theme_manager.loadTheme("default");

// Here Loading data.
const data_loader = new DataLoader("./data/data.json");
data_loader.loadData();