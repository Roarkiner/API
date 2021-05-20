document.querySelector('ul').addEventListener('click', (el) =>{
    el = el.target;
    if(el.dataset.img){
        changeMap(el);
    }
    if(el.parentNode.dataset.img){
        changeMap(el.parentNode);
    }
})

function changeMap(el){
    var regions = document.querySelectorAll('.region');
    regions.forEach(region =>{
        if(region != el){
            region.querySelector('img').style.transform = 'none';
        }
    })
    if(!el.classList.contains('active')){
        el.classList.add('active');
        document.querySelector('#map').style.backgroundImage = `url('${el.dataset.img}')`;
        el.querySelector('img').style.transform = 'rotate(90deg)';
        console.log(el.dataset.name);
    } else {
        el.classList.remove('active');
        document.querySelector('#map').style.backgroundImage = `url('./assets/Westeros.png')`;
        el.querySelector('img').style.transform = 'none';
    }
}