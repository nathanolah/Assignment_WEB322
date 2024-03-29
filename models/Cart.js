//
module.exports = function cart(previousCart) { 
    if (previousCart.products != undefined) {
        this.products = previousCart.products;
    }
    else {
        this.products = {};
    };

    this.totalQuantity = previousCart.totalQuantity || 0;
    this.totalPrice = previousCart.totalPrice || 0;

    // Add function
    this.add = function (product, id, price) {
        var storedProduct = this.products[id];

        if (!storedProduct) {
            storedProduct = this.products[id] = {
                products: product, qty: 0, price: 0
            };
        }
        storedProduct.qty++;
        storedProduct.price = price * storedProduct.qty;

        this.totalQuantity += 1;
        this.totalPrice += storedProduct.price;

    }

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