// Mock Lead Model for immediate local running
const leads = [];

class Lead {
    constructor(data) {
        Object.assign(this, data);
        this.status = this.status || 'New Lead';
        this.createdAt = new Date();
        this._id = Date.now().toString() + Math.floor(Math.random() * 1000);
    }
    async save() {
        leads.push(this);
        return this;
    }
    static find(query = {}) {
        let filtered = [...leads];
        if (query.referredBy) {
            filtered = filtered.filter(l => l.referredBy === query.referredBy);
        }
        return {
            sort: () => filtered.sort((a, b) => b.createdAt - a.createdAt),
            lean: () => filtered
        };
    }
    static async countDocuments(query = {}) {
        let filtered = leads;
        if (query.referredBy) {
            filtered = leads.filter(l => l.referredBy === query.referredBy);
        }
        return filtered.length;
    }
    static async aggregate(pipeline, query = {}) {
        let groupMap = {};
        let field = pipeline[0].$group?._id?.replace("$", "") || pipeline[1]?.$group?._id?.replace("$", "");

        let targetLeads = leads;
        if (query.referredBy) {
            targetLeads = leads.filter(l => l.referredBy === query.referredBy);
        }

        for (const lead of targetLeads) {
            let val = lead[field] || "Unknown";
            groupMap[val] = (groupMap[val] || 0) + 1;
        }
        return Object.keys(groupMap).map(k => ({ _id: k, count: groupMap[k] }));
    }
    static async findByIdAndUpdate(id, update) {
        let lead = leads.find(l => l._id == id);
        if (lead) {
            Object.assign(lead, update.status ? { status: update.status } : update);
        }
        return lead;
    }
    static async findByIdAndDelete(id) {
        const index = leads.findIndex(l => l._id == id);
        if (index !== -1) {
            return leads.splice(index, 1)[0];
        }
        return null;
    }
}

module.exports = Lead;
