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
    //container for view
    tagName: "article",
    //class name for container
    className: "contact-container",
    //cached reference to template wrapped in jQuery
    template: $("#contactTemplate").html(),
   
    render: function () {
      //When passed a single arg containing a template 
      //Underscore doesn’t invoke it immediately but 
      //will return method that can be called
      //to actually render the template
      var tmpl = _.template(this.template);
      //set <article> HTML created by view to interpolated template 
      //then call templating function that Underscore returned
      //passing it data to interpolate
      this.$el.html(tmpl(this.model.toJSON()));
      return this;
    }
  });

  var DirectoryView = Backbone.View.extend({
    el: $("#contacts"),
   
    initialize: function () {
      //create instance of collection class
      this.collection = new Directory(contacts);
      //call own render() defined below making view self-rendering
      this.render();
    },
 
    //define render() method for master view
    render: function () {
      //store reference to view so we can access it with callback
      var that = this;
      //iterate over each contact model in collection
      //within .each 'this' refers to new Directory collection obj
      _.each(this.collection.models, function (item) {
          that.renderContact(item);
      }, this);
    },
 
    renderContact: function(item) {
      var contactView = new ContactView({
          model: item
      });
      //append each <article> template to #contacts
      this.$el.append(contactView.render().el);
    }
  });

  var directory = new DirectoryView();
 
} (jQuery));