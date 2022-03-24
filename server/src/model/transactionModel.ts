export class TransactionModel {

    private _db: any;

    public constructor(db:any) {

        this._db = db;
    }


    public  async setTransactionRecord(
        txid:string,
        from:string,
        to:string,
        value:string,
        txType:string,
        chain:string
    ) {

        try {
            let transationSQL = "insert into transaction(txid,txFrom,txTo,txValue,txType,txChain) \
                                values(?,?,?,?,?,?)"
            await this._db.query(transationSQL,[txid,from,to,value,txType,chain]);

            console.log("xxl come  to approve setExhangeApprove ...");
            console.log(transationSQL);
            console.log([txid,from,to,value,txType,chain]);
        }catch (e) {
            console.log(e);
        }

    }

    public  async getTransactionRecord(
        address:string
    ):Promise<any> {

        try {

            let transationSQL = "select txid,txFrom,txValue,txType,txChain,DATE_FORMAT(createdAt,'%Y-%m-%d %h:%i:%s') as createdAt from transaction where txFrom = ? order by id desc"
            let dbRet = await this._db.query(transationSQL,[address]);
            
            console.log("xxl come  to approve isExit ...");
            console.log(transationSQL);
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
