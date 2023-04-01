let q = (el)=>document.querySelector(el);
let qa = (el)=>document.querySelectorAll(el);
let modalQt = 0;
let modalkey = 0;
let CarModal = [];

// mapeamento do JSON 
pizzaJson.map((intem,index)=>{
   // clonando da estrutura html
    let pizaIntem = q('.models .pizza-item').cloneNode(true);
     
    // criando um novo elemento para indentificar e usar no evento de click
   pizaIntem.setAttribute('data-key',index)
   
   // add item da JSON da estrutura clone 

    pizaIntem.querySelector('.pizza-item--img img').src = intem.img
    pizaIntem.querySelector('.pizza-item--price').innerHTML = `R$ ${intem.price.toFixed(2)}`
    pizaIntem.querySelector('.pizza-item--name').innerHTML = intem.name 
    pizaIntem.querySelector('.pizza-item--desc').innerHTML = intem.description
   
   
    // add um mondel na tela com um evento de click

    pizaIntem.querySelector('.pizza-item a').addEventListener('click',(a)=>{
       
        // muda o padrão da tag a 
      
       a.preventDefault()
        
       // defenir a quantidade no modal padrao
       modalQt = 1

       q(".pizzaInfo--qt").innerHTML = modalQt
        
        // pega os index da Json 

        let key = a.target.closest('.pizza-item').getAttribute('data-key');
        modalkey = key
        
        // add intem da Json no modal 

        q('.pizzaBig img').src = pizzaJson[key].img
        q('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        q('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
        q('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
        q('.pizzaInfo--size.selected').classList.remove('selected')
        
       
        // add o class selected apenas na pizza grande e colocando os tamanhos
        qa('.pizzaInfo--size').forEach((size,indexSize)=>{
            if(indexSize == 2){
                size.classList.add('selected');

            }    
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[indexSize]
        })

       // mostra o modal na tela 
        q('.pizzaWindowArea').style.opacity = 0
        q('.pizzaWindowArea').style.display = 'flex'
        setTimeout(()=>{
            q('.pizzaWindowArea').style.opacity = 1
        },200)

    })
    
    // inserindo a estrutura em um area no html e exibindo na tela 
    
    q('.pizza-area').append(pizaIntem);
})

// botao cancelar

function closeModal (){
    q('.pizzaWindowArea').style.opacity = 0
    setTimeout(()=>{
        q('.pizzaWindowArea').style.display = "none"
    },200)
}
qa('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((intem)=>{       
    intem.addEventListener('click',closeModal)
 
})

// aumenta e diminuir a quantidade 


q('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    if(modalQt > 1){
        modalQt --;
        q('.pizzaInfo--qt').innerHTML = modalQt
    }
})

q('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQt++;
    q('.pizzaInfo--qt').innerHTML = modalQt
})

// mundando o tamanho da pizza selecionado 


qa('.pizzaInfo--size').forEach((qualquer)=>{
    qualquer.addEventListener('click',()=>{
        q('.pizzaInfo--size.selected').classList.remove('selected')
        qualquer.classList.add('selected')
    })
})

// add pizza ao carrinho 

q('.pizzaInfo--addButton').addEventListener('click',()=>{
   
    let size = parseInt(q('.pizzaInfo--size.selected').getAttribute('data-key'))
    let indentificador = pizzaJson[modalkey].id+'@'+ size

   let res = CarModal.findIndex((intem)=>intem.indentificador == indentificador);

   if(res > -1){
    CarModal[res].qt += modalQt
   }else{
    CarModal.push({
        indentificador,
        id : pizzaJson[modalkey].id,
        size,
        qt: modalQt
    })} 
    
    abrirCar ();
    closeModal ();
})



q('.menu-openner').addEventListener('click',()=>{
    if(CarModal.length > 0){
        q('aside').style.left = '0'

    }
})
q('.menu-closer').addEventListener('click',()=>{
    q('aside').style.left = '100vw'
})

function abrirCar (){
    q('.menu-openner span').innerHTML = CarModal.length ;
   
    if(CarModal.length > 0){
    q('aside').classList.add('show');
    q('.cart').innerHTML = ' ';
    
    let subtotal = 0;   
    let desconto = 0;   
    let total = 0;
   
    for ( let i in CarModal){
        let pizzaCar = pizzaJson.find((intem)=> intem.id == CarModal[i].id);
       subtotal = pizzaCar.price * CarModal[i].qt
      
        let intemCar = q('.models .cart--item').cloneNode(true);
       
      let pizzaTamanho; 
      
      switch(CarModal[i].size){
        case 0:
            pizzaTamanho = 'P';
            break;
        case 1:
            pizzaTamanho = 'M';
            break;
        case 2:
            pizzaTamanho = 'G';
            break;
        }

        let nomeTamanho = `${pizzaCar.name} (${pizzaTamanho})`;
       
       
       intemCar.querySelector('.cart--item--qt').innerHTML = CarModal[i].qt ;
       intemCar.querySelector('img').src = pizzaCar.img;
       intemCar.querySelector('.cart--item-nome').innerHTML = nomeTamanho
       intemCar.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
        if(CarModal[i].qt > 1){
            CarModal[i].qt--;
        }else{
            
            CarModal.splice(i,1);
             
        }
            abrirCar ();
       });
       intemCar.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
        CarModal[i].qt++;
        abrirCar ();
       });
      
       
       q('.cart').append(intemCar);

    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto
    q('.subtotal span:last-child').innerHTML = subtotal.toFixed(2);
    q('.desconto span:last-child').innerHTML = desconto.toFixed(2);
    q('.total span:last-child').innerHTML = total.toFixed(2);
}else{
    q('aside').classList.remove('show');
    q('aside').style.left = '100vw'
     
}
}



