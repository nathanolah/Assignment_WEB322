// in the rubric best seller must be a different module?
const bestSeller = {
    fakeDB:[],

  // Gets all the images for best sellers
    init() { 
        this.fakeDB.push({image:'/img/productsCategory/electronics.jpg', category:'Electronics & Accessories', title: "Headphones", price:'123.00', bestSeller: true});
        this.fakeDB.push({image:'/img/productsCategory/livingroom.jpg', category:'Furniture', price:'60.00', title:'Living room set', bestSeller: true});
        this.fakeDB.push({image:'/img/productsCategory/tools.jpg', category:'Tools', price:'$80.00', title:'Tool sets', price:'60.00', bestSeller: true});
        this.fakeDB.push({image:'/img/products/laptop.jpg', category:'Computers', title: "Laptop", price:'300.00', bestSeller: true});
        this.fakeDB.push({image:'/img/products/camera.jpg', category:'Electronics & Accessories', title: 'Camera Lens', price:'123.00', bestSeller: true});
    },

    // Returns the data
    getAllProducts() {
        return this.fakeDB;
    }
}

// Initiate Populate fakeDB
bestSeller.init();
module.exports = bestSeller;