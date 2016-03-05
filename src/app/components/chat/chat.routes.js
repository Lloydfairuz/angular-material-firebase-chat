export default function routes($stateProvider) {
  $stateProvider
    .state('chat', {
      template: require('./chat.jade'),
      controller: 'ChatController',
      controllerAs: 'chat',
      resolve: {
        "currentAuth": ["firebase", "user", "auth", (firebase, user, auth) => {
          if (auth.uid) {
            return user;
          }
          return firebase.auth.$requireAuth().then((data) => {
            // 認証成功
            // ユーザー情報保存
            user.user.id = data.google.id;
            user.user.displayName = data.google.displayName;
            user.user.profileImageURL = data.google.profileImageURL;

            // 認証情報保存
            auth.auth.provider = data.provider;
            auth.auth.uid = data.uid;
            auth.auth.expires = data.expires;
            auth.auth.token = data.token;
            auth.auth.accessToken = data.google.accessToken;
          });
        }],
        "users": ["firebase", "user", (firebase, user) => {
          return new Promise(resolve => {
            firebase.data.users().$loaded((users) => {
              user.users = users;
              let my = user.users.find(u => user.user.id === u.id);
              if (my) {
                user.user = my;
              } else {
                user.users.$add(user.user, u => {
                  user.user.$id = u.$id;
                });
              }
              resolve(users);
            });
          });
        }],
        "channels": ["firebase", "channel", (firebase, channel) => {
          channel.channels = firebase.data.channels();
          return channel.channels;
        }]
      }
    });
}

routes.$inject = ['$stateProvider'];