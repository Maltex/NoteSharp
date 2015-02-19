## Note Sharp

Note sharp is a simple asynchronous messaging system created with AngularFire. 
It provides a simple implementation that can be dropped into any existing web 
application and used to monitor in real time the arrival, response and locking
of notes.

## Data structure

The structure below reflects how the the data is stored and should give a better
understanding of how the information is retrieved, displayed and manipulated.

```json

notes {
	unique_id {
		author: '',
		date: '',
		is_read: '',
		note: '',
		ignored_by: {
			unique_id {
				user_id: ''
			}
		},
		reply_id {
			id: ''
			date_time: ''
		}
	}
}

```

N.B. unique_id is the randomly generated identifier from notes added by firebase during push operations.

## Implementation

This project will slowly be updated to provide a more broad and applicable tool. At this current time
(19/02/2015) it is being built in collaboration of an existing proprietry piece of software and attempts
are being made to extract the core functionality. This is to prevent it from being holstered to structure
of a piece of software that it was being integrated with. As such, efforts will be made to spoof any data that would have otherwise been relevant during it's conception.

E.G. The user_id under ignored_by: this would be assigned through authentication in a different system. It is up to you how you want to spoof or adapt it. 
