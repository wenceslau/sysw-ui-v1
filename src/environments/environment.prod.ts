 const version = '4.0.2.9';

/** HML V4 Azure **/
// const host = '127.0.0.1';
// const port = '8084';
// const domain = '';
// const home = 'SYSMONKEY'

/** Local Host fat jar **/
// const host = '127.0.0.1';
// const port = '8080';
// const domain = '/suite-api';
// const home = 'SYSMONKEY'

/** Callink **/
// const host = '10.33.4.173';
// const port = '8080';
// const domain = '/suite-api';
// const home = 'SYSMONKEY'

/** PMO Azure **/
const host = '191.232.210.62';
const port = '8080';
const domain = '/suite-api-hml-v4';
const home = 'SYSMONKEY'

/** SysMonkey V4 Absam USA **/
// const host = '45.35.215.135';
// const port = '8080';
// const domain = '/suite-api-sysmonkey';
// const home = 'SYSMONKEY'

/** SysMonkey V4 Absam BR **/
// const host = '177.54.159.86';
// const port= '8080';
// const domain = '/suite-api-sysmonkey';
// const home = 'SYSMONKEY'

/** SysMonkey V4 Absam BR **/
// const host = '177.54.159.86';
// const port= '8080';
// const domain = '/suite-api-croplife'; 
// const home = 'CROPLIFE'


/** Kubernets **/
// const host = '159.203.158.170';
// const port = '8084';
// const domain = '';
// const home = 'SYSMONKEY'

/** 
 * 
 ____  _____        _          ___       ________   ______     _____   _________        _        _______     
|_   \|_   _|      / \       .'   `.    |_   __  | |_   _ `.  |_   _| |  _   _  |      / \      |_   __ \    
  |   \ | |       / _ \     /  .-.  \     | |_ \_|   | | `. \   | |   |_/ | | \_|     / _ \       | |__) |   
  | |\ \| |      / ___ \    | |   | |     |  _| _    | |  | |   | |       | |        / ___ \      |  __ /    
 _| |_\   |_   _/ /   \ \_  \  `-'  /    _| |__/ |  _| |_.' /  _| |_     _| |_     _/ /   \ \_   _| |  \ \_  
|_____|\____| |____| |____|  `.___.'    |________| |______.'  |_____|   |_____|   |____| |____| |____| |___| 

Mexer so nas variaveis acima!!!!!!

**/

const protocol = 'http://';
const sep1 = ':';
const sep2 = '';

export const environment = {
    home: home,
    version: version,
    production: false,
    apuUrl: `${protocol}${host}${sep1}${port}${sep2}${domain}`,
    tokenWhitelistedDomains: [host + sep1 + port, domain],
    tokenBlacklistedRoutes: [new RegExp('/\/oauth\/token/')]
};


//Last reference point merge 3.14 to 4.0.2.0, 2021-06-14