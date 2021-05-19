var canvas = document.querySelector('canvas');
var r = 0;
var g = 0;
var b = 0;

fetch('https://api.got.show/api/map/regions').then((response) => {
    return response.json();
}).then((regions) => {
    regions = regions.data;
    for(let i = 0 ; i < regions.length ; i++){
        region = regions[i];
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.moveTo(parseInt(region.borders[0][0]), (region.borders[0][1]));
            region.borders.forEach(position => {
                ctx.lineTo((parseInt(position[0], 10) + 200), (parseInt(position[1], 10) + 200));
            });
            ctx.fill();
        }
    }
});