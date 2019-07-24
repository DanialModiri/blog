const CategoryClass = require('./category')


const tree = [
    { _id: 1, title: 'کالای دیجیتال', parent: null },
    { _id: 2, title: 'موبایل', parent: 1 },
    { _id: 3, title: 'لپتاپ', parent: 1 },
    { _id: 4, title: 'کنسول بازی', parent: 1 },
    { _id: 5, title: 'سامسونگ', parent: 2 },
    { _id: 6, title: 'پلی استیشن', parent: 4 },
    { _id: 7, title: 'ایفون', parent: 2 },
    { _id: 8, title: 'ایکس باکس', parent: 4 },
    { _id: 9, title: 'لوازم خانگی', parent: null },
    { _id: 10, title: 'آشپزخانه', parent: 9 },
    { _id: 11, title: 'لوازم برقی', parent: 10 }
]

const Category = {
    async find({ parent }){
        return tree.filter(item => item.parent === parent )
    }
}

const cat = new CategoryClass(Category);

cat.getDefaultTreeView().then(res => {
    console.log(res)
});