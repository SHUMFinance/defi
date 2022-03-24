export class UserModel {

    private _db: any;

    public constructor(db:any) {

        this._db = db;
    }

    public  async writeUserAddress(address:string,chainID:string) {

        try {

            let lAddress = address.toLowerCase();

            //is user exit
            let userSQL = "select count(*) as count from users where address = ? and chainID = ?"
            let dbRet = await this._db.query(userSQL,[lAddress,chainID]);

            let count = 0;
            if(dbRet.length > 0){
                count = dbRet[0].count;
            }else{
                return;
            }

            if(count == 0){

                //is user exit
                userSQL = "insert into users(address,chainID) values(?,?)"
                await this._db.query(userSQL,[lAddress,chainID]);
            }
        }catch (e) {
            console.log(e);
        }

    }


    public  async getUserAddressList(chainID:number) :Promise<string[]>{

        try {
            console.log("xxl getUserAddressList ");
            //is user exit
            let userSQL = "select address from users where chainID = ?"
            let dbRet = await this._db.query(userSQL,[chainID]);

            let retAddress = [];
            if(dbRet.length > 0){
                dbRet.forEach(element => {
                    console.log("xxl 000 " + element["address"]);
                    retAddress.push(element["address"]);
                });
            }else{
                return retAddress;
            }

            return retAddress;

        }catch (e) {
            console.log(e);
            return [];
        }

    }



}