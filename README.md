# Coding Challenge Background #

## Challenge Description ##

Company X has just bought a small start-up and we are interested in the defect trends in one of their products. Unfortunately all they have is a spreadsheet showing, for a given day, how many bugs are open for a given severity, how many remain to be verified, the number of incoming bugs on a particular day, and the total number of open defects.

## Your Tasks ##

Write a web-based application that accepts a comma-separated value file (a sample is shown below) by uploading the file and/or pasting it into a text area. The first row will always contain the column names, the columns are always in the same order, have the same name, and all columns contain data. Once the data is received it must be parsed and then stored in a relational database. After the data is stored the application must display all columns and rows, along with the average number of open defects.

## CSV Sample ##

```
Date,Sev2,Sev3,Sev4,To Verify,Total Open Defects,Total Bugs
2012-01-01,1,229,61,159,291,1223
2012-01-02,1,232,61,147,294,1228
2012-01-03,1,238,67,147,306,1240
2012-01-04,2,237,66,154,305,1252
2012-01-05,2,228,59,170,289,1261
2012-01-06,2,228,59,162,289,1263
2012-01-07,2,228,59,162,289,1263
2012-01-08,2,228,59,161,289,1263
2012-01-09,1,224,62,158,287,1267
```

# Developer Guide #

## Requirements ##

You need to install Node v0.8.8, NPM v1.1.49, and PostgreSQL v8.4+ to be able to run the server-side portion of this.

## Database Setup ##

``` bash
$ createuser -U postgres -P defects
Enter password for new role: defects
Enter it again: defects
Shall the new role be a superuser? (y/n) y
```

``` bash
$ psql -U defects postgres
postgres=# CREATE DATABASE defects;
CREATE DATABASE
postgres=# ^D
```

``` bash
$ psql -U defects defects
postgres=# CREATE TABLE metadata (
	date VARCHAR(80) NOT NULL,
	severities VARCHAR(80)[] NOT NULL,
	to_verify VARCHAR(80) NOT NULL,
	opened VARCHAR(80) NOT NULL,
	total VARCHAR(80) NOT NULL
);
postgres=# CREATE TABLE defect_count (
	date DATE PRIMARY KEY,
	severities INTEGER[] NOT NULL,
	to_verify INTEGER NOT NULL,
	opened INTEGER NOT NULL,
	total INTEGER NOT NULL
);
```

## Steps ##

These steps assume that the requirements above have been installed and that node, npm, and psql are in your path.

``` bash
git clone git clone https://github.com/mrtidy/project-x-defects.git
cd project-x-defects
npm install
node node/src/main.js
```

Now you can point your browser at http://localhost:8000/ to view the application.
