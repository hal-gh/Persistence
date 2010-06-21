var win = Titanium.UI.currentWindow;
win.backgroundColor = '#fff';
win.layout = 'vertical';
var currentNote = '';
var db = Titanium.Database.open('todos');

var CONTROL_HEIGHT = 34; 
	
db.execute('CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, todo TEXT)');

// Workaround for problems using percentage widths and heights up to and including Ti 1.2.1
function percentageToPixels(type,percent,margins,length) {
//	if ( !(type == 'width') && !(type == 'height') )
//	{
		Ti.UI.createAlertDialog({
				title: 'Error',
				message: 'type argument (width/height) not set',
				buttonNames:'OK'
		}).show;
//	}
		
	if (margins == null) {
		margins = 0;
	}
	if (length == null) {
		if(type == 'height') {
			length = Ti.Platform.displayCaps.platformHeight-(margins*2);
		} else {
			length = Ti.Platform.displayCaps.platformWidth-(margins*2);
		}
	}

	return new Number((length * (percent/100))).toFixed(0);
}

//create data entry view
var entryView = Ti.UI.createView({
  height:'auto',
  width:percentageToPixels('width',100)
});

var controlsView = Ti.UI.createView({
	backgroundColor:'#6C6C6C',
	height:'auto',
	width:percentageToPixels('width',100)
});

var controlsViewEdit = Ti.UI.createView({
	backgroundColor:'#6C6C6C',
	height:'auto',
	width:percentageToPixels('widt',100),
	top:1 // just for testing
});

var tf1 = Titanium.UI.createTextField({
	autocorrect:false,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	font:{fontSize:14},
	height:CONTROL_HEIGHT,
	hintText:'Enter a note...',
	left:percentageToPixels('width',1,1,entryView.width),
	width:percentageToPixels('width',70,1,entryView.width),
	verticalAlign:'middle' //testing
});

tf1.addEventListener('return', function() {
	tf1.blur();
});

tf1.addEventListener("change", function(e) {
  currentNote = e.value;
  if (currentNote == '') {
    b1.enabled = false;
  }
  else {
    b1.enabled = true;
  }
});
controlsView.add(tf1);

var b1 = Titanium.UI.createButton({
	enabled:false,
	height:CONTROL_HEIGHT,
	left:percentageToPixels('width',74,1,entryView.width),
	title:'Save',
	width:percentageToPixels('width',25,1,entryView.width)
});
controlsView.add(b1);

entryView.add(controlsView);


//This is the array we'll use to back the table view
var data = [];

//Get data for tableview
var rows = db.execute('SELECT * FROM todos');
while (rows.isValidRow()) {
  data.push({
    title: rows.fieldByName('todo'),
    id: rows.fieldByName('id')
  });
	rows.next();
}
rows.close();

// create table view
var tableview = Titanium.UI.createTableView({
	backgroundColor:'#EDECEB',
	data:data,
	editable:true,
//	height:Ti.Platform.displayCaps.platformHeight-200
	bottom: percentageToPixels('height',15,0)
});

// create table view event listener
tableview.addEventListener('click', function(e) {
	Titanium.UI.createAlertDialog({
	  title:'DB Test', 
	  message:'Now would be a perfect time to update the record at index ' + e.rowData.id 
	}).show();
});

// add delete event listener
tableview.addEventListener('delete',function(e) {
  db.execute("DELETE FROM todos WHERE id = ?", e.rowData.id);
});

//Add event listener for save button
b1.addEventListener("click", function(e) {
	controlsViewEdit.hide;
  if (b1.enabled) {
    db.execute('INSERT INTO todos (todo) VALUES(?)',currentNote);
    var last = db.execute("SELECT * FROM todos ORDER BY id DESC LIMIT 1");
    tableview.appendRow({
      title:last.fieldByName('todo'),
      id:last.fieldByName('id')
    });
    last.close();
    currentNote = '';
    tf1.value = '';
    tf1.blur();
    b1.enabled = false;
  }
});

//
//  create edit/cancel buttons for nav bar
//
var edit = Titanium.UI.createButton({
	title:'Edit',
	height: CONTROL_HEIGHT,
	left:percentageToPixels('width',15,0,entryView.width),
	width:percentageToPixels('width',25,0,entryView.width)
});

var cancel = Titanium.UI.createButton({
	title:'Cancel',
	height: CONTROL_HEIGHT,
	right:percentageToPixels('width',15,0,entryView.width),
	width:percentageToPixels('width',25,0,entryView.width)
//	style:Titanium.UI.iPhone.SystemButtonStyle.DONE
});


edit.addEventListener('click', function() {
	if (Ti.Platform.osname == 'iphone') {
		win.setRightNavButton(cancel);
	} else {
//		controlsViewSub.add(cancel);
	}
	tableview.editing = true;
});
cancel.addEventListener('click', function() {
	if (Ti.Platform.osname == 'iphone') {
		win.setRightNavButton(edit);
	} else {
//		controlsViewSub.add(edit);
	}
	tableview.editing = false;
});

controlsViewEdit.add(edit);
controlsViewEdit.add(cancel);

win.add(entryView);
win.add(controlsViewEdit);

//add table view to the window
win.add(tableview);