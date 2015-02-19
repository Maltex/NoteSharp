angular.module('notesCtrl', ['angularMoment'])

	.controller('notesController', function($scope,
		                                    $http,
		                                    $firebase,
		                                    $q,
		                                    $window,
		                                    _,
		                                    notes) {

		// set data store url
		var dataURL = "https://shining-inferno-8888.firebaseio.com/notes";

		// firebase instance	
		var ref = new Firebase(dataURL);

		// Fetch notes on load
 		$scope.notes = notes.get(ref);
 		
 		// declare a watch to manage changes
		$scope.$watch('notes', function(){
			// count unread note
			$scope.getTotalUnread();

			// set latest unread note
			$scope.setLatestUnread();			
		}, true);

 		// spoof userid
 		var uid = 2;


		
		/*-------------------------------------------------- 
		 |
		 | Functions for filtering, displaying and performing
		 | actions against notes.
		 |
		 --------------------------------------------------*/

		/**
		 * Filter notes ignored by users
		 * 
		 */
		$scope.filterIgnored = function(){	
			return _.filter($scope.notes, function(note){
				// check not has ignore list
				if(note.hasOwnProperty('ignore_list'))
				{
					// return if uid not in ignore list
					return !_.some(note.ignore_list, function(itm){
						return itm.id == uid;
					});
				}
				return note;					
			});	
		};		
		
		/**
		 * Count unread notes
		 * 
		 */
		$scope.getTotalUnread = function(){			
			// get count of un-read notes that aren't ignored
			$scope.unreadNotes = _.reduce($scope.filterIgnored() , function(ret, note){
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
		
		/**
		 * Configure the latest un-read noted
		 * 
		 */
		$scope.setLatestUnread = function(){
			// default note 
			$scope.latestNote = {
				note: 'No un-read notes'
			};

			// if there are un-read notes, set the most recent
			if($scope.unreadNotes > 0)
			{
				// fetch all un-read notes that haven't been ignored
				var list = _.filter($scope.filterIgnored(), function(note){
					return !note.is_read;
				});	

				// set latest note to most recent item
				if(list.length > 0)
				{
					$scope.latestNote = _.last(list); 
				} 

				// set time of note to provide relativaty
				this.time = new Date($scope.latestNote.date);	
			}		
		}
 
		/**
		 * Mark a mark a note as read
		 * 
		 */
		$scope.setNoteRead = function(id){
			var itm = $scope.notes[id];
			itm.is_read = !itm.is_read;
			$scope.notes.$save(itm);
		};

		/**
		 * Mark a note as ignored
		 * 
		 */
		$scope.setNoteIgnored = function(id){
			var itm = $scope.notes[id];

			// check if this is the first ignore
			if(!itm.hasOwnProperty('ignore_list'))
			{				
				itm.ignore_list = [];
			}

			// push user id into list
			itm.ignore_list.push({
				'id': uid
			});

			$scope.notes.$save(itm);
		};

		/**
		 * Set relevant data for response to notes
		 *
		 */
		$scope.noteReply = false;
		$scope.toggleReply = function(){
			$scope.noteReply = !$scope.noteReply;
		}



		/*----------------------------------
		|
		| General functions
		|
		-----------------------------------*/

		/**
		 * Toggle the view size for larger notes
		 *
		 */
		$scope.setView = function(){
			$scope.viewLarge = !$scope.viewLarge;
			$scope.noteLarge = !$scope.noteLarge;
		}

 });