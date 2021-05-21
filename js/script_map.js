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
    regions = regions.data;
    //Crée un élément svg qui sera la zone de "dessin" en lui donnant une taille ainsi que celle de la zone visible
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute('viewBox', "-2.5 -1.3 5 5");

    const ul = document.createElement('ul');
    
    var i = 0;
    
    //Parcoure chaque région dans ma liste de régions
    regions.forEach(region => {

        const li = document.createElement('li');
        li.setAttribute('data-name', region.name);
        li.addEventListener('click', (el) =>{
            el = el.target;

            if(!el.classList.contains('selected')){
                el.classList.add('selected');
                el.style.border = '1px solid black';
                el.style.color = document.querySelector(`[data-regionName="${el.dataset.name}"]`).dataset.color;
                el.style.fontWeight = 'bold';
                showRegion(document.querySelector(`[data-regionName="${el.dataset.name}"]`));
            } else {
                el.classList.remove('selected');
                el.style.border = '1px dotted black';
                el.style.color = 'black';
                el.style.fontWeight = 'normal';
                resetRegion(document.querySelector(`[data-regionName="${el.dataset.name}"]`));
            }
        });
        li.innerHTML = region.name;
        ul.append(li);

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
                var x = parseFloat(borders[i][1]);
                x = (x * Math.PI / 180) - (13 * Math.PI / 180);
                var y = parseFloat(borders[i][0]);
                y = Math.log(Math.tan((Math.PI / 4) + ((y * Math.PI /180) / 2)));
                //Met les coordonnées transformées dans la variable points
                points += ` ${x},${y}`;
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
            
            i++;
            //Met l'élement polyline dans g puis g dans svg
            g.appendChild(polyline);
            svg.appendChild(g);
    });

    //Met l'ul dans le menu
    document.querySelector('#location_list').append(ul);

    //Et finalement met l'élément svg complet dans la div prévu pour l'acceuillir, notre dessin est fait !
    document.querySelector('#map').appendChild(svg);

    //Permet de faire quelque chose lorsqu'on pointe une région
    document.querySelectorAll('.region').forEach(polyline =>{
        polyline.addEventListener('mouseenter', (el) =>{    
            el = el.target;

            var bool = true;
            document.querySelectorAll('.selected').forEach(li =>{
                if(li.dataset.name == el.dataset.regionName){
                    bool = false;
                }
            });

            if(bool){
                showRegion(el);
            }
        });
    });

    //Permet de faire quelque chose lorsqu'on ne pointe plus une région (ici la remet à son état initial)
    document.querySelectorAll('.region').forEach(polyline =>{
        polyline.addEventListener('mouseleave', (el) =>{
            el = el.target;
            var bool = true;
            document.querySelectorAll('.selected').forEach(li =>{
                if(li.dataset.name == el.dataset.regionName){
                    bool = false;
                }
            });
            if(bool){
                resetRegion(el);
            }
        });
    });

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
});


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

function showRegion(el){
    //Récupère la position et taille de la région
    var bbox = el.getBBox();
    //Crée un élément text (SVG)
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    var x = bbox.x;
    var y = bbox.y;
    //Ecrit dans l'élément texte le nom de la région
    text.innerHTML = el.dataset.regionName;    
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
}

function resetRegion(el){
    //Supprime le texte et enlève la couleur "rose"
    el.parentNode.removeChild(el.parentNode.querySelector('text'));
    resetMap(el);
}