/* Imports: External */
import * as dotenv from 'dotenv'
import Config from 'bcfg'

/* Imports: Internal */
import { DataTransportService } from './main/service'

interface Bcfg {
    load: (options: { env?: boolean; argv?: boolean }) => void
    str: (name: string, defaultValue?: string) => string
    uint: (name: string, defaultValue?: number) => number
    bool: (name: string, defaultValue?: boolean) => boolean
}

;(async () => {
    
    dotenv.config()
    const config: Bcfg = new Config('shum-svr')
    config.load({
        env: true,
        argv: true,
    })

    console.log(config.uint('callFrequency', 10));

    const service = new DataTransportService({

        dbConf:{
            host:       config.str('dbHost', ''),
            user:       config.str('dbUser', ''),
            password:   config.str('dbPassword', ''),
            name:       config.str('dbName', ''),
            port:       config.uint('dbPort',3306),
        },

        serverHost :  config.str('serverHost', ""),
        serverPort :  config.uint('serverPort', 7789),
        bscRPC     :  config.str('bscRPC', "0x01"),
        bscPriv    :  config.str('bscPriv', "0x01"),
        ethRPC     :  config.str('ethRPC', "0x01"),
        ethPriv    :  config.str('ethPriv', "0x01"),
        callFrequency:config.uint('callFrequency', 600),

        contractInfo:{
            pRadio:            config.uint('pRadio', 500),

            bscCollateralSystem:  config.str('bscCollateralSystem', ''),
            bscRewardSystem:      config.str('bscRewardSystem', ''),
            bscDebtSystem:        config.str('bscDebtSystem', ''),
            bscSafeDecimalMath:   config.str('bscSafeDecimalMath', ''),

            ethCollateralSystem:  config.str('ethCollateralSystem', ''),
            ethRewardSystem:      config.str('ethRewardSystem', ''),
            ethDebtSystem:        config.str('ethDebtSystem', ''),
            ethSafeDecimalMath:   config.str('ethSafeDecimalMath', ''),
            
            adminPriv:         config.str('adminPriv', ''),
            bscChainId:        config.uint('bscChainId', 97),
            ethChainId:        config.uint('ethChainId', 42),

            bscSafeAddress:  config.str('bscSafeAddress', ''),
            bscBridgeAddress:  config.str('bscBridgeAddress', ''),
            bscExchangeAddress:  config.str('bscExchangeAddress', ''),
            
            ethSafeAddress:  config.str('ethSafeAddress', ''),
            ethBridgeAddress:  config.str('ethBridgeAddress', ''),
            ethExchangeAddress:  config.str('ethExchangeAddress', '')
        }
    })

    await service.start()

})()
