export class ExchangeModel {

    private _db: any;

    public constructor(db:any) {

        this._db = db;
    }


    public  async setExchangeApprove(
        txid:string,
        address:string
    ) {

        try {
            if(await this.isApproveExist(address) == false){
                let exchangeSQL = "insert into approve (txid,address) values(?,?)"
                await this._db.query(exchangeSQL,[txid,address]);

                console.log("xxl come  to approve setExhangeApprove ...");
                console.log(exchangeSQL);
                console.log([txid]);

            }
        }catch (e) {
            console.log(e);
        }

    }


    public  async isApproveExist (
        address:string
    ):Promise<boolean> {

        try {

            let exchangeSQL = "select * from approve where address = ?"
            let dbRet = await this._db.query(exchangeSQL,[address]);
            
            console.log("xxl come  to approve isExit ...");
            console.log(exchangeSQL);
            console.log([address]);

            if(dbRet.length == 0){
                return false;
            }else{
                return true;
            }
          
        }catch (e) {
            console.log(e);
            return false;
        }

    }

    public  async setExchangeRecord(
        chainID:string,
        txid:string,
        sourceKey:string,
        sourceAmount:string,
        destAddr:string,
        destKey:string
    ) {

        try {
            if(await this.isRecordExist(txid) == false){
                let exchangeSQL = "insert into exchange (chainID,txid,sourceKey,sourceAmount,destAddr,destKey) \
                                   values(?,?,?,?,?,?)"
                await this._db.query(exchangeSQL,[chainID,txid,sourceKey,sourceAmount,destAddr,destKey]);

                console.log("xxl come  to approve setExhangeApprove ...");
                console.log(exchangeSQL);
                console.log([chainID,txid,sourceKey,sourceAmount,destAddr,destKey]);

            }
        }catch (e) {
            console.log(e);
        }

    }


    public  async isRecordExist(
        txid:string
    ):Promise<boolean> {
        try {

            let exchangeSQL = "select * from exchange where txid = ?"
            let dbRet = await this._db.query(exchangeSQL,[txid]);
            
            console.log("xxl come  to approve isExit ...");
            console.log(exchangeSQL);
            console.log([txid]);

            if(dbRet.length == 0){
                return false;
            }else{
                return true;
            }
          
        }catch (e) {
            console.log(e);
            return false;
        }
    }

    public  async getExchangeRecord(
        address:string
    ):Promise<any> {

        try {

            let exchangeSQL = "select * from exchange where destAddr = ? order by id desc"
            let dbRet = await this._db.query(exchangeSQL,[address]);
            
            console.log("xxl come  to approve isExit ...");
            console.log(exchangeSQL);
            console.log([address]);

            if(dbRet.length == 0){
                return [];
            }else{
                return dbRet;
            }
          
        }catch (e) {
            console.log(e);
            return [];
        }


    }




}
