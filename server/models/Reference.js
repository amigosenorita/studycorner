const references = [
    { _id: 'r1', name: 'Direct Admission', createdAt: new Date() },
    { _id: 'r2', name: 'Arun Rajendran', createdAt: new Date() },
    { _id: 'r3', name: 'Ariprasanna', createdAt: new Date() },
    { _id: 'r4', name: 'Manikandan', createdAt: new Date() },
    { _id: 'r5', name: 'Suvi E Trust', createdAt: new Date() },
    { _id: 'r6', name: 'Hariharan', createdAt: new Date() },
    { _id: 'r7', name: 'Jenith', createdAt: new Date() }
];

class Reference {
    constructor(data) {
        Object.assign(this, data);
        this.createdAt = new Date();
        this._id = Date.now().toString() + Math.floor(Math.random() * 1000);
    }
    async save() {
        references.push(this);
        return this;
    }
    static async find() {
        return references;
    }
    static async findByIdAndDelete(id) {
        const index = references.findIndex(r => r._id === id);
        if (index !== -1) {
            return references.splice(index, 1)[0];
        }
        return null;
    }
}

module.exports = Reference;
