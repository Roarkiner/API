const colors = [
    'AntiqueWhite',
    'Aqua',
    'Aquamarine',
    'Azure',
    'Beige',
    'Blue',
    'BlueViolet',	
    'Brown',
    'BurlyWood',
    'CadetBlue',
    'Chartreuse',
    'Chocolate',
    'Coral',
    'CornflowerBlue',
    'Cornsilk',
    'Crimson',
    'Cyan',
    'DarkCyan',
    'DarkGoldenRod',	
    'DarkGrey',
    'DarkGreen',
    'DarkKhaki',
    'DarkMagenta',
    'DarkOliveGreen',
    'DarkOrange',
    'DarkOrchid',	
    'DarkRed',
    'DarkSalmon',
    'DarkSeaGreen',
    'DarkTurquoise',
    'DarkViolet',
    'DeepPink',	
    'DeepSkyBlue',
    'DodgerBlue',	
    'FireBrick',
    'FloralWhite',
    'ForestGreen',
    'Fuchsia',
    'Gainsboro',
    'GhostWhite',
    'Gold',
    'GoldenRod',
    'Grey',
    'Green',
    'GreenYellow',
    'HoneyDew',
    'HotPink',
    'IndianRed',
    'Indigo',
    'Ivory',
    'Khaki',
    'Lavender',
    'LavenderBlush',
    'LawnGreen',
    'LemonChiffon',
    'LightBlue',
    'LightCoral',
    'LightCyan',
    'LightGoldenRodYellow'
]

