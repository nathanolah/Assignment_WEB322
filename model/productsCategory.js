const productsCategory = {
    fakeDB:[],

  // get all the images for product category section 
    init() {    // make sure names of images matches their appropriate attribute

        this.fakeDB.push({image:'/img/productsCategory/electronics.jpg', title:'Electronics & Accessories'});
        this.fakeDB.push({image:'/img/productsCategory/livingroom.jpg', title:'Revamp your home'});
        this.fakeDB.push({image:'/img/productsCategory/tools.jpg', title:'Shop for tools'});
        this.fakeDB.push({image:'/img/productsCategory/household.jpg', title:'Household Supplies'});
    },

    // Returns the data
    getAllProducts() {
        return this.fakeDB;
    }
}

// Initiate Populate fakeDB
productsCategory.init();
module.exports = productsCategory;