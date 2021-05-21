//Je récupère les données de toutes les régions de la map
fetch('https://api.got.show/api/map/regions').then((response) => {
    return response.json();
}).then((regions) => {
    regions = regions.data;
    //Je crée un élément svg qui sera la zone de "dessin" en lui donnant une taille ainsi que celle de la zone visible
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute('viewBox', "-3 -2 6 6");

    //Je parcours chaque région dans ma liste de régions
    regions.forEach(region => {
        //Je stocke la variable qui contient les coordonées des frontières de la région
        var borders = region.borders;

            //Création de deux éléments SVG : 
            //  - g étant un groupement d'élements
            //  - polyline étant un objet de dessin (comme un rectangle ou un cercle) qui se dessine en traçant des traits
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
            const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");

            //Initialisation d'une variable qui va contenir toutes les coordoonées des traits (sous forme x, y)
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
            //Le splus importants étant : points, qu'on vient de finir de créer, et qui contient la suite de toutes les lignes à dessiner par polyline
            //Stroke qui dessine les frontières (ici en noir)
            //Fill qui remplie l'intérieur des frontières (ici en noir très transparent)
            polyline.setAttribute('class', 'region');
            polyline.setAttribute('points', points);
            polyline.setAttribute('stroke-width', '0.1%');
            polyline.setAttribute('stroke', 'black');
            polyline.setAttribute('fill', 'rgba(0, 0, 0, 0.2)');
            polyline.setAttribute('data-regionName', region.name);
            
            //Met l'élement polyline dans g puis g dans svg
            g.appendChild(polyline);
            svg.appendChild(g);
    });
    
    //Et finalement met l'élément svg complet dans la div prévu pour l'acceuillir, notre dessin est fait !
    document.querySelector('#map').appendChild(svg);
    

    // var lis = document.querySelectorAll('li');
    
    // lis.forEach(li =>{
    //     li.addEventListener('mouseenter', (el) =>{
    //         el = el.target;
    //         if(el.dataset.name){
    //             colorMap(el);
    //         }
    //         if(el.parentNode.dataset.name){
    //             colorMap(el.parentNode);
    //         }
    //     })
    //     li.addEventListener('mouseleave', (el) =>{
    //             el = el.target;
    //             if(el.dataset.name){
    //                 resetMap(el);
    //             }
    //             if(el.parentNode.dataset.name){
    //                 resetMap(el.parentNode);
    //             }
    //         })
    // });

    //Permet de faire quelque chose lorsqu'on pointe une région
    document.querySelectorAll('.region').forEach(polyline =>{
        polyline.addEventListener('mouseenter', (el) =>{
            el = el.target;
            
            //Récupère la position et taille de la région
            var bbox = el.getBBox();
            //crée un élément text (SVG)
            var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            var x = bbox.x;
            var y = bbox.y;
            //Ecrit dans l'élément texte le nom de la région
            text.innerHTML = el.dataset.regionName;    
            //Change la taille de la police            
            text.setAttribute('font-size', 0.15 + 'px');
            //Ajoute l'élément dans le même élément g que la région, nécessaire de le faire AVANT de donner une position au texte
            el.parentNode.appendChild(text);
            //Récupère l'élément qu'on vient de mettre, qui a maintenant une largeur et hauteur
            text = el.parentNode.querySelector('text');
            //Le positionne en fonction de la position de la région et de la largeur du texte (pour le centrer sur la région)
            text.setAttribute('x', (x + bbox.width / 2) - text.getBBox().width / 2);
            text.setAttribute('y', -(y + bbox.height / 2));
            //Appelle la fonction pour colorer la région
            colorMap(el);
        });
    });

    //Permet de faire quelque chose lorsqu'on ne pointe plus une région (ici la remet à son état initial)
    document.querySelectorAll('.region').forEach(polyline =>{
        polyline.addEventListener('mouseleave', (el) =>{
            el = el.target;
            //Supprime le texte et enlève la couleur "rose"
            el.parentNode.removeChild(el.parentNode.querySelector('text'));
            resetMap(el);
        });
    });
});

//Rendre le bouton de menu cliquable


//Pour colorer la région (sélectionnée en passant la souris dessus ou en sélectionnant son nom dans la liste)
function colorMap(el){
    if(el.dataset.name){
        var polyline = document.querySelector(`[data-regionName="${el.dataset.name}"]`);
        polyline.setAttribute('fill', 'salmon');
    } else {
        el.setAttribute('fill', 'salmon');
        var name = document.createElement('h2');
        name.innerHTML = el.dataset.regionName;
        el.append(name);
    }
}
//Remet les couleurs de base à la région
function resetMap(el){
    if(el.dataset.name){
        var polyline = document.querySelector(`[data-regionName="${el.dataset.name}"]`);       
        polyline.setAttribute('fill', 'rgba(0, 0, 0, 0.2)'); 
    } else {
        el.setAttribute('fill', 'rgba(0, 0, 0, 0.2)'); 
    }
}