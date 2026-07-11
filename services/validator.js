import { readBooksFile } from "./io.js"


function validator() { 
    return {
    
    hasEnoughInStock:  (allProducts, productId, quantity) => {
        const product = allProducts.find(product => product.id === +productId)
        return product.stock >= quantity
    }
}
}

export const valid = validator()


