// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

//
// Persistence via properties API
//
var win1 = Titanium.UI.createWindow({  
  url: 'properties.js',
  title:'Properties',
  backgroundColor:'#fff'
});
var tab1 = Titanium.UI.createTab({
  title:'Properties',
  window:win1
});

//
// File system persistence
//
var win2 = Titanium.UI.createWindow({  
  url:'filesystem.js',
    title:'Filesystem',
    backgroundColor:'#fff'
});
var tab2 = Titanium.UI.createTab({  
    title:'Filesystem',
    window:win2
});


//
// SQL database persistence
//
var win3 = Titanium.UI.createWindow({  
  url:'database.js',
    title:'Database',
    backgroundColor:'#fff'
});
var tab3 = Titanium.UI.createTab({  
    title:'Database',
    window:win3
});



//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  
tabGroup.addTab(tab3);

// open tab group
tabGroup.open();
Ti.API.info('Platform Width: '+Ti.Platform.displayCaps.platformWidth);
Ti.API.info('Platform Height: '+Ti.Platform.displayCaps.platformHeight);
Ti.API.info('Platform Density: '+Ti.Platform.displayCaps.density);
Ti.API.info('Platform dpi: '+Ti.Platform.displayCaps.dpi);