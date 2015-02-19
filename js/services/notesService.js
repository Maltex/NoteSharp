angular.module('notesService', [])
	// fetch all notes
	.factory("notes", ['$firebase', '$rootScope',
		function($firebase, $rootScope) {
			return {
				get: function(dataURL){
					// create a reference to the Firebase 
				    var ref = new Firebase(dataURL);

				    // return syncd array
				    return $firebase(ref).$asArray();
				}
			}		    
		}
	])
;