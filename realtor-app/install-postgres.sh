#!/bin/bash
docker run --name nest-postgres -e POSTGRES_DB=mydb -e POSTGRES_PASSWORD=foobert99 -p 5432:5432 -v pgdata:/var/lib/postgresql/data -d postgres