//
module.exports = function cart(oldCart) { // (sessionCart)
    if (oldCart.products != undefined) {
        this.products = oldCart.products;
    }
    else {
        this.products = {};
    };

    this.totalQuantity = oldCart.totalQuantity || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.imgSrc = oldCart.imgSrc || "";

    // Add function
    this.add = function (product, id, price) {
        var storedProduct = this.products[id];

        if (!storedProduct) {
            // storedProduct = this.products[id] = {
            //     products: product, qty: 0, price: 0
            // };

            //FIX THIS
            //storedProduct = products[id] = product;
            console.log(products)

            if (products[id] != undefined){
            }
            else {
                storedProduct = this.products[id] = {
                    products: product, qty: 0, price: 0
                };

            }
        }
        storedProduct.qty++;
        storedProduct.price = price * storedProduct.qty;

        this.totalQuantity += 1;
        this.totalPrice += storedProduct.price;

    };

    // Remove 
    this.removeProduct = (id) => {
        this.totalQuantity -= this.products[id].qty;
        this.totalPrice -= this.products[id].price;
        delete this.products[id];
    }

    this.generateArray = function () {
        const arr = [];
        for (var id in this.products) {
            arr.push(this.products[id]);
        }
        return arr;
    }

}