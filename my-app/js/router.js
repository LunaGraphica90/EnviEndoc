const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    gestionLocation();
}

const routes = {
    404 : "404.html",
    "/" : "home.html",
    "/about" : "about.html",
    "/map" : "map.html",
    "/datas" : "sourcedata.html",
    "/legacy" : "legacy.html",
    "/help" : "help.html",
    "/list" : "list.html",
};

const gestionLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    const html = await fetch(route).then((data)=> data.text());
    document.getElementById('app').innerHTML= html;

    if(path === "/"){
        document.body.classList.add("home")
    } else {
        document.body.classList.remove("home")
    }

    translate();

};

window.onpopstate = gestionLocation;
window.route = route;
gestionLocation();

