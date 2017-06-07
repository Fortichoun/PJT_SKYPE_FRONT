angular.module('myApp')
// This controller handle the user login/registration
    .controller('VideoCallController',
        ($scope, $route, $rootScope, socket, $http, $location, $stateParams, $compile, HOST_CONFIG) => {
          $scope.room = $stateParams.room;
          let userInRoomToken = 0;
          let token = 0;

            // grab the room from the URL
          let room = location.search && location.search.split('?')[1];

            // create our webrtc connection
          const webrtc = new SimpleWebRTC({
                // the id/element dom element that will hold "our" video
            localVideoEl: 'localVideo',
                // the id/element dom element that will hold remote videos
            remoteVideosEl: '',
            autoRequestMedia: false,
            debug: false,
            media: { video: true, audio: true },
            detectSpeakingEvents: true,
            autoAdjustMic: false,
            url: `http://${HOST_CONFIG.url}:8888/`,
            socketio: { forceNew: true },
          });

            webrtc.on('channelMessage', function(peer, label, data) {
                if (label === 'requestChat') {
                    userInRoomToken = 0;
                    $scope.errorMessage = "";
                    let container = document.getElementById('acceptCall');
                    if (data.payload.media === 'video') {
                        container.innerHTML = `<button id="accept" ng-click='acceptCall("video")'>Accept video call from ${data.payload.userName}</button>
                        <button id="refuse" ng-click='refuseCall()'>Refuse video call from ${data.payload.userName}</button>`;
                    }
                    else if (data.payload.media === 'audio') {
                        container.innerHTML = `<button id="accept" ng-click='acceptCall("audio")'>Accept audio call from ${data.payload.userName}</button>
                        <button id="refuse" ng-click='refuseCall()'>Refuse audio call from ${data.payload.userName}</button>`;
                    }
                    $compile(container)($scope);
                }
                if (label === 'startVideo') {
                    const container = document.getElementById('acceptCall');
                    container.innerHTML = '<button id="endCall" ng-click="endCall()">End call</button>';
                    $compile(container)($scope);
                    if (data.payload.media === 'audio') {
                        webrtc.media = { audio: true, video: false };
                        webrtc.receiveMedia = { offerToReceiveAudio: 1, offerToReceiveVideo: 0 };
                    }
                    webrtc.startLocalVideo();
                }
                if (label === 'refuseVideo') {
                    userInRoomToken++;
                    if (userInRoomToken === webrtc.getPeers().length) {
                    let container = document.getElementById('acceptCall');
                        container.innerHTML = `<button id="callRoom" ng-click="callRoom()">Video call users in room</button>
                                               <button id="audioRoom" ng-click="audioRoom()">Audio call users in room</button>`;
                        $compile(container)($scope);
                    }
                }
            });

            $scope.acceptCall = (media) => {
                const container = document.getElementById('acceptCall');
                container.removeChild(document.getElementById('accept'));
                container.removeChild(document.getElementById('refuse'));
                container.innerHTML = '<button id="endCall" ng-click="endCall()">End call</button>';
                $compile(container)($scope);
                if (media === 'audio') {
                    webrtc.media = { audio: true, video: false };
                    webrtc.receiveMedia = { offerToReceiveAudio: 1, offerToReceiveVideo: 0 };
                }                console.log(webrtc);
                webrtc.sendDirectlyToAll('startVideo', 'startVideo', {userName: $scope.user.userName, media});
                webrtc.startLocalVideo();
            };

            $scope.refuseCall = () => {
                const container = document.getElementById('acceptCall');
                container.removeChild(document.getElementById('accept'));
                container.removeChild(document.getElementById('refuse'));
                container.innerHTML = `<button id="callRoom" ng-click="callRoom()">Video call users in room</button>
                                       <button id="audioRoom" ng-click="audioRoom()">Audio call users in room</button>`;
                $compile(container)($scope);
                webrtc.sendDirectlyToAll('refuseVideo', 'refuseVideo', {userName: $scope.user.userName});
            };

            $scope.callRoom = () => {
                if ( webrtc.getPeers().length !== 0 ) {
                const container = document.getElementById('acceptCall');
                container.removeChild(document.getElementById('callRoom'));
                container.removeChild(document.getElementById('audioRoom'));
                webrtc.sendDirectlyToAll('requestChat', 'message', {userName: $scope.user.userName, media: 'video'});
                } else {
                    $scope.errorMessage = "No one is present in your room right now!";
                }
            };

            $scope.audioRoom = () => {
                if ( webrtc.getPeers().length !== 0 ) {
                const container = document.getElementById('acceptCall');
                container.removeChild(document.getElementById('callRoom'));
                container.removeChild(document.getElementById('audioRoom'));
                webrtc.sendDirectlyToAll('requestChat', 'message', {userName: $scope.user.userName, media: 'audio'});
                } else {
                    $scope.errorMessage = "No one is present in your room right now!";
                }
            };

            $scope.endCall = () => {
                // const container = document.getElementById('acceptCall');
                // container.removeChild(document.getElementById('endCall'));
                // container.innerHTML = `<button id="callRoom" ng-click="callRoom()">Video call users in room</button>
                //                        <button id="audioRoom" ng-click="audioRoom()">Audio call users in room</button>`;
                // $compile(container)($scope);
                //
                // const remoteVideoAudio = document.getElementById('remotes');
                // while (remoteVideoAudio.firstChild) remoteVideoAudio.removeChild(remoteVideoAudio.firstChild);
                //
                // const localVideoAudio = document.getElementById('videoContainerLocal');
                // localVideoAudio.removeChild(document.getElementById('localVideo'));
                // localVideoAudio.removeChild(document.getElementById('localVolume'));
                //
                // localVideoAudio.innerHTML = `<video id="localVideo" oncontextmenu="return false;"></video>
                //                              <div id="localVolume" class="volume_bar"></div>`;

                // webrtc.sendDirectlyToAll('endCall', 'endCall', {userName: $scope.user.userName});
                // webrtc.disconnect();
                // $route.reload();

                webrtc.stopLocalVideo();
                webrtc.leaveRoom();
                room = $scope.room._id;
                if (room) webrtc.joinRoom(`${room}home`);
            };

            // when it's ready, join if we got a room from the URL
          webrtc.on('readyToCall', () => {
              room = $scope.room._id;
              if (room) webrtc.joinRoom(room);
          });

            webrtc.on('connectionReady', function () {
                console.log('joined room');
                console.log(`${room}home`);
                room = $scope.room._id;
                if (room) webrtc.joinRoom(`${room}home`);
            });

          function showVolume(el, volume) {
            if (!el) return;
            if (volume < -45) volume = -45; // -45 to -20 is
            if (volume > -20) volume = -20; // a good range
            el.value = volume;
          }

            // we got access to the camera
          webrtc.on('localStream', (stream) => {
            const button = document.querySelector('form>button');
            if (button) button.removeAttribute('disabled');
            $('#localVolume').show();
          });
            // we did not get access to the camera
          webrtc.on('localMediaError', (err) => {
              console.log('error');
              console.log(err);
          });

            // local screen obtained
          webrtc.on('localScreenAdded', (video) => {
            video.onclick = function () {
              video.style.width = `${video.videoWidth}px`;
              video.style.height = `${video.videoHeight}px`;
            };
            document.getElementById('localScreenContainer').appendChild(video);
            $('#localScreenContainer').show();
          });
            // local screen removed
          webrtc.on('localScreenRemoved', (video) => {
            document.getElementById('localScreenContainer').removeChild(video);
            $('#localScreenContainer').hide();
          });

            // a peer video has been added
          webrtc.on('videoAdded', (video, peer) => {
            console.log('video added', peer);
            const remotes = document.getElementById('remotes');
            if (remotes) {
              const container = document.createElement('div');
              container.className = 'videoContainer';
              container.id = `container_${webrtc.getDomId(peer)}`;
              container.appendChild(video);

                    // suppress contextmenu
              video.oncontextmenu = function () { return false; };

                    // show the remote volume
              const vol = document.createElement('meter');
              vol.id = `volume_${peer.id}`;
              vol.className = 'volume';
              vol.min = -45;
              vol.max = -20;
              vol.low = -40;
              vol.high = -25;
              container.appendChild(vol);

                    // show the ice connection state
              if (peer && peer.pc) {
                const connstate = document.createElement('div');
                connstate.className = 'connectionstate';
                container.appendChild(connstate);
                peer.pc.on('iceConnectionStateChange', (event) => {
                  switch (peer.pc.iceConnectionState) {
                    case 'checking':
                      connstate.innerText = 'Connecting to peer...';
                      break;
                    case 'connected':
                    case 'completed': // on caller side
                      $(vol).show();
                      connstate.innerText = 'Connection established.';
                      break;
                    case 'disconnected':
                      connstate.innerText = 'Disconnected.';
                      break;
                    case 'failed':
                      connstate.innerText = 'Connection failed.';
                      break;
                    case 'closed':
                      connstate.innerText = 'Connection closed.';
                      break;
                  }
                });
              }
              remotes.appendChild(container);
            }
          });
            // a peer was removed
          webrtc.on('videoRemoved', (video, peer) => {
            if (webrtc.getPeers().length === 0) {
                // webrtc.disconnect();
                // $route.reload();
                webrtc.stopLocalVideo();
                webrtc.leaveRoom();
                room = $scope.room._id;
                if (room) webrtc.joinRoom(`${room}home`);
                const container = document.getElementById('acceptCall');
                container.removeChild(document.getElementById('endCall'));
                container.innerHTML = `<button id="callRoom" ng-click="callRoom()">Video call users in room</button>
                                       <button id="audioRoom" ng-click="audioRoom()">Audio call users in room</button>`;
                $compile(container)($scope);

                const localVideoAudio = document.getElementById('videoContainerLocal');
                localVideoAudio.removeChild(document.getElementById('localVideo'));
                localVideoAudio.removeChild(document.getElementById('localVolume'));

                localVideoAudio.innerHTML = `<video id="localVideo" oncontextmenu="return false;"></video>
                                             <div id="localVolume" class="volume_bar"></div>`;
                $compile(localVideoAudio)($scope);
            }
            const remotes = document.getElementById('remotes');
            const el = document.getElementById(peer ? `container_${webrtc.getDomId(peer)}` : 'localScreenContainer');
            if (remotes && el) {
              remotes.removeChild(el);
            }
          });

            // local volume has changed
          webrtc.on('volumeChange', (volume, treshold) => {
            showVolume(document.getElementById('localVolume'), volume);
          });
            // remote volume has changed
          webrtc.on('remoteVolumeChange', (peer, volume) => {
            showVolume(document.getElementById(`volume_${peer.id}`), volume);
          });

            // local p2p/ice failure
          webrtc.on('iceFailed', (peer) => {
            const connstate = document.querySelector(`#container_${webrtc.getDomId(peer)} .connectionstate`);
            console.log('local fail', connstate);
            if (connstate) {
              connstate.innerText = 'Connection failed.';
              // fileinput.disabled = 'disabled';
            }
          });

            // remote p2p/ice failure
          webrtc.on('connectivityError', (peer) => {
            const connstate = document.querySelector(`#container_${webrtc.getDomId(peer)} .connectionstate`);
            console.log('remote fail', connstate);
            if (connstate) {
              connstate.innerText = 'Connection failed.';
              fileinput.disabled = 'disabled';
            }
          });

            // Since we use this twice we put it here
          function setRoom(name) {
            document.querySelector('form').remove();
            document.getElementById('title').innerText = `Room: ${name}`;
            document.getElementById('subTitle').innerText = `Link to join: ${location.href}`;
            $('body').addClass('active');
          }

          if (room) {
            setRoom(room);
          }
            $rootScope.$on('$locationChangeStart', function(event, toUrl, fromUrl) {
                // console.log('hey');
                // console.log(toUrl);
                // console.log(fromUrl);
                // console.log(event);
                console.log(window.location.hash.substring(2));
                console.log($scope.room.typeOfRoom);
                console.log(`${$scope.room.typeOfRoom}/${$scope.room._id}`);
                if (token ===  0 && window.location.hash.substring(2) === `${$scope.room.typeOfRoom}/${$scope.room._id}`) {
                // if (token === 0 && toUrl.toString() === "http://localhost:8000/home/groups" && fromUrl.toString() === `http://localhost:8000/groups/${room}` ) {
                    console.log('disconnect');
                    token++;
                    webrtc.leaveRoom();
                    webrtc.disconnect();
                    $route.reload();
                }
            });
        });
