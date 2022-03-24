export class BridgeModel {

    private _db: any;

    public constructor(db:any) {

        this._db = db;
    }

    public  async writeDeposit(
        params:any,
        nonce:number,
        signature:string
    ) {

        try {

            let isExist = await this.isDepositExit(params.txid);
            if(!isExist){

                let bridgeSQL = "insert into bridge(txid,currency,value,sourceNetworkId,sourceWalletAddress,targetNetworkId,targetWalletAddress,nonce,signature,status) \
                               values(?,?,?,?,?,?,?,?,?,?)"
                await this._db.query(bridgeSQL,[
                    params.txid,params.currency,params.value,
                    params.sourceNetworkId,params.sourceWalletAddress,
                    params.targetNetworkId,params.targetWalletAddress,nonce,signature,0
                ]);
            }
        }catch (e) {
            console.log(e);
        }

    }

    public  async isDepositExit(txid:string):Promise<boolean>{

        //is depoist exit
        let bridgeSQL = "select count(*) as count from bridge where txid = ?"
        let dbRet = await this._db.query(bridgeSQL,[txid]);

        if(dbRet.length > 0){
            if(dbRet[0].count > 0){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }

    }

    //
    public  async getDepositRec(
        sourceWalletAddress:string,
        targetWalletAddress:string,
        sourceNetworkId:string,
        currency:string,
        status:number
    ) {

        try {

            let depoistSQL = "select \
                            txid hash ,\
                            sourceNetworkId srcChainId ,\
                            targetNetworkId destChainId ,\
                            nonce depositId ,\
                            sourceWalletAddress depositor ,\
                            targetWalletAddress recipient ,\
                            currency currency ,\
                            value amount ,\
                            signature signature \
                            from bridge \
                            where sourceWalletAddress = ? and targetWalletAddress = ? and sourceNetworkId = ? \
                            and currency = ? and status = ?"
            let dbRet = await this._db.query(depoistSQL,[sourceWalletAddress,targetWalletAddress,sourceNetworkId,currency,status]);
            
            console.log(depoistSQL);
            console.log([sourceWalletAddress,targetWalletAddress,sourceNetworkId,currency,status]);
            console.log(dbRet);
            
            if(dbRet.length > 0){
                if(dbRet.length > 0){
                    return dbRet;
                }else{
                    return [];
                }
            }else{
                return [];
            }
        }catch (e) {
            console.log(e);
        }

    }


    public  async setCrossResult(
        txid:string,
        targetTxid:string
    ) {

        try {

            let depoistSQL = "update bridge set targetTxid = ? , status = 1 where txid = ?"
            await this._db.query(depoistSQL,[targetTxid,txid]);

            console.log(depoistSQL);
            console.log([targetTxid,txid]);
           
        }catch (e) {
            console.log(e);
        }

    }



    

}