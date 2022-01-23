
require('dotenv-safe').config()

const {MercadoBitcoin} = require('./src/MercadoBitcoin')
const {MercadoBitcoinTrade} = require('./src/MercadoBitcoinTrade')

const infoApi = new MercadoBitcoin({ currency: (process.env.CURRENCY)})
const tradeApi = new MercadoBitcoinTrade({
    currency: process.env.CURRENCY,
    key: process.env.KEY ,
    secret: process.env.SECRET,
    
})

let aux = "init";


 async function getQuantity(coin, price, isBuy){
    
    coin = isBuy ? ['brl'] : coin.toLowerCase()
    

    const data = await tradeApi.getAccountInfo()
    const balance = parseFloat(data.balance[coin].available).toFixed(8)  
    if (!isBuy ) return balance;

    //if(balance<1) return false 
    console.log(`saldo disponivel de ${coin}: ${balance}`)

    price = parseFloat(price);
    let qty = parseFloat(balance/price).toFixed(8)
    return qty - 0.00000001
    
} 

setInterval(async() =>{
    
    const response = await infoApi.ticker();
    while( response === false){

        const response = await infoApi.ticker();

    }
    console.log(response)

    comprar = response.ticker.buy
    vender = response.ticker.sell
    diferenca= (((vender-comprar)/vender)*100).toFixed(2)
    console.log('spread de ',diferenca, '%')  
        

    try {
        const qty = await getQuantity('BRL',response.ticker.sell, true)
        

        console.log('meu qty',(qty.toFixed(5)))

        
        //if (!qty) return console.error( 'sem saldo')
        //console.log('compra',(qty).toFixed(8), process.env.CURRENCY)
     
 

        const profitability2 = parseFloat(process.env.PROFITABILITY2);
        const profitability = parseFloat(process.env.PROFITABILITY);

        const buyPrice = parseFloat(vender*profitability2).toFixed(8);
        console.log('vendo por', buyPrice)

        const sellPrice = parseFloat(comprar/profitability).toFixed(8);
        console.log('compro por', sellPrice)

        diferencaTrade= (((buyPrice-sellPrice)/buyPrice)*100).toFixed(2)
        //console.log('previsão de ganhos',(diferencaTrade-0.6).toFixed(2), '%')
        const sellQty = await getQuantity(process.env.CURRENCY, 20, false)
        console.log('meu saldo em ',process.env.CURRENCY , ' é de: ', sellQty)

        if(diferenca>0.4){     

            if(qty>0.1){
            const comprando = await tradeApi.placeBuyOrder(qty, sellPrice)
            console.log('ordem inserida no livro ', comprando) 
            }
            else
            console.log('já comprei tudo')
            
            if(sellQty>0.1){
            
               /*  if(aux === "init"){
                    aux = sellQty;
                }
                else{   
                    if(sellQty > aux) aux = sellQty;
                    else               
                        if((sellQty*0.05)        (sellQty-aux))
                        
 */
                    const vendendo = await tradeApi.placeSellOrder(sellQty, buyPrice )
            
                    console.log('ordem inserida no livro ', vendendo)  
                               
            }
            else        
            console.log('já vendi tudo')         
        }
    } catch (error) {
        console.log(error)
              
    }
     
}, process.env.CRAWLER_INTERVAL)
 