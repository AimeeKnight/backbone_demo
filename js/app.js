(function ($) {
 
  var contacts = [
    { name: "Contact 1", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
    { name: "Contact 2", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
    { name: "Contact 3", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
    { name: "Contact 4", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
    { name: "Contact 5", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
    { name: "Contact 6", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
    { name: "Contact 7", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
    { name: "Contact 8", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" }
  ];

  var Contact = Backbone.Model.extend({
    defaults: {
      photo: "img/placeholder.png"
    }
  });

  var Directory = Backbone.Collection.extend({
    model: Contact
  });    

  var ContactView = Backbone.View.extend({
    //set container for view to be 'article' rather than default 'div'
    tagName: "article",
    //set class name for article container
    className: "contact-container",
    //cached reference to template in HTML
    template: $("#contactTemplate").html(),
   
    render: function(){
      //When passed a single arg to 'template' containing a template 
      //Underscore doesn’t invoke 'template' immediately but 
      //will return a method 'tmpl' that can be called
      //to actually render the template
      var tmpl = _.template(this.template);
      //set article HTML to template by setting 'tmpl' as HTML 
      //then call 'tmpl' passing model to interpolate
      this.$el.html(tmpl(this.model.toJSON()));
      return this;
    }
  });

  var DirectoryView = Backbone.View.extend({
    //grab div with contacts id to use as default div
    el: $("#contacts"),
   
    initialize: function (){
      //create instance of collection class passing in contacts array to it's models
      this.collection = new Directory(contacts);
      //call own render defined below making view self-rendering
      this.render();
      //append each contact type to create dropdown filter via 'createSelect' function
      this.$el.find("#filter").append(this.createSelect());
      //when the views filterType event fires call 'filterByType' callback specifying 'this'
      //as its argument (via the third argument to 'on')
      this.on("change:filterType", this.filterByType, this);
      //when “reset” event triggered on 'contacts', render method called specifying 'this'
      //as its argument (via the third argument to 'on')
      this.collection.on("reset", this.render, this);
    },
 
    //define render method for master view
    render: function () {
      //store reference to view so we can access it with callback
      var that = this;
      //on render, remove all previous contacts that were there
      this.$el.find("article").remove();
      //iterate over each contact model in collection
      //within .each 'this' refers to new Directory collection obj
      _.each(this.collection.models, function (item){
          that.renderContact(item);
      }, this);
    },
 
    renderContact: function (item) {
      //create new contactView
      var contactView = new ContactView({
          //set model for contactView
          model: item
      });
      //append each contactView to the master DirectoryView first calling 
      //render on the contactView to get the article el
      this.$el.append(contactView.render().el);
    },
    //grab all the 'type' from the contacts collection
    getTypes: function () {
      return _.uniq(this.collection.pluck("type"));
    },
    createSelect: function () {
      select = $("<select/>", {
      html: "<option>All</option>"
      });
      //iterate over the 'types' in the contact collection creating
      //an option element for each type
      _.each(this.getTypes(), function (item) {
        var option = $("<option/>", {
            value: item.toLowerCase(),
            text: item.toLowerCase()
        //append to the options created to the select element created
        }).appendTo(select);
      });      
      return select;
    },
    //add functionality to select a filter by
    //add UI event handler by setting DirectoryView events property
    //events accepts object of key:value pairs 
    //key specifies type of event and selector to bind event handler to
    //change event will be fired by select element within #filter container
    events: {
      "change #filter select": "setFilter"
    },
    //Set filterType property for DirectoryView initialize function
    setFilter: function(e){
      this.filterType = e.currentTarget.value;
      //fire change event to which calls 'filterByType' to
      //reset collection to all or selected 'filteredType'
      this.trigger("change:filterType");
    },
    //define filter for the view to be called in DirectoryView initialize function
    filterByType: function(){
      if (this.filterType === "all") {
        this.collection.reset(contacts);

        contactsRouter.navigate("filter/all");

      } else {
        //since collection needs to be filtered first
        //pass silent:true so contacts are reset but event doesn't fire
        this.collection.reset(contacts, { silent: true });

        var filterType = this.filterType,
        //grap all the contacts whose type matches the filterType taken from the event
        //object passed on the filter select change event handler
        filtered = _.filter(this.collection.models, function (item){
          return item.get("type") === filterType;
        });
        //now that collection is filtered, reset contacts to show only the filtered ones
        this.collection.reset(filtered);

        contactsRouter.navigate("filter/" + filterType);
      }
    }
  });

  var ContactsRouter = Backbone.Router.extend({
    routes: {
      //URL to match(starts with '#filter', ends with anything else) - callback function
      "filter/:type": "urlFilter"
    },

    //pass type portion of URL as argument 
    urlFilter: function(type){
      //set or update filterType property of master view
      directory.filterType = type;
      //trigger custom change event again
      directory.trigger("change:filterType");
    }
  });

  var directory = new DirectoryView();
  var contactsRouter = new ContactsRouter();
  Backbone.history.start();
 
} (jQuery));
