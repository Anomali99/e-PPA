# e-PPA Backend

![Python Badge](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff&style=flat)
![Flask Badge](https://img.shields.io/badge/Flask-000?logo=flask&logoColor=fff&style=flat)

## Tech Stack

- Language: `Python 3.12.3`
- Framework: `Flask 3.0.3`
- ORM: `SQLAlchemy 2.0.31`
- Database: `MariaDB 11.3.2`
- Authentication: `Flask-HTTPAuth 4.8.0`

## Installation

```ps
cd backend
```

### 1. Database Installation

login database

```ps
mysql -u <username> -p
```

import table

```
\. ./database/index.sql
```

### 2. Create `.env` file

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_PORT=3306
DB_NAME=db_ppa
```

### 3. Create Python Virtual Environment

```ps
python -m venv venv
```

or

```ps
python3 -m venv venv
```

### 4. Install Requirements

activate venv in windows

```ps
venv/Scripts/activate
```

or activate venv in linux

```ps
source venv/bin/activate
```

install requirements

```ps
pip install -r requirements.txt
```

### 5. Create Static Folder

```ps
mkdir static
```

### 6. Install PM2

```ps
npm install -g pm2@latest
```

### 7. Deploy

```ps
pm2 start app.py --name e-PPA --interpreter=python3 -- --port 5127
```
