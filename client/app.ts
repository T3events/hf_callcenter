import {Component, View, NgZone, provide, enableProdMode} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {bootstrap} from 'angular2-meteor';
import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig, APP_BASE_HREF} from 'angular2/router';
import {CallCentersList} from 'client/call_centers-list/call_centers-list';
import {CallCenterDetails} from 'client/call_center-details/call_center-details';
import {CallPacketsList} from 'client/call_packets-list/call_packets-list';
import {CallPacketDetails} from 'client/call_packet-details/call_packet-details';
import {UserProfileDetails} from 'client/user_profile-details/user_profile-details';
import {CallSheetVeteran} from 'client/call_sheet_veteran/call_sheet_veteran';

@Component({
    selector: 'app'
})

@View({
    template: '<router-outlet></router-outlet>',
    directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
    { path: '/', as: 'CallCentersList', component: CallCentersList },
    { path: '/call_center/:callCenterId', as: 'CallPacketsList', component: CallPacketsList },
    { path: '/call_center/edit/:callCenterId', as: 'CallCenterDetails', component: CallCenterDetails },
    { path: '/call_packet/:callPacketId', as: 'CallPacket', component: CallPacketDetails },
    { path: '/call_sheet_veteran/:veteranCallSheetId', as: 'CallSheetVeteran', component: CallSheetVeteran },
    { path: '/user_profile/:userProfileId', as: 'UserProfileDetails', component: UserProfileDetails }
])

class HFCallCenter {} 

//enableProdMode();
bootstrap(HFCallCenter, [ROUTER_PROVIDERS, provide(APP_BASE_HREF, { useValue: '/' })]);
