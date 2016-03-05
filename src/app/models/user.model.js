import angular from 'angular';

class UserModel {
  constructor() {
    this.users = [];
    this.user = {
      id: '',
      displayName: '',
      profileImageURL: ''
    }
  }
}

export default angular.module('models.user', [])
  .service('user', UserModel)
  .name;