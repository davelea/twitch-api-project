// Default Twitch users to query
var twitchUsers = ['summit1g', 'shroud', 'freecodecamp',
                    'GeekandSundry', 'FeliciaDay', 'ESEA'];

var twitchData = [];

function createStreamURL(username) {
  return 'https://wind-bow.gomix.me/twitch-api/streams/' + username + '?callback=?';
}

function createChannelURL(username) {
  return 'https://wind-bow.gomix.me/twitch-api/channels/' + username + '?callback=?';
}

function createAlert(username) {
  var alertDiv = document.createElement('div');
  alertDiv.setAttribute('class', 'alert alert-success');
  alertDiv.setAttribute('role', 'alert');
  var alertText = document.createTextNode(username + ' added');
  alertDiv.append(alertText);
  document.getElementById('user-input-group').append(alertDiv);
}

function getChannelInfo() {
  twitchUsers.forEach(function(user) {
    $.ajax({
      type: 'GET',
      url: createChannelURL(user),
      async: false,
      dataType: 'json',
      success: function (data) {
        var channel = {
          'display_name': '',
          'game': '',
          'status': '',
          'url': '',
          'stream_type': '',
          'stream_preview_url': ''
        }

        channel.display_name = data.display_name;
        channel.game = data.game;
        channel.status = data.status;
        channel.url = data.url;

        $.ajax({
          type: 'GET',
          url: createStreamURL(user),
          async: false,
          dataType: 'json',
          success: function (data) {
            channel.stream_type = data.stream.stream_type;
          }
        });
        twitchData.push(channel);
      }
    });
  });
}

function buildUserList(usersToBuild) {
  // wait for objects to be built
  setTimeout(function() {
    for (var i = 0; i < usersToBuild.length; i++) {
      var tableRow = document.createElement('tr');
      var usernameCell = document.createElement('td');
      var usernameText = usersToBuild[i].display_name;
      usernameCell.append(usernameText);
      tableRow.append(usernameCell);

      var gameCell = document.createElement('td');
      gameCell.append(usersToBuild[i].game);
      tableRow.append(gameCell);

      var statusCell = document.createElement('td');
      statusCell.append(usersToBuild[i].status);
      tableRow.append(statusCell);

      var streamOnlineCell = document.createElement('td');
      if (twitchData[i].stream_type === 'live') {
        streamOnlineCell.append(usersToBuild[i].stream_type.charAt(0).toUpperCase() + usersToBuild[i].stream_type.slice(1));
      } else {
        streamOnlineCell.append('Offline');
      }
      tableRow.append(streamOnlineCell);

      var watchCell = document.createElement('td');
      var watchLink = document.createElement('a');
      watchLink.setAttribute('href', usersToBuild[i].url);
      watchLink.append('Watch');
      watchCell.append(watchLink);
      tableRow.append(watchCell);

      document.getElementById('user-list').append(tableRow);
    }
  }, 500);
}

$(document).ready(function() {

  $('#add-user').on('click', function() {
    twitchUsers.push(document.getElementById('username').value);
    createAlert(document.getElementById('username').value);
    document.getElementById('username').value = null;
  });
  getChannelInfo()
  buildUserList(twitchData);
});
