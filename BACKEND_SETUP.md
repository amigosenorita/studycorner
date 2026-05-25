# Admission CRM: Frontend + Backend + PostgreSQL

This version uses:

- `client/` for the existing UI
- `server/` for the Node/Express API
- PostgreSQL for the database

The same backend can run locally and on AWS.

## Local Setup

### 1. Install PostgreSQL

Install PostgreSQL locally and make sure it is running on:

```text
127.0.0.1:5432
```

### 2. Create Database

Open psql and run:

```sql
CREATE DATABASE admission_crm;
```

Then load the schema:

```bash
psql -U postgres -d admission_crm -f server/schema.sql
```

### 3. Install Backend Packages

```bash
cd server
npm install
```

### 4. Create `.env`

Copy:

```text
server/.env.example
```

to:

```text
server/.env
```

Example:

```text
PORT=5000
NODE_ENV=development
JWT_SECRET=my-long-secret
ADMIN_EMAIL=admin@studycorner.com
ADMIN_PASSWORD=admin123
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-postgres-password
DB_NAME=admission_crm
DB_SSL=false
```

### 5. Run Locally

```bash
cd server
npm start
```

Open:

```text
http://localhost:5000
```

Admin login:

```text
email: ADMIN_EMAIL
password: ADMIN_PASSWORD
```

The first admin account is created automatically on first login if it does not exist.

## AWS Deployment Idea

Recommended AWS setup:

- Backend + frontend: EC2, Elastic Beanstalk, or App Runner
- Database: Amazon RDS PostgreSQL
- Domain/SSL: Route 53 + ACM + Load Balancer if needed

### AWS RDS PostgreSQL

1. Create RDS PostgreSQL database.
2. Database name:

```text
admission_crm
```

3. Allow inbound PostgreSQL `5432` from your backend server security group.
4. Run `server/schema.sql` on RDS.
5. Set backend environment variables:

```text
DB_HOST=your-rds-endpoint.amazonaws.com
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=admission_crm
DB_SSL=true
JWT_SECRET=your-production-secret
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-admin-password
```

## Notes

- Uploaded images are stored as base64 text in PostgreSQL for this version.
- For high traffic production, move document images to AWS S3 and store only S3 URLs in PostgreSQL.
- PC and mobile will see the same data because both call the same backend API and PostgreSQL database.
