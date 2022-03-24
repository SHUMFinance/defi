export class RewardsModel {

    private _db: any;

    public constructor(db:any) {

        this._db = db;
    }

    public  async setRewards(chainId:number,address:string,total:string,lastStart:string) {

        try {

            let lAddress = address.toLowerCase();
            let isExist = await this.isAddressAndChainIdExist(chainId,address);
            if(isExist){
                if(await this.isTimeNewer(chainId,lAddress,lastStart) == false){
                    await this.updateRewards(chainId,lAddress,total,lastStart);
                }
                await this.updateRewards(chainId,lAddress,total,lastStart);
            }else{
                await this.insertRewards(chainId,lAddress,total,lastStart);
            }

        }catch (e) {
            console.log(e);
        }

    }

    public async isTimeNewer(chainId,address,lastStart){
        
        try {
            console.log("xxl get User Address and chainId ");
            //is user exit
            let selSQL = "select lastStart as lastStart from rewards where chainId = ? and address = ? "
            let dbRet = await this._db.query(selSQL,[chainId,address]);
            console.log(dbRet);
            if(dbRet.length > 0){
                if(parseInt(dbRet[0].lastStart) >= lastStart){
                    console.log("isTimeNewer come");
                    return true
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
            return false;
        }
    }

    public async getRewards(chainID:string,address:string){

        try {
            console.log("xxl get User Address and chainId ");
            //is user exit
            let selSQL = "select * from rewards where chainId = ? and address = ? "
            let dbRet = await this._db.query(selSQL,[chainID,address]);

            if(dbRet.length > 0){
               return dbRet[0];
            }else{
               return null;
            }
        }catch (e) {
            console.log(e);
            return null;
        }

    }

    public async insertRewards(
        chainId:number,
        address:string,
        total:string,
        lastStart:string
    ){

        try {
            //is user exit
            let userSQL = "insert into rewards(chainID,address,total,lastStart) values(?,?,?,?)"
            await this._db.query(userSQL,[chainId,address,total,lastStart]);
        }catch (e) {
            console.log(e);
        }
    }

    public async updateRewards(
        chainId:number,
        address:string,
        total:string,
        lastStart:string
    ){
        try {
            //is user exit
            let userSQL = "update rewards set total = ?,lastStart = ? where chainID=? and address=?"
            await this._db.query(userSQL,[total,lastStart,chainId,address]);
        }catch (e) {
            console.log(e);
        }
    }

    public  async isAddressAndChainIdExist(
        chainID:number,
        address:string
        ) :Promise<boolean>{

        try {
            console.log("xxl get User Address and chainId ");
            //is user exit
            let userSQL = "select address from rewards where chainId = ? and address = ? "
            let dbRet = await this._db.query(userSQL,[chainID,address]);

            let retAddress = [];
            if(dbRet.length > 0){
               return true;
            }else{
               return false;
            }
        }catch (e) {
            console.log(e);
            return false;
        }

    }



}