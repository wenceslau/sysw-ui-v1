// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

//http://177.54.159.86:8080/suite-api-sysmonkey


// const api_protocol = 'http://';
// const api_host = '177.54.159.86';
// const api_port = ':8080';
// const api_domain = '/suite-api-sysmonkey';

const api_protocol = 'http://';
const api_host = 'localhost';
const api_port = ':8084';
const api_domain = '';
//const home = 'CROPLIFE'
const home = 'SYSMONKEY'

export const environment = {
    home: home,
    version: '4.0.0.0',
    production: false,
    apuUrl: `${api_protocol}${api_host}${api_port}${api_domain}`,
    tokenWhitelistedDomains: [new RegExp(`${api_host}${api_port}`)],
    tokenBlacklistedRoutes: [new RegExp('/\/oauth\/token/')]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
