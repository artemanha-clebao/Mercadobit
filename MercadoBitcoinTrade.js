const axios = require('axios')
const qs = require('querystring')
const crypto = require('crypto')


const ENDPOINT_TRADE_PATH = '/tapi/v3/'
const ENDPOINT_TRADE_API = 'https://www.mercadobitcoin.net' + ENDPOINT_TRADE_PATH

class MercadoBitcoinTrade {
    constructor(config){
        this.config ={
            KEY: config.key,
            SECRET: config.secret,
            CURRENCY: config.currency,
            
        }
    //console.log(this.config.CURRENCY)
    }

    getAccountInfo(){
        return this.call('get_account_info',{}) 
        
    }
// Aguardando reforço.............................
    /* list_orders(){
        return this.call('list_orders',{})
        console.log(list_orders)
        
    }
 */
    

    placeBuyOrder( qty, limit_price){
        return this.call('place_buy_order',{
            coin_pair: `BRL${this.config.CURRENCY}`,
            quantity: `${qty}`.substring(0,10),
            limit_price: `${limit_price}`
        })

    }

    
    placeSellOrder( qty, limit_price){
        return this.call('place_sell_order',{
            coin_pair: `BRL${this.config.CURRENCY}`,
            quantity: `${qty}`.substring(0,10),
            limit_price: `${limit_price}`
        })

    }
// Aguardando reforço.............................

   /*  cancelOrder(){
        return this.call('cancel_order', {
        coin_pair: `BRL${this.config.CURRENCY}`,
        order_id: ''
        })

    
    } */
  

    async call(method, parameters){

        const now = new Date().getTime();
        let queryString = qs.stringify({tapi_method: method, tapi_noce: now})
        if (parameters) queryString += `&${qs.stringify(parameters)}`

        const signature = crypto.createHmac('SHA512', this.config.SECRET)
            .update(`${ENDPOINT_TRADE_PATH}?${queryString}`)
            .digest('hex');
        
        const config ={
            headers:{
                'TAPI-ID': this.config.KEY,
                'TAPI-MAC': signature
            }
        }
            
        const response= await axios.post(ENDPOINT_TRADE_API, queryString, config);
    
        if (response.data.error_message) throw new Error(response.data.error_messege);
        return response.data.response_data
    }  
}




module.exports = {
    MercadoBitcoinTrade
}