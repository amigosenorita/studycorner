let formOptions = [
    { _id: '1', category: 'Gender', value: 'Male', createdAt: new Date() },
    { _id: '2', category: 'Gender', value: 'Female', createdAt: new Date() },
    { _id: '3', category: 'Gender', value: 'Transgender', createdAt: new Date() },
    { _id: '4', category: 'First Graduate', value: 'Yes', createdAt: new Date() },
    { _id: '5', category: 'First Graduate', value: 'No', createdAt: new Date() },
    { _id: '6', category: 'Marital Status', value: 'Single', createdAt: new Date() },
    { _id: '7', category: 'Marital Status', value: 'Married', createdAt: new Date() },
    { _id: '8', category: 'Blood Group', value: 'A+', createdAt: new Date() },
    { _id: '9', category: 'Blood Group', value: 'A-', createdAt: new Date() },
    { _id: '10', category: 'Blood Group', value: 'B+', createdAt: new Date() },
    { _id: '11', category: 'Blood Group', value: 'B-', createdAt: new Date() },
    { _id: '12', category: 'Blood Group', value: 'O+', createdAt: new Date() },
    { _id: '13', category: 'Blood Group', value: 'O-', createdAt: new Date() },
    { _id: '14', category: 'Blood Group', value: 'AB+', createdAt: new Date() },
    { _id: '15', category: 'Blood Group', value: 'AB-', createdAt: new Date() },

    // Identity & Background
    { _id: 'r1', category: 'Religion', value: 'Hindu', createdAt: new Date() },
    { _id: 'r2', category: 'Religion', value: 'Muslim', createdAt: new Date() },
    { _id: 'r3', category: 'Religion', value: 'Christian', createdAt: new Date() },
    { _id: 'r4', category: 'Religion', value: 'Other', createdAt: new Date() },

    { _id: 'n1', category: 'Nationality', value: 'Indian', createdAt: new Date() },
    { _id: 'n2', category: 'Nationality', value: 'NRI', createdAt: new Date() },
    { _id: 'n3', category: 'Nationality', value: 'Other', createdAt: new Date() },

    { _id: 'mt1', category: 'Mother Tongue', value: 'Tamil', createdAt: new Date() },
    { _id: 'mt2', category: 'Mother Tongue', value: 'English', createdAt: new Date() },
    { _id: 'mt3', category: 'Mother Tongue', value: 'Hindi', createdAt: new Date() },
    { _id: 'mt4', category: 'Mother Tongue', value: 'Malayalam', createdAt: new Date() },
    { _id: 'mt5', category: 'Mother Tongue', value: 'Telugu', createdAt: new Date() },
    { _id: 'mt6', category: 'Mother Tongue', value: 'Kannada', createdAt: new Date() },

    // Coimbatore
    { _id: 'c1', category: 'Preferred College', value: 'KARPAGAM GROUP OF INSTITUTIONS - COIMBATORE', createdAt: new Date() },
    { _id: 'c2', category: 'Preferred College', value: 'SRI RANGANATHAR INSTITUTE OF ENG & TECHNOLOGY - COIMBATORE', createdAt: new Date() },
    { _id: 'c3', category: 'Preferred College', value: 'SUGUNA COLLELGE OF ENGINEERING - COIMBATORE', createdAt: new Date() },
    { _id: 'c4', category: 'Preferred College', value: 'RATHINAM GROUP OF INSTITUTIONS - COIMBATORE', createdAt: new Date() },
    { _id: 'c5', category: 'Preferred College', value: 'SREE SAKTHI ENGINEERING COLLEGE - COIMBATORE', createdAt: new Date() },
    { _id: 'c6', category: 'Preferred College', value: 'HINDUSTHAN GROUP OF INSTITUTIONS - COIMBATORE', createdAt: new Date() },
    { _id: 'c7', category: 'Preferred College', value: 'UNITED INSTITUTIONS OF TECHNOLOGY - COIMBATORE', createdAt: new Date() },
    { _id: 'c8', category: 'Preferred College', value: 'KATHIR COLLEGE OF ENGINEERING - COIMBATORE', createdAt: new Date() },
    { _id: 'c9', category: 'Preferred College', value: 'JCT COLLEGE OF ENGINEERING AND TECHNOLOGY - COIMBATORE', createdAt: new Date() },
    { _id: 'c10', category: 'Preferred College', value: 'DR.NGP INSTITUTE OF TECHNOLOGY - COIMBATORE', createdAt: new Date() },
    { _id: 'c11', category: 'Preferred College', value: 'CIET INSTITUTE OF ENGG AND TECHNOLOGY - COIMBATORE', createdAt: new Date() },
    { _id: 'c12', category: 'Preferred College', value: 'KGISL EDUCATIONAL INSTITUTIONS - COIMBATORE', createdAt: new Date() },
    { _id: 'c13', category: 'Preferred College', value: 'JANSON\'S INSTITUTE OF TECHNOLOGY - COIMBATORE', createdAt: new Date() },
    { _id: 'c14', category: 'Preferred College', value: 'KIT-KALAINAR KARUNANIDHI INSTITUTE OF TECHNOLOGY - COIMBATORE', createdAt: new Date() },
    { _id: 'c15', category: 'Preferred College', value: 'DHANALAKSHMI COLLEGE OF ENGINEERING - COIMBATORE', createdAt: new Date() },
    { _id: 'c16', category: 'Preferred College', value: 'INFO INSTITUTE OF ENGINEERING - COIMBATORE', createdAt: new Date() },
    { _id: 'c17', category: 'Preferred College', value: 'SRI LAKSHMI GROUP OF INTITUTIONS - COIMBATORE', createdAt: new Date() },
    { _id: 'c18', category: 'Preferred College', value: 'PPG GROUP OF INSTITUTUIONS - COIMBATORE', createdAt: new Date() },
    { _id: 'c19', category: 'Preferred College', value: 'ADHITHYA INSTITUIONS OF TECHNOLOGY - COIMBATORE', createdAt: new Date() },
    { _id: 'c20', category: 'Preferred College', value: 'AKSHAYA COLLEGE OF ENGINEERING - COIMBATORE', createdAt: new Date() },
    { _id: 'c21', category: 'Preferred College', value: 'NEHRU GROUP OF INSTITUTIONS - COIMBATORE', createdAt: new Date() },
    { _id: 'c22', category: 'Preferred College', value: 'SREE ABIRAMI COLLEGE OF ALLIED HEALTH SCIENCE - COIMBATORE', createdAt: new Date() },
    { _id: 'c23', category: 'Preferred College', value: 'KASTHURI INSTITUTE OF MANAGEMENT - COIMBATORE', createdAt: new Date() },
    { _id: 'c24', category: 'Preferred College', value: 'RVS GROUP OF ISNTITUIONS - COIMBATORE', createdAt: new Date() },

    // Chennai
    { _id: 'ch1', category: 'Preferred College', value: 'SRM UNIVERSITY - CHENNAI', createdAt: new Date() },
    { _id: 'ch2', category: 'Preferred College', value: 'HINDUSTAN GROUP - CHENNAI', createdAt: new Date() },
    { _id: 'ch3', category: 'Preferred College', value: 'SATHYABAMA UNIVERSITY - CHENNAI', createdAt: new Date() },
    { _id: 'ch4', category: 'Preferred College', value: 'VELS UNIVERSITY - CHENNAI', createdAt: new Date() },
    { _id: 'ch5', category: 'Preferred College', value: 'BHARATH ENGINEERING COLLEGE - CHENNAI', createdAt: new Date() },
    { _id: 'ch6', category: 'Preferred College', value: 'VEL-TECH - CHENNAI', createdAt: new Date() },
    { _id: 'ch7', category: 'Preferred College', value: 'AMRITA UNIVERSITY - CHENNAI', createdAt: new Date() },
    { _id: 'ch8', category: 'Preferred College', value: 'VIT ENGINEERING COLLEGE - CHENNAI', createdAt: new Date() },
    { _id: 'ch9', category: 'Preferred College', value: 'AVIT - CHENNAI', createdAt: new Date() },
    { _id: 'ch10', category: 'Preferred College', value: 'AMET UNIVERSITY - CHENNAI', createdAt: new Date() },
    { _id: 'ch11', category: 'Preferred College', value: 'DR MGR UNIVERSITY - CHENNAI', createdAt: new Date() },
    { _id: 'ch12', category: 'Preferred College', value: 'CHETTINAD ENGINEERING COLLEGE - CHENNAI', createdAt: new Date() },
    { _id: 'ch13', category: 'Preferred College', value: 'RAMACHADRA ENGINEERING COLLEGE - CHENNAI', createdAt: new Date() },
    { _id: 'ch14', category: 'Preferred College', value: 'SAVEETHA UNIVERSITY - CHENNAI', createdAt: new Date() },
    { _id: 'ch15', category: 'Preferred College', value: 'DHANALAKSHMI SRINIVASAN COLLEGE OF ENGINEERING - CHENNAI', createdAt: new Date() },
    { _id: 'ch16', category: 'Preferred College', value: 'DG VAISHMOV - CHENNAI', createdAt: new Date() },

    // Trichy & Perambalur
    { _id: 'tp1', category: 'Preferred College', value: 'DHANALAKSHMI SRINIVASAN UNIVERSITY - PERAMBALUR', createdAt: new Date() },
    { _id: 'tp2', category: 'Preferred College', value: 'DHANALAKSHMI SRINIVASAN GROUPS - PERAMBALUR', createdAt: new Date() },
    { _id: 'tp3', category: 'Preferred College', value: 'MEDICAL COLLEGE AND HOPITAL - SIRUVACHUR', createdAt: new Date() },
    { _id: 'tp4', category: 'Preferred College', value: 'SRI RAMAKRISHNA COLLEGE OF ENGINEERING - TRICHY', createdAt: new Date() },
    { _id: 'tp5', category: 'Preferred College', value: 'DHANALAKSHMI SRINIVASAN UNIVERSITY TIRUCHIRAPPALLI', createdAt: new Date() },
    { _id: 'tp6', category: 'Preferred College', value: 'M.A.M COLLEGE OF ENGINEERING - TRICHY', createdAt: new Date() },
    { _id: 'tp7', category: 'Preferred College', value: 'M.A.M COLLEGE OF EGINEERING AND TECHNOLOGY - TRICHY', createdAt: new Date() },
    { _id: 'tp8', category: 'Preferred College', value: 'M.A.M SCHOOL OF ENGINEERING - TRICHY', createdAt: new Date() },
    { _id: 'tp9', category: 'Preferred College', value: 'INDRA GANESAN INSTITUTIONS - TRICHY', createdAt: new Date() },
    { _id: 'tp10', category: 'Preferred College', value: 'CARE GROUP OF INSTITUTIONS - TRICHY', createdAt: new Date() },
    { _id: 'tp11', category: 'Preferred College', value: 'IMAYAM COLLEGE OF ENGINEERING - TRICHY', createdAt: new Date() },
    { _id: 'tp12', category: 'Preferred College', value: 'MAHALAKSHMI COLLEGE OF ALLIED HEALTH SCIENCE - TRICHY', createdAt: new Date() },

    // Salem & Namakkal
    { _id: 'sn1', category: 'Preferred College', value: 'PAAVAI GROUP OF INSTITUTIONS - NAMAKKAL', createdAt: new Date() },
    { _id: 'sn2', category: 'Preferred College', value: 'SENGUNTHAR INSTITUTIONS - SALEM', createdAt: new Date() },
    { _id: 'sn3', category: 'Preferred College', value: 'ERODE SENGUNTHAR ENGINEERING COLLEGE - ERODE', createdAt: new Date() },
    { _id: 'sn4', category: 'Preferred College', value: 'GNYANAMANI EDUCATIONAL INSTITUTIONS - NAMAKKAL', createdAt: new Date() },
    { _id: 'sn5', category: 'Preferred College', value: 'AVS ENGINEERING COLLEGE - SALEM', createdAt: new Date() },
    { _id: 'sn6', category: 'Preferred College', value: 'SRG ENGINEERING COLLEGE - NAMAKKAL', createdAt: new Date() },
    { _id: 'sn7', category: 'Preferred College', value: 'CMS COLLEGE OF ENGINEERING - NAMAKKAL', createdAt: new Date() },
    { _id: 'sn8', category: 'Preferred College', value: 'JKKM INSITUTIONS-T.N PALAYAM', createdAt: new Date() },
    { _id: 'sn9', category: 'Preferred College', value: 'JKKN INSTITUTIONS - NAMAKKAL', createdAt: new Date() },
    { _id: 'sn10', category: 'Preferred College', value: 'SSM COLLEGE ERODE', createdAt: new Date() },
    { _id: 'sn11', category: 'Preferred College', value: 'R.P SARATHY INSTITUTE OF TECHNOLOGY - SALEM', createdAt: new Date() },
    { _id: 'sn12', category: 'Preferred College', value: 'BUILDERS ENGINEERING COLLEGE - ERODE', createdAt: new Date() },
    { _id: 'sn13', category: 'Preferred College', value: 'ANNA POORNA ENGINEERING COLLEGE - SALEM', createdAt: new Date() },
    { _id: 'sn14', category: 'Preferred College', value: 'SHRI SHANMUGA EDUCATIONAL INSTITUTIONS - SALEM', createdAt: new Date() },
    { _id: 'sn15', category: 'Preferred College', value: 'VINAYAKA MISSIONS GROUP OF INSTITUTIONS - SALEM', createdAt: new Date() },
    { _id: 'sn16', category: 'Preferred College', value: 'KSR COLLEGE OF ENGINEERING - TIRUCHENGODE', createdAt: new Date() },
    { _id: 'sn17', category: 'Preferred College', value: 'SELVAM COLLGE OF TECHNOLOGY - NAMAKKAL', createdAt: new Date() },
    { _id: 'sn18', category: 'Preferred College', value: 'EXCEL GROUP OF INSTITUTIONS - NAMAKKAL', createdAt: new Date() },
    { _id: 'sn19', category: 'Preferred College', value: 'SHREE VENKATESWARA GROUP OF INSTITUTIONS - ERODE', createdAt: new Date() }
];

class FormOption {
    constructor(data) {
        Object.assign(this, data);
        this.createdAt = new Date();
        this._id = Date.now().toString() + Math.floor(Math.random() * 1000);
    }
    async save() {
        formOptions.push(this);
        return this;
    }
    static async find(query) {
        if (query && query.category) {
            return formOptions.filter(o => o.category === query.category);
        }
        return formOptions;
    }
    static async findByIdAndDelete(id) {
        const index = formOptions.findIndex(r => r._id === id);
        if (index !== -1) {
            return formOptions.splice(index, 1)[0];
        }
        return null;
    }
}

module.exports = FormOption;
