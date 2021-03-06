declare var process: any;

import {UserProfiles} from './user_profiles';
import {CallCenters} from './call_centers';
import {CallPackets} from './call_packets';

Meteor.methods({
  addCallCenter: function(callCenter: CallCenter) {
    var currentUserProfile = UserProfiles.findOne( { userId: this.userId } );
    var currentUserIsSystemAdmin = (!!currentUserProfile && currentUserProfile.isSystemAdmin);

    if (!currentUserIsSystemAdmin) {
      throw new Meteor.Error('401', 'Only system administrators can add new call centers.');
    }

    callCenter.flightName = callCenter.flightName.trim();
    let options = { auth: process.env.COUCH_AUTH };
    let response = HTTP.get(process.env.COUCH_URL + '/' + process.env.COUCH_DB + '/_design/basic/_view/flights?descending=true&limit=5', options);
    let flightList = JSON.parse(response.content);
    let flights = flightList.rows;
    let flightId = '';
    for (var i in flights) {
      if (flights[i].key[1] == callCenter.flightName) {
        flightId = flights[i].id;
        break;
      }
    }
    if (!flightId) {
      throw new Meteor.Error('404', 'Flight name does not exist in the flight database.');
    }
    var startDate = new Date(callCenter.startDate).toISOString();
    var endDate = new Date(callCenter.endDate).toISOString();
    callCenter.flightId  = flightId;
    callCenter.startDate = startDate.substring(0, startDate.indexOf('T'));
    callCenter.endDate   = endDate.substring(0, endDate.indexOf('T'));
    callCenter.callers   = [];
    callCenter.history   = [];
    callCenter.createdBy = currentUserProfile.name;
    callCenter.createdAt = new Date().toISOString();
    callCenter.updatedAt = new Date().toISOString();
    callCenter.isRemoved = false;

    CallCenters.insert(callCenter);
    console.log('*** Call Center created by: ' + currentUserProfile.name + '\n' + JSON.stringify(callCenter, null, '\t') );
  },
  updateProfile: function(userProfile: UserProfile) {
    var currentUserProfile = UserProfiles.findOne( { userId: this.userId } );
    var currentUserIsSystemAdmin = (!!currentUserProfile && currentUserProfile.isSystemAdmin);

    if (currentUserIsSystemAdmin) {
      UserProfiles.update(userProfile._id, {
        $set: {
          isSystemAdmin: userProfile.isSystemAdmin,
          isCenterAdmin: userProfile.isCenterAdmin,
          isValidated: userProfile.isValidated,
          isRemoved: userProfile.isRemoved
        }
      });
    }
    if (currentUserIsSystemAdmin || userProfile.userId == this.userId) {
      UserProfiles.update(userProfile._id, {
        $set: {
          name: userProfile.name,
          phone: userProfile.phone,
          email: userProfile.email,
          updatedBy: currentUserProfile.name + ' (' + this.userId + ')',
          updatedAt: new Date().toISOString()
        }
      });
      console.log('*** User profile updated by: '
        + currentUserProfile.name + ' (' + currentUserProfile.userId + ')' + '\n'
        + JSON.stringify(UserProfiles.findOne(userProfile._id), null, '\t') );
    } else {
      console.log('*** Unauthorized attempt to update profile by: '
        + currentUserProfile.name + ' (' + currentUserProfile.userId + ')' + '\n'
        + JSON.stringify(UserProfiles.findOne(userProfile._id), null, '\t') );
    }
  },
  getPublicUserInfoForProfile: function(profileId: string) {
    var userProfile = UserProfiles.findOne( { _id: profileId } );
    var user = Meteor.users.findOne( { _id: userProfile.userId } );
    let name = '';
    let email = '';
    if (user.emails && user.emails.length > 0 && user.emails[0].address) {
      name = email = user.emails[0].address;
    }
    if (user.services && user.services.google) {
      name = user.services.google.name;
      email = user.services.google.email;
    }
    if (user.services && user.services.facebook) {
      name = user.services.facebook.name;
      email = user.services.facebook.email;
    }
    let userInfo = <UserInfo> {
      name: name,
      email: email,
      createdAt: new Date(user.createdAt).toISOString()
    }
    return userInfo;
  },
  currentUserProfile: function() {
    return UserProfiles.findOne( { userId: this.userId } );
  },
  getVeteranListForFlight: function(callCenterId: string) {
    console.log('importCallSheets method on client');
    Meteor.call('importCallSheetsFromFlight',callCenterId);
  },
  updateDataFromFlight: function(callCenterId: string) {
    console.log('updateCallSheets method on client');
    Meteor.call('updateCallSheetsFromFlight',callCenterId);
  }
});
