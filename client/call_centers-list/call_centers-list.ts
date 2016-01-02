/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/meteor-accounts-ui.d.ts" />

import {Component, View, NgZone} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {CallCenters} from 'collections/call_centers';
import {CallCentersForm} from 'client/call_centers-form/call_centers-form';
import {RouterLink} from 'angular2/router';
import {AccountsUI} from 'meteor-accounts-ui';

@Component({
    selector: 'app'
})

@View({
    templateUrl: 'client/call_centers-list/call_centers-list.html',
    directives: [NgFor, CallCentersForm, RouterLink, AccountsUI]
})

export class CallCentersList {
  callCenters: Array<CallCenter>;

  constructor (zone: NgZone) {
    Tracker.autorun(() => zone.run(() => {
      this.callCenters = CallCenters.find().fetch();
    }));
  }

  removeCallCenter(callCenter) {
    CallCenters.remove(callCenter._id);
  }
}
