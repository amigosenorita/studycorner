// Mock User Model for immediate local running
const users = [
    {
        _id: 'default-admin-id',
        id: 'default-admin-id',
        name: 'Main Admin',
        email: 'admin@admin.com',
        password: '$2a$10$pjlbBOxif7/GnOe7Y07VEu/lLHUcYFBOV7gpIBatBgkG80Uk0o1Sm', // admin123
        role: 'Admin',
        createdAt: new Date()
    }
];

class User {
    constructor(data) {
        Object.assign(this, data);
        this.role = this.role || 'Agent';
        this._id = Date.now().toString() + Math.floor(Math.random() * 1000);
        this.id = this._id;
    }
    async save() {
        users.push(this);
        return this;
    }
    static async findOne(query) {
        return users.find(u => u.email === query.email);
    }
    static async find() {
        return users.map(u => ({ _id: u._id, name: u.name, email: u.email, role: u.role }));
    }
    static async findByIdAndDelete(id) {
        const index = users.findIndex(u => u._id === id);
        if (index !== -1) {
            return users.splice(index, 1)[0];
        }
        return null;
    }
    static async findById(id) {
        return users.find(u => u._id === id || u.id === id) || null;
    }
    static async findByIdAndUpdatePassword(id, newHashedPassword) {
        const user = users.find(u => u._id === id || u.id === id);
        if (user) {
            user.password = newHashedPassword;
        }
        return user;
    }
}

module.exports = User;
