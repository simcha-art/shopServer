import { readBooksFile } from "./io.js"


function validator() { 
    return {
    isExistProduct: async (productId) => {
        const allProducts = await readBooksFile()
        const product = allProducts.find(product => product.productId = productId)
        return Boolean(product)
    },
    
    hasEnoughInStock: async (productId, quantity) => {
        const allProducts = await readBooksFile()
        const product = allProducts.find(product => product.id === +productId)
        return product.stock >= quantity
    }
}
}

export const valid = validator()


