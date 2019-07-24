
class CategoryClass {

    constructor(Category) {
        this.Category = Category;
        this.getDefaultTreeView = this.getDefaultTreeView.bind(this);
    }

    async getNode(id) {
        const category = await Category.findById(id).exec();
        return category;
    }


    async getDefaultTreeView() {
        const tree = async (parent, output) => {
            const categories = await this.Category.find({ parent: parent });
            for (const category of categories) {
                const children = [];
                output.push({ ...category._doc, children });
                await tree(category._id, children);
            }
        }
        const output = [];
        await tree(null, output);
        return output;
    }

    async getTree() {
        
    }



    setTreeView(tree) {

    }

}


module.exports = CategoryClass;