//Récupère des données de toutes les régions de la map
fetch('https://api.got.show/api/map/regions').then((response) => {
    return response.json();
}).then((regions) => {
    
    fetch('https://api.got.show/api/map/cities').then((response) => {
        return response.json();
    }).then((cities) => {
        cities = cities.data;
        regions = regions.data;

        //Crée un élément svg qui sera la zone de "dessin" en lui donnant une taille ainsi que celle de la zone visible
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute('viewBox', "-2.5 -1.3 5 5");
    
        const ulRegion = document.createElement('ul');
        ulRegion.classList.add('hide');
        
        var i = 0;

        //Parcoure chaque région dans la liste de régions
        regions.forEach(region => {

            const liRegion = document.createElement('li');
            const h4 = document.createElement('h4');
            h4.innerHTML = region.name;
            liRegion.setAttribute('data-name', region.name);
            liRegion.addEventListener('click', (el) =>{
                el = el.target;
                if(el.parentNode.dataset.name){
                    el = el.parentNode;
                }
                if(!el.classList.contains('selected')){
                    const color = document.createElement('div');
                    color.classList.add("color");
                    color.style.backgroundColor = document.querySelector(`[data-regionName="${el.dataset.name}"]`).dataset.color;
                    el.append(color);
                    el.classList.add('selected');
                    el.style.border = '1px solid black';
                    el.style.fontWeight = 'bold';
                    showName(document.querySelector(`[data-regionName="${el.dataset.name}"]`), el.dataset.name);
                } else {
                    el.removeChild(el.querySelector('.color'));
                    el.classList.remove('selected');
                    el.style.border = '1px dotted black';
                    el.style.fontWeight = 'normal';
                    resetName(document.querySelector(`[data-regionName="${el.dataset.name}"]`), el.dataset.name);
                }
            });

            liRegion.append(h4);
            ulRegion.append(liRegion);

            //Stocke la variable qui contient les coordonées des frontières de la région
            var borders = region.borders;

                //Crée deux éléments SVG : 
                //  - g étant un groupement d'élements
                //  - polyline étant un objet de dessin (comme un rectangle ou un cercle) qui se dessine en traçant des traits
                const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
                const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");

                //Initialise une variable qui va contenir toutes les coordoonées des traits (sous forme x, y)
                var points = ``;

                //Parcours toutes les coordonées dans borders
                for(let i = 0 ; i < borders.length ; i++){
                    //Les transforments en coordonnées applicable à un plan 2D (https://fr.wikipedia.org/wiki/Projection_de_Mercator)
                    const coordinates = transfomCoordinates(parseFloat(borders[i][1]), parseFloat(borders[i][0]));
                    //Met les coordonnées transformées dans la variable points
                    points += ` ${coordinates[0]},${coordinates[1]}`;
                }

                //Rajoute les attributs nécessaires à mon objet de dessin polyline
                //Les plus importants étant : points, qu'on vient de finir de créer, et qui contient la suite de toutes les lignes à dessiner par polyline
                //Stroke qui dessine les frontières (ici en noir)
                //Fill qui remplie l'intérieur des frontières (ici en noir très transparent)
                polyline.setAttribute('class', 'region');
                polyline.setAttribute('points', points);
                polyline.setAttribute('stroke-width', '0.1%');
                polyline.setAttribute('stroke', 'black');
                polyline.setAttribute('fill', 'rgba(0, 0, 0, 0.2)');
                polyline.setAttribute('data-regionName', region.name);
                polyline.setAttribute('data-color', colors[i]);
                
                //Permet de faire quelque chose lorsqu'on pointe une région
                polyline.addEventListener('mouseenter', (el) =>{    
                    el = el.target;
    
                    var bool = true;
                    document.querySelectorAll('.selected').forEach(li =>{
                        if(li.dataset.name == el.dataset.regionName){
                            bool = false;
                        }
                    });
    
                    if(bool){
                        showName(el, el.dataset.regionName);
                    }
                });

                //Permet de faire quelque chose lorsqu'on ne pointe plus une région (ici la remet à son état initial)
                polyline.addEventListener('mouseleave', (el) =>{
                    el = el.target;

                    var bool = true;
                    document.querySelectorAll('.selected').forEach(li =>{
                        if(li.dataset.name == el.dataset.regionName){
                            bool = false;
                        }
                    });
                    if(bool){
                        resetName(el);
                    }
                });

                i++;

                //Met l'élement polyline dans g puis g dans svg
                g.appendChild(polyline);
                svg.appendChild(g);
        });

        //Parcoure chaque ville dans la liste de villes

        const ulCity = document.createElement('ul');
        ulCity.classList.add('hide');

        cities.forEach(city =>{
            if(city.priority <= 3){

                const liCity = document.createElement('li');
                const h4 = document.createElement('h4');
                h4.innerHTML = city.name;
                liCity.setAttribute('data-name', city.name);
                liCity.addEventListener('click', (el) =>{
                    el = el.target;
                    if(el.parentNode.dataset.name){
                        el = el.parentNode;
                    }
                    if(!el.classList.contains('selected')){
                        el.classList.add('selected');
                        el.style.border = '1px solid black';
                        el.style.fontWeight = 'bold';
                        showName(document.querySelector(`[data-cityName="${el.dataset.name}"]`), el.dataset.name);
                    } else {
                        el.classList.remove('selected');
                        el.style.border = '1px dotted black';
                        el.style.fontWeight = 'normal';
                        resetName(document.querySelector(`[data-cityName="${el.dataset.name}"]`), el.dataset.name);
                    }
                });
                
                liCity.append(h4);
                ulCity.append(liCity);

                const coordinates = transfomCoordinates(parseFloat(city.coordX), parseFloat(city.coordY));
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
                
                circle.setAttribute('cx', coordinates[0]);
                circle.setAttribute('cy', coordinates[1]);
                if(city.priority == 3){
                    circle.setAttribute('r', '0.025');
                } else {
                    circle.setAttribute('r', '0.04');
                }
                circle.setAttribute('fill', 'red');
                circle.setAttribute('stroke-width', '0.1%');
                circle.setAttribute('stroke', 'black');
                circle.setAttribute('data-url', city.link);
                circle.setAttribute('data-cityName', city.name);
                circle.setAttribute('data-priority', city.priority);

                //Permet de faire quelque chose lorsqu'on pointe une ville
                circle.addEventListener('mouseenter', (el) =>{
                    el = el.target;

                    var bool = true;
                    document.querySelectorAll('.selected').forEach(li =>{
                        if(li.dataset.name == el.dataset.cityName){
                            bool = false;
                        }
                    });
    
                    if(bool){
                        showName(el, el.dataset.cityName);
                    }
                });

                //Permet de faire quelque chose lorsqu'on ne pointe plus une ville (ici la remet à son état initial)
                circle.addEventListener('mouseleave', (el) =>{
                    el = el.target;
                    
                    var bool = true;
                    document.querySelectorAll('.selected').forEach(li =>{
                        if(li.dataset.name == el.dataset.cityName){
                            bool = false;
                        }
                    });

                    if(bool){
                        resetName(el);
                    }
                });

                circle.addEventListener('click', (el) =>{
                    el = el.target;
                    
                    window.open(el.dataset.url,'_blank');
                });

                g.appendChild(circle);
                svg.appendChild(g);
            }
        });

        //Met l'ul dans le menu
        document.querySelector('#region_list').append(ulRegion);
        document.querySelector('#city_list').append(ulCity);

        //Et finalement met l'élément svg complet dans la div prévu pour l'acceuillir, notre dessin est fait !
        document.querySelector('#map').appendChild(svg);

        //Rend le bouton de menu cliquable
        document.querySelector('#show_list').addEventListener('click', (el) =>{
            el = el.target;
            const aside = document.querySelector('aside');

            if(!aside.classList.contains('active')){
                aside.classList.add('active');
                document.querySelector('#show_list').querySelector('img').style.transform = 'scaleX(1)';
            } else {;
                aside.classList.remove('active');
                document.querySelector('#show_list').querySelector('img').style.transform = 'scaleX(-1)';
            }
        });

        //Rend les régions ouvrables et fermables
        document.querySelectorAll('.location_title').forEach(title =>{
            title.addEventListener('click', (el) =>{
                el = el.target;
    
                if(el.parentNode.classList.contains('location_title')){
                    el = el.parentNode;
                }
    
                const ul = el.parentNode.querySelector('ul');
    
                if(!ul.classList.contains('show')){
                    ul.classList.remove('hide');
                    ul.classList.add('show');
                    el.querySelector('img').style.transform = 'rotate(0deg)';
                } else {
                    ul.classList.remove('show');
                    ul.classList.add('hide');
                    el.querySelector('img').style.transform = 'rotate(90deg)';
                }
            });
        });
    });
});

