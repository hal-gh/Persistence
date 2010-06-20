var win = Titanium.UI.currentWindow;
win.layout = 'vertical';
var currentNote = '';
var db = Titanium.Database.open('todos');
db.execute('CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, todo TEXT)');

//create data entry view
var entryView = Ti.UI.createView({
  backgroundColor:'#0060AA',
  width:'auto',
  height:100,
  top:5
});

var controlsView = Ti.UI.createView({
  width:'auto',
  height:50
});

var controlsViewSub = Ti.UI.createView({
	  width:'auto',
	  height:50
	});

var b1 = Titanium.UI.createButton({
	title:'Save',
	width:'25%',
	height:35,
	right:0,
	enabled:false
});
controlsView.add(b1);

var tf1 = Titanium.UI.createTextField({
	width:'25%',
	height:35,
	left:0,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	autocorrect:false,
	hintText:'Enter a note...'
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

entryView.add(controlsView);
win.add(entryView);

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
	top:200
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

// add table view to the window
Titanium.UI.currentWindow.add(tableview);

//Add event listener for save button
b1.addEventListener("click", function(e) {
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
	title:'Edit'
});
var cancel = Titanium.UI.createButton({
	title:'Cancel',
	style:Titanium.UI.iPhone.SystemButtonStyle.DONE
});

if (Ti.Platform.osname == 'iphone') {
	edit.addEventListener('click', function() {
		win.setRightNavButton(cancel);
		tableview.editing = true;
	});
	cancel.addEventListener('click', function() {
		win.setRightNavButton(edit);
		tableview.editing = false;
	});

	win.setRightNavButton(edit);	
}

//if (Ti.Platform.osname == 'android') {
//	controlsViewSub.add(edit);
//	controlsViewSub.add(cancel);
//}