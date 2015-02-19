angular.module('notesCtrl', ['angularMoment'])

	.controller('notesController', function($scope,
		                                    $http,
		                                    $firebase,
		                                    $q,
		                                    _,
		                                    notes) {

		// set data store url
		var dataURL = "https://your-fb.firebaseio.com/notes";

		// Fetch notes on load
 		$scope.notes = notes.get(dataURL);

 		// spoof userid
 		$scope.uid = 1;
 		
 		// declare a watch to manage changes
		$scope.$watch('notes', function(){
			// count unread messages
			$scope.calculateUnread();

			// set latest unread
			$scope.setLatestUnread();			
		}, true);

		
		/*----------------------------------------------
		 |
		 | Begin functions
		 |
		 ---------------------------------------------*/

		// calculate unread messages
		$scope.calculateUnread = function(){
			// filter ignored notes
			var notIgnored = $scope.filterIgnored();

			// set old count
			var oldIgnored = $scope.unreadNotes;	

			// get count of remaining un-read
			$scope.unreadNotes = _.reduce(notIgnored , function(ret, note){
				// exit if corrupt obj
				if(!angular.isObject(note) && 
				   !not.hasOwnProperty('is_read'))
				{
					return;	
				} 

				// return based on is_read property
				return ret += !note.is_read ? 1 : 0;

			}, 0);
		}

		// filter ignored notes
		$scope.filterIgnored = function(){
			// configure unread notes			
			return _.filter($scope.notes, function(note){
				// if note has ignore list, check if user is in
				if(note.hasOwnProperty('ignore_list'))
				{
					// return if uid not in ignore list
					return !_.some(note.ignore_list, function(itm){
						return itm.id == $scope.uid;
					});
				}
				return note;					
			});	
		};

		// configure the latest un-read message
		$scope.setLatestUnread = function(){
			// filter ignored
			var notIgnored = $scope.filterIgnored();

			// default note 
			$scope.latestNote = {
				note: 'No un-read notes'
			};

			// un-read notes, set lates
			if($scope.unreadNotes > 0)
			{
				// filtered 
				$scope.filterIgnored()
				// check for lates Unread
				var list = _.filter(notIgnored, function(note){
					return !note.is_read;
				});			
				if(list.length > 0) $scope.latestNote = _.last(list); 

				// set the new time to give relativity
				this.time = new Date($scope.latestNote.date);	
			}		
		}
 
		// mark a note as read
		$scope.markNoteRead = function(id){
			var itm = $scope.notes[id];
			itm.is_read = !itm.is_read;
			$scope.notes.$save(itm);
		};

		// mark a note as read
		$scope.markNoteIgnored = function(id){
			var itm = $scope.notes[id];
			// check this isn't the first ignore
			if(!itm.hasOwnProperty('ignore_list'))
			{				
				itm.ignore_list = [];
			}

			// push user id into list
			itm.ignore_list.push({
				'id': $scope.uid
			});

			$scope.notes.$save(itm);
		};

 });