function transfomCoordinates(x, y){

    x = (x * Math.PI / 180) - (13 * Math.PI / 180);
    y = Math.log(Math.tan((Math.PI / 4) + ((y * Math.PI /180) / 2)));
    return [x, y];
}

//Colore la région (sélectionnée en passant la souris dessus ou en sélectionnant son nom dans la liste)
function colorMap(el){
    el.setAttribute('fill', el.dataset.color);
    var name = document.createElement('h2');
    name.innerHTML = el.dataset.regionName;
    el.append(name);
}

//Remet les couleurs de base à la région
function resetMap(el){
    el.setAttribute('fill', 'rgba(0, 0, 0, 0.2)'); 
}

function showName(el, name){
    //Récupère la position et taille de la région
    var bbox = el.getBBox();
    //Crée un élément text (SVG)
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    var x = bbox.x;
    var y = bbox.y;
    //Ecrit dans l'élément texte le nom de la région
    text.innerHTML = name;
    if(el.nodeName == "polyline"){
        //Change la taille de la police            
        text.setAttribute('font-size', 0.15 + 'px');
        text.setAttribute('font-weight', 'bold');
        //Ajoute l'élément dans le même élément g que la région, nécessaire de le faire AVANT de donner une position au texte
        el.parentNode.appendChild(text);
        //Récupère l'élément qu'on vient de mettre, qui a maintenant une largeur et hauteur
        text = el.parentNode.querySelector('text');
        //Le positionne en fonction de la position de la région et de la largeur du texte (pour le centrer sur la région)
        text.setAttribute('x', (x + bbox.width / 2) - text.getBBox().width / 2);
        text.setAttribute('y', -(y + bbox.height / 2));
        //Appelle la fonction pour colorer la région
        colorMap(el);
    } else {
        el.setAttribute('r', '0.07');
        //Change la taille de la police            
        text.setAttribute('font-size', 0.1 + 'px');
        text.setAttribute('font-weight', 'bold');
        //Ajoute l'élément dans le même élément g que la région, nécessaire de le faire AVANT de donner une position au texte
        el.parentNode.appendChild(text);
        //Récupère l'élément qu'on vient de mettre, qui a maintenant une largeur et hauteur
        text = el.parentNode.querySelector('text');
        //Le positionne en fonction de la position de la région et de la largeur du texte (pour le centrer sur la région)
        text.setAttribute('x', (x + bbox.width / 2) - text.getBBox().width / 2);
        text.setAttribute('y', -(y + bbox.height / 2) - text.getBBox().height);
    }
}

function resetName(el){
    if(el.dataset.priority == 3){
        el.setAttribute('r', '0.025');
    } else {
        el.setAttribute('r', '0.04');
    }
    //Supprime le texte
    el.parentNode.removeChild(el.parentNode.querySelector('text'));
    if(el.nodeName == "polyline"){
        //Appelle la fonction pour décolorer la région
        resetMap(el);
    }